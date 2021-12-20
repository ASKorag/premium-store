/**
 * @module DOMElements
 */

import { IProduct } from '@type/product';
import { IUser } from '@type/user';
import { TBtnAtrs, TPage } from '@type/dom-elements';

import Item from '@classes/Item';
import Wishlist from '@classes/Wishlist';

import humanPrice from '@scripts/human-price';

/**
 * Класс для создания DOM элементов
 */

class DOMElements {
  /**
   * Метод для создания кнопки
   * @param data объект с данными кнопки
   */

  static createButton(data: TBtnAtrs) {
    const { classes, text, id } = data;
    const $btn = document.createElement('button');
    $btn.classList.add(...classes);
    $btn.textContent = text;

    if (id) {
      $btn.id = id;
    }
    return $btn;
  }
  /**
   * Метод для создания шапки на страницах корзины и списка желаний
   * @param title заголовок шапки
   */

  static createPageHeader(title: string): HTMLDivElement {
    const $header = document.createElement('div');
    $header.innerHTML = `${title}`;
    $header.classList.add('list-header-container');
    return $header;
  }

  /**
   * Метод для создания пустых страниц корзины и списка желаний
   * @param text выводимый на странице текст
   */

  static createEmptyPage(text: string): HTMLDivElement {
    const $item = document.createElement('div');
    $item.classList.add('item-filtered-container');
    $item.innerHTML = `<div class="empty-list">${text}</div>`;
    return $item;
  }

  /**
   * Метод для создания карточки продукта на страницах корзины и списка желаний
   * @param product исходный продукт
   * @param user текущий пользователь
   * @param page название страницы
   */

  static createAddedItem(product: IProduct, user: IUser, page: TPage) {
    const isAddedToShoppingList =
      page === 'shopping list'
        ? true
        : user.shoppingList.includes(product.data.id);
    const isAddedToWishlist =
      page === 'wishlist' ? true : user.wishlist.includes(product.data.id);
    const saleElement = Item.getSale(product);

    const $item = document.createElement('div');
    $item.classList.add('item-filtered-container');

    $item.innerHTML = `
    <a class="item-filtered-img" href="#${
      product.data.id
    }" onclick="return false"><img src="${product.data.images.span_2x1}" alt="${
      product.data.name
    }"></a>
                  <div class="item-filtered-description">
                    <h2>
                      ${product.data.name}
                      ${saleElement[1]}
                    </h2>
                    ${product.data.description}
                    <div>
                    <button class="item-description-likeBtn ${
                      isAddedToWishlist ? 'button-like_active' : ' '
                    }"></button>
                        <span class="item-purchase-prise">
                          <span class="item-price-amount ${
                            saleElement[3]
                          }">${humanPrice(product.data.price.basic.cost)} ${
      saleElement[2]
    }</span>
                          ${saleElement[0]}
                        </span>
                        <button class="item-purchase-button ${
                          isAddedToShoppingList ? 'button-purchase-added' : ''
                        }">${
      isAddedToShoppingList ? 'added' : 'purchase'
    }</button>
                        </div>
                    </div>
    `;
    Wishlist.addEvent($item, product);
    return $item;
  }
}

export default DOMElements;
