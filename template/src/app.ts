import Router from './router';
import './global.css';

const router = new Router();

document.body.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    event.preventDefault();
    const path = event.target.getAttribute('href')!;
    history.pushState({}, '', path);
    router.navigate(path);
  }
});

router.init();