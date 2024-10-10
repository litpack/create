import { Route } from "@/utils/navigation"; 

const routers: { [key: string]: Route } = {
  "/": {
    component: () => import("@/pages/home"),
    preload: true,
    meta: { title: "Home", description: "Welcome to the homepage" },
    layout: () => import("@/layouts/navbar")
  },
  "/about": {
    component: () => import("@/pages/about"),
    preload: false,
    meta: { title: "About", description: "Learn more about us" },
    layout: () => import("@/layouts/navbar")
  },
  "/gallery": {
    component: () => import("@/pages/image-gallery"),
    preload: false,
    meta: { title: "gallery", description: "Our image gallery" },
    layout: () => import("@/layouts/navbar")
  },
  "*": {
    component: () => import("@/pages/not-found"),
    preload: false,
  },
};

export default routers;
