/**
 * @module Router
 */

import { TRoute, TRouteCallback } from '@type/router';

/**
 * Class for creating a router with History API support
 */

class Router {
  /** array of saved routes */
  #routes: TRoute[] = [];

  /** current route */
  #currentRoute: TRoute | undefined;

  /** site root URI */
  readonly #root;

  /** URI check frequency */
  readonly #delay;

  constructor(root: string, delay = 50) {
    this.#root = root;
    this.#delay = delay;
  }

  /**
   * Method for change a title to a browser tab
   */

  changeTitle(): void {
    if (this.#currentRoute) {
      document.title = this.#currentRoute.title;
    }
  }

  /**
   * Method for adding a route to a router
   * @param path relative path route
   * @param title the title of the browser tab
   * @param callback callback function for route
   */

  addRoute(path: string, title: string, callback: TRouteCallback): Router {
    this.#routes.push({
      path,
      title,
      callback,
      isCalled: false,
    });
    return this;
  }

  /**
   * Method for finding a route in the array of saved routes of the router
   * @param path relative path route
   */

  findRoute(path: string): TRoute | undefined {
    return this.#routes.find((r) => r.path === path);
  }

  /**
   * Method whether the given route was called
   * @param path relative path route
   */

  checkRoute(path: string): boolean | undefined {
    const route = this.findRoute(path);
    return route?.isCalled;
  }

  /**
   * Method for changing the route in the router (changes the saved current path and calls the callback function of the new route)
   * @param force flag of forced route change (for the page reload to work by clicking on the current link)
   */

  #changeRoute(force?: boolean): void {
    const newPath = this.#getPath();

    if (this.#currentRoute?.path !== newPath || force === true) {
      this.#currentRoute = this.findRoute(newPath);

      if (!this.#currentRoute) {
        throw new Error(`Path '${newPath}' is undefined`);
      } else {
        this.#currentRoute.callback();
        this.#currentRoute.isCalled = true;
        this.changeTitle();
      }
    }
  }

  /**
   * Method for getting relative path from URI
   */

  #getPath(): string {
    const URI = decodeURI(window.location.href);
    return URI.replace(this.#root, '');
  }

  /**
   * Method for changing the URI in the browser address bar
   * @param path relative path route
   */

  changeURI(path: string): void {
    if (path !== this.#currentRoute?.path) {
      window.history.pushState(null, '', this.#root + path);
    } else {
      this.#changeRoute(true);
    }
  }

  /**
   * Method for initializing the router (analogous to the URI change listener)
   */

  init(): void {
    setInterval(this.#changeRoute.bind(this), this.#delay);
  }
}

export default Router;
