import Router from "@/utils/navigation";
import routers from "@/router";
import "@/global.css";

const router = new Router(routers);

window.addEventListener("popstate", () => {
  router.navigate(window.location.pathname);
});

document.body.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    event.preventDefault();
    const path = event.target.getAttribute("href")!;
    history.pushState({}, "", path);
    router.navigate(path);
  }
});

router.init();

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    router.init();
  });
}