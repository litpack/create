interface Route {
  component: () => Promise<any>;
  children?: { [key: string]: Route };
}

export default class Router {
  private routes: { [key: string]: Route } = {
    "/": {
      component: () => import("./pages/home"),
    },
    "/about": {
      component: () => import("./pages/about"),
    },
  };

  async navigate(path: string) {
    const rootElement = document.getElementById("app");
    if (!rootElement) return;

    const [matchedRoute, remainingPath] = this.matchRoute(
      path.split("/").filter(Boolean)
    );

    if (matchedRoute) {
      rootElement.innerHTML = "";

      const { default: Component } = await matchedRoute.component();
      const componentInstance = new Component();

      rootElement.appendChild(componentInstance);
      componentInstance.render();

      if (remainingPath.length > 0 && matchedRoute.children) {
        this.navigateNested(
          componentInstance,
          matchedRoute.children,
          remainingPath
        );
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

    const { default: ChildComponent } = await nextRoute.component();
    const childInstance = new ChildComponent();

    const slotElement = parentComponent.getChildSlot();
    if (!slotElement) return;

    slotElement.innerHTML = "";
    slotElement.appendChild(childInstance);
    childInstance.render();

    if (remainingSegments.length > 0 && nextRoute.children) {
      this.navigateNested(childInstance, nextRoute.children, remainingSegments);
    }
  }

  matchRoute(pathSegments: string[]): [Route | null, string[]] {
    let currentRoute = this.routes["/"];
    let remainingPath = pathSegments;

    for (const segment of pathSegments) {
      if (this.routes[`/${segment}`]) {
        currentRoute = this.routes[`/${segment}`];
        remainingPath = remainingPath.slice(1);
        break;
      }
    }

    return [currentRoute, remainingPath];
  }

  init() {
    this.navigate(window.location.pathname);
    window.addEventListener("popstate", () =>
      this.navigate(window.location.pathname)
    );
  }
}
