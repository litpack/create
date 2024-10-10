import 'reflect-metadata';
import Router from "@/utils/navigation";
import routers from "@/router";
import "@/global.css";
// import { MyHttpInterceptor } from '@/utils/http-interceptor';
// import { container } from '@/utils/container';

// const interceptor = container.get<MyHttpInterceptor>('HttpInterceptor');
// interceptor.setConfig({
//     headers: {
//         Authorization: 'Bearer your_token_here',
//         'Content-Type': 'application/json',
//     },
// });

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
        console.log('Module updated!');
    });
}
