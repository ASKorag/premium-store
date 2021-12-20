/**
 * @module API
 */

import { IProduct, TFilter } from '@type/product';
import { IResponse } from '@type/api';
import { TCurrency } from '@type/local-storage';

import instance from '@api/api';

/**
 * Class for working with products
 */

class ProductAPI {
  /**
   * Method for getting an array of objects by filter
   * @param filter preset filter
   * @param currency валюта товара
   */

  static async getProductsByFilter(
    filter: TFilter | 'All',
    currency: TCurrency,
  ) {
    try {
      const response = await instance.get<IResponse<IProduct[]>>(
        `product/filter?filter=${filter}&currency=${currency}`,
      );
      return response.data.data;
    } catch (err) {
      throw new Error('Ooops!');
    }
  }
  /**
   * Method for getting an array of objects by filter
   * @param pageNumber номер загружаемой "страницы" продуктов
   * @param pageSize количество загружаемых продуктов за 1 раз
   * @param currency валюта для загрузки
   */

  static async getAllProductsByLazy(
    pageNumber = 1,
    pageSize = 20,
    currency = '$',
  ) {
    try {
      const response = await instance.get<
        IResponse<{
          countProducts: number;
          products: IProduct[];
        }>
      >(
        `allProducts?pageNumber=${pageNumber}&pageSize=${pageSize}&currency=${currency}`,
      );
      return response.data.data;
    } catch (err) {
      throw new Error('Ooops!');
    }
  }

  /**
   * Method for getting an array of products by array of product ID
   * @param listProductsID array of product ID
   * @param currency валюта товара
   */

  static async getProductsByList(
    listProductsID: string[],
    currency: TCurrency,
  ) {
    try {
      const response = await instance.post<IResponse<IProduct[]>>('products', {
        listProductsId: listProductsID,
        currency,
      });
      return response.data.data;
    } catch (err) {
      throw new Error('Ooops!');
    }
  }
}

export default ProductAPI;
