interface Route {
  component: () => Promise<any>;
  children?: { [key: string]: Route };
  params?: { [key: string]: any };
  beforeEnter?: () => boolean | Promise<boolean>;
  afterEnter?: () => void;
  preload?: boolean;
  redirect?: string;
  queryParams?: { [key: string]: any };
  meta?: { title?: string; description?: string };
  layout?: string;
  errorComponent?: () => Promise<any>;
  prefetch?: boolean;
  alias?: string[];
}

type Middleware = (params?: any) => boolean | Promise<boolean>;

export default class Router {
  private routes: { [key: string]: Route } = {
    "/": {
      component: () => import("./pages/home"),
      preload: true,
      meta: { title: "Home", description: "Welcome to the homepage" },
      layout: "main",
    },
    "/about": {
      component: () => import("./pages/about"),
      preload: false,
      meta: { title: "About", description: "Learn more about us" },
      layout: "main",
    },
    "*": {
      component: () => import("./pages/not-found"),
      preload: false,
    },
  };

  private middleware: Middleware[] = [];
  private history: string[] = [];
  private scrollPositions: { [key: string]: number } = {};
  private plugins: Function[] = [];

  init() {
    const initialPath = window.location.pathname;
    this.navigate(initialPath);
  }

  async navigate(path: string) {
    const rootElement = document.getElementById("app");
    if (!rootElement) return;

    const [matchedRoute, remainingPath, params, queryParams] = this.matchRoute(
      path.split("/").filter(Boolean)
    );

    if (matchedRoute && matchedRoute.redirect) {
      this.navigate(matchedRoute.redirect);
      return;
    }

    if (matchedRoute) {
      if (await this.runMiddleware(params)) {
        if (matchedRoute.beforeEnter) {
          const canProceed = await matchedRoute.beforeEnter();
          if (!canProceed) return;
        }

        this.setLoading(true);

        if (matchedRoute.preload) {
          await this.preloadComponent(matchedRoute);
        }

        rootElement.innerHTML = "";
        const { default: Component } = await matchedRoute.component();
        const componentInstance = new Component({ ...params, ...queryParams });

        // if (matchedRoute.layout) {
        //   const layoutComponent = await this.loadLayout(matchedRoute.layout);
        //   rootElement.appendChild(layoutComponent);
        // }

        rootElement.appendChild(componentInstance);
        componentInstance.render();

        if (remainingPath.length > 0 && matchedRoute.children) {
          await this.navigateNested(componentInstance, matchedRoute.children, remainingPath);
        }

        if (matchedRoute.afterEnter) {
          matchedRoute.afterEnter();
        }

        this.history.push(path);
        this.scrollPositions[path] = window.scrollY;
        this.setLoading(false);

        if (matchedRoute.meta && matchedRoute.meta.title) {
          document.title = matchedRoute.meta.title;
        }
      }
    } else {
      await this.handleNotFound(rootElement);
    }
  }
  // async loadLayout(layoutName: string) {
  //   const { default: Layout } = await import(`./layouts/${layoutName}`);
  //   return new Layout(); // Instantiate the layout
  // }

  async runMiddleware(params?: any): Promise<boolean> {
    for (const mw of this.middleware) {
      const result = await mw(params);
      if (!result) return false;
    }
    return true;
  }

  async preloadComponent(route: Route) {
    if (route.component) {
      await route.component();
    }

    if (route.children) {
      for (const childKey in route.children) {
        const childRoute = route.children[childKey];
        if (childRoute.preload) {
          await this.preloadComponent(childRoute);
        }
      }
    }
  }

  async navigateNested(
    parentComponent: any,
    children: { [key: string]: Route },
    pathSegments: string[]
  ) {
    const [nextSegment, ...remainingSegments] = pathSegments;
    const nextRoute = children[nextSegment];

    if (!nextRoute) return;

    if (nextRoute.preload) {
      await this.preloadComponent(nextRoute);
    }

    const { default: ChildComponent } = await nextRoute.component();
    const childInstance = new ChildComponent();

    const slotElement = parentComponent.getChildSlot();
    if (!slotElement) return;

    slotElement.innerHTML = "";
    slotElement.appendChild(childInstance);
    childInstance.render();

    if (remainingSegments.length > 0 && nextRoute.children) {
      await this.navigateNested(childInstance, nextRoute.children, remainingSegments);
    }
  }

  matchRoute(pathSegments: string[]): [Route | null, string[], { [key: string]: string } | null, { [key: string]: string } | null] {
    let currentRoute: Route | null = null;
    let remainingPath = pathSegments;
    let params: { [key: string]: string } | null = null;
    let queryParams: { [key: string]: string } | null = null;

    const pathWithQuery = pathSegments.join("/");
    const queryIndex = pathWithQuery.indexOf("?");
    const queryString = queryIndex !== -1 ? pathWithQuery.slice(queryIndex + 1) : "";
    
    if (queryString) {
      queryParams = this.parseQueryParams(queryString);
    }

    if (pathSegments.length === 0 || (pathSegments.length === 1 && pathSegments[0] === "")) {
      currentRoute = this.routes["/"];
      remainingPath = [];
    } else {
      for (const segment of pathSegments) {
        const dynamicRouteKey = `/${segment}`;
        if (this.routes[dynamicRouteKey]) {
          currentRoute = this.routes[dynamicRouteKey];
          remainingPath = remainingPath.slice(1);
          break;
        }

        for (const routeKey in this.routes) {
          const routePattern = routeKey.split("/").filter(Boolean);
          if (routePattern.length === pathSegments.length) {
            const matchParams: { [key: string]: string } = {};
            let isMatch = true;

            for (let i = 0; i < routePattern.length; i++) {
              if (routePattern[i].startsWith(":")) {
                matchParams[routePattern[i].slice(1)] = pathSegments[i];
              } else if (routePattern[i] !== pathSegments[i]) {
                isMatch = false;
                break;
              }
            }

            if (isMatch) {
              currentRoute = this.routes[routeKey];
              params = matchParams;
              remainingPath = [];
              break;
            }
          }
        }
      }
    }

    if (!currentRoute) {
      currentRoute = this.routes["*"];
    }

    return [currentRoute, remainingPath, params, queryParams];
  }

  parseQueryParams(queryString: string): { [key: string]: string } {
    return queryString.split("&").reduce((params, param) => {
      const [key, value] = param.split("=");
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || "");
      }
      return params;
    }, {} as { [key: string]: string });
  }

  async handleNotFound(rootElement: HTMLElement) {
    rootElement.innerHTML = "";
    const { default: NotFoundComponent } = await import("./pages/not-found");
    const notFoundInstance = new NotFoundComponent();
    rootElement.appendChild(notFoundInstance);
    notFoundInstance.render();
  }

  setLoading(loading: boolean) {
    // this.loading = loading;
    const loadingIndicator = document.getElementById("loading-indicator");
    if (loadingIndicator) {
      loadingIndicator.style.display = loading ? "block" : "none";
    }
  }

  use(middleware: Middleware) {
    this.middleware.push(middleware);
  }

  addRoute(path: string, route: Route) {
    this.routes[path] = route;
  }

  removeRoute(path: string) {
    delete this.routes[path];
  }

  registerPlugin(plugin: Function) {
    this.plugins.push(plugin);
    plugin(this);
  }
}
