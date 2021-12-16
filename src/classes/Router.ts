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

  /** current path (relative to the site root) */
  #currentPath = '';

  /** site root URI */
  readonly #root;

  /** URI check frequency */
  readonly #delay;

  constructor(root: string, delay = 50) {
    this.#root = root;
    this.#delay = delay;
  }

  /**
   * Method for adding a route to a router
   * @param path relative path route
   * @param callback callback function for route
   */

  addRoute(path: string, callback: TRouteCallback) {
    this.#routes.push({
      path,
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

  #changeRoute(force?: boolean) {
    if (this.#currentPath !== this.#getPath() || force === true) {
      this.#currentPath = this.#getPath();

      const route = this.findRoute(this.#currentPath);

      if (!route) {
        throw new Error(`Path '${this.#currentPath}' is undefined`);
      } else {
        route.callback();
        route.isCalled = true;
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
    if (path !== this.#currentPath) {
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
