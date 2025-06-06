import routes from '../routes/routes';
import { 
  getActivePathname,
  getActiveRoute
 } from '../routes/url-parser';
import { renderNav } from '../utils';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #currentPath = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#currentPath = getActivePathname();

    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  async renderPage() {
    const prevPath = this.#currentPath;
    const url = getActiveRoute();
    const page = routes[url] || routes['*'];
    const nextPath = getActivePathname();

    renderNav();

    const isHomeToDetail =
      prevPath === '/' &&
      nextPath.startsWith('/stories/') &&
      url === '/stories/:id';

    const isDetailToHome =
      prevPath.startsWith('/stories/') &&
      url === '/' &&
      nextPath === '/';

    if ((isHomeToDetail || isDetailToHome) && document.startViewTransition) {
      await document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      });
    } else if (isHomeToDetail || isDetailToHome) {
      this.#content.classList.add('fade');
      await new Promise((resolve) => setTimeout(resolve, 400));
      this.#content.innerHTML = await page.render();
      await page.afterRender();
      this.#content.classList.remove('fade');
      this.#content.classList.add('fade-in');
      setTimeout(() => {
        this.#content.classList.remove('fade-in');
      }, 400);
    } else {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    }

    this.#currentPath = nextPath;
  }
}

export default App;
