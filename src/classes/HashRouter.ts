/**
 * @module Router
 */

import { IUser } from '@type/user';
import { THRoute, TRouteCallback } from '@type/router';
import LocalStorage, { CurrencyType } from '@classes/LocalStorage';

import Item from '@classes/Item';
import Navigation from '@classes/Navigation';
import ProductAPI from '@api/product';

/**
 * Class for creating a router with hash support
 */

class HashRouter {
  /** array of saved routes */
  #routes: THRoute[] = [];

  /**
   * Method for change a title to a browser tab
   */

  static #changeTitle(title: string): void {
    document.title = title;
  }

  /**
   * Method for adding a route to a router
   * @param hash hash route
   * @param title the title of the browser tab
   * @param callback callback function for route
   */

  addRoute(hash: string, title: string, callback: TRouteCallback): HashRouter {
    this.#routes.push({
      hash,
      title,
      callback,
      isCalled: false,
    });
    return this;
  }

  /**
   * Метод для создания пути товара при перезагрузке страницы
   * @param hash хэш пути
   * @param user пользователь из локального хранилища
   * @param products список всех продуктов из локального хранилища
   */

  async createRoute(
    hash: string,
    user: IUser,
    currency: CurrencyType,
  ): Promise<boolean> {
    console.log("createRoute   hash")
    const product = await ProductAPI.getProductsByList([hash], currency);
    if (product && product.length) {
      this.addRoute(hash, product[0].data.name, () => {
        LocalStorage.getUserData().then((userData)=>{
          if(userData){
            Navigation.showMainNavContainer();
            Item.showSelectedItem(product[0], userData, Item.createSelectedItem);
          }
        })
      });
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      return true;
    }
    return false;
  }

  /**
   * Method for finding a route in the array of saved routes of the router
   * @param hash hash route
   */

  findRoute(hash: string): THRoute | undefined {
    return this.#routes.find((r) => r.hash === hash);
  }

  /**
   * Method whether the given route was called
   * @param hash hash route
   */

  checkRoute(hash: string): boolean | undefined {
    const route = this.findRoute(hash);
    return route?.isCalled;
  }

  /**
   * Method for getting hash
   */

  static #getHash(): string {
    return window.location.hash.slice(1);
  }

  /**
   * Method for initializing the router
   * @param user пользователь из локального хранилища
   * @param products список всех продуктов из локального хранилища
   */

  init(user: IUser, currency: CurrencyType) {
    window.addEventListener('hashchange', async () => {
      const hash = HashRouter.#getHash();
      const route = this.findRoute(hash);
      if (route) {
        route.callback();
        route.isCalled = true;
        HashRouter.#changeTitle(route.title);
      } else {
        // пробуем создать путь сами
        const isRouteCreated = await this.createRoute(hash, user, currency);

        if (!isRouteCreated) {
          HashRouter.#changeTitle('*****');
          throw new Error(`Path #'${hash}' is undefined`);
        }
      }
    });
  }
}

export default HashRouter;
