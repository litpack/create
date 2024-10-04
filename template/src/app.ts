import Router from './router';
import './global.css';

const router = new Router();

const handleRouterUpdate = async (newRouter: new () => Router) => {
    console.log("Router module updated!");
    const updatedRouter = new newRouter();
    await updatedRouter.init();
};

if (module.hot) {
  console.log('HMR enabled.');

  module.hot.accept('./router', async () => {
      console.log('Attempting to update router module...');
      try {
          const newRouterModule = (await import('./router')).default;
          console.log('Router module updated:', newRouterModule);
          await handleRouterUpdate(newRouterModule);
      } catch (error) {
          console.error('Error updating router module:', error);
      }
  });

  module.hot.accept('./global.css', () => {
      console.log("Global CSS updated!");
  });
}


document.body.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
        event.preventDefault();
        const path = event.target.getAttribute('href')!;
        history.pushState({}, '', path);
        router.navigate(path);
    }
});

router.init();
