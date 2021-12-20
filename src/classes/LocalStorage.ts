/**
 * @module Local Storage
 */

import { TFilter } from '@type/product';
import UserAPI from '@api/user';
import ProductAPI from '@api/product';
import {
  TCurrency,
  IProductLocalStorageData,
  IUserLocalStorageData,
  TLocalData,
} from '@type/local-storage';

/**
 * Класс для работы с локальным хранилищем
 */

class LocalStorage {
  /** ID пользователя для рабоаты */
  #userId = '61a6286353b5dad92e57b4c0';

  /** Валюта продуктов */
  #currency = 'RUB' as TCurrency;

  /**
   * Метод для получения валюты продуктов
   */

  getCurrency() {
    return this.#currency;
  }

  /**
   * Метод для получения данных из локального хранилища
   * @param id ID запрашиваемых данных
   */

  getLocalData(id: string): TLocalData {
    const dataJson: string | null = localStorage.getItem(`${id}`);
    if (dataJson) return JSON.parse(dataJson);
    return null;
  }

  /**
   * Метод для отправки данных пользователя с локального хранилища в БД
   */

  async sendUserData() {
    const userData = this.getLocalData('user') as IUserLocalStorageData | null;
    if (userData) {
      const data = await UserAPI.changeUserData(userData.data);
    }
  }

  /**
   * Метод для получения данных пользователя из БД и сохранения их в локальное хранилище
   */

  async updateUserData() {
    const userData = await UserAPI.getUserByID(this.#userId);
    if (!userData) return null;
    const localUserData = {
      data: userData,
      dateAdded: Date.now(),
    };
    localStorage.setItem('user', JSON.stringify(localUserData));
    return userData;
  }


  /**
   * Метод для получения продуктов по типу из БД и сохранения их в локальное хранилище
   * @param filter - тип продукта
   */

  async updateProductDataByFilter(filter: TFilter | 'All') {
    const productDataByFilter = await ProductAPI.getProductsByFilter(
      filter,
      this.#currency,
    );
    if (!productDataByFilter) return null;
    const localProductData = {
      data: productDataByFilter,
      dateAdded: Date.now(),
    };
    localStorage.setItem(filter, JSON.stringify(localProductData));
    return productDataByFilter;
  }


  /**
   * Главный метод для получения продуктов
   * @param filter - тип продукта
   */

  async getProductDataByFilter(filter: TFilter | 'All') {
    const productDataStorageByFilter = this.getLocalData(
      filter,
    ) as IProductLocalStorageData | null;
    if (!productDataStorageByFilter) {
      const productDataByFilter = await this.updateProductDataByFilter(filter);
      if (productDataByFilter) return productDataByFilter;
    } else if (Date.now() - productDataStorageByFilter.dateAdded < 3000000) {
      // 3000000 - 10 минут - максимальное время актуальности данных в локальном хранилище
      setTimeout(() => {
        // запрос на получение новых данных после отрисоки на основе данных из локального хранилища
        this.updateProductDataByFilter(filter).then(() => {});
      });
      return productDataStorageByFilter.data;
    } else {
      const productDataByFilter = await this.updateProductDataByFilter(filter);
      if (productDataByFilter) return productDataByFilter;
    }
    return null;
  }


  /**
   * Главный метод для получения данных пользователя
   */

  async getUserData() {
    const userDataStorage = this.getLocalData(
      'user',
    ) as IUserLocalStorageData | null;
    if (!userDataStorage) {
      const userData = await this.updateUserData();
      if (userData) return userData;
    } else if (Date.now() - userDataStorage.dateAdded < 3000000) {
      // 3000000 - 10 минут
      return userDataStorage.data;
    } else {
      const userData = await this.updateUserData();
      if (userData) return userData;
    }
    return null;
  }


  /**
   * Метод для получения продуктов из БД по списку из пользовательских данных
   * @param listType - тип списка
   */

  async getListData(listType: 'shoppingList' | 'wishlist') {
    // всегда берем актуальные данные с сервера по списку id
    const userData = await this.getUserData();
    if (userData) {
      if (userData[listType].length > 0) {
        return ProductAPI.getProductsByList(userData[listType], this.#currency);
      }
    }
    return null;
  }

  /**
   * Метод для изменения локальной корзины пользователя
   * @param productId ID продукта
   * @param listType выбор типа списка продуктов
   */

  changeUserProductList(
    productId: string,
    listType: "shoppingList" | "wishlist"
  ): IUserLocalStorageData | null {
    const user = this.getLocalData('user') as IUserLocalStorageData | null;
    if (user) {
      const index: number = user.data[listType].indexOf(productId);
      if (index !== -1) {
        user.data[listType].splice(index, 1);
      } else {
        user.data[listType].push(productId);
      }
      localStorage.setItem('user', JSON.stringify(user));
      //передача пользовательских данных на сервер после отрисовки
      setTimeout(() => this.sendUserData());
      return user;
    }
    return null;
  }
}

export default new LocalStorage();
