import { IProduct } from '@type/product';
import { IUser } from '@type/user';
import { IAddEvent } from '@type/item';

import ShoppingList from '@classes/ShoppingList';
import Wishlist from '@classes/Wishlist';
// import HashRouter from '@classes/HashRouter';

import humanPrice from '@scripts/human-price';

/**
 * Класс для работы с продуктом
 */

class Item {
  /**
   * Метод для создания карточки продукта на главной странице и страницах фильтров
   * @param product исходный продукт
   * @param userData текущий пользователь
   // * @param router
   */

  static createItem(
    product: IProduct,
    userData: IUser /* ,
    router: HashRouter, */,
  ): HTMLElement {
    const $item = document.createElement('div');
    $item.classList.add('main-container-product');

    const isAddedToWishlist = userData.wishlist.includes(product.data.id);
    const isAddedToPurchase = userData.shoppingList.includes(product.data.id);
    let nation = '';
    let type = '';
    if ('filter' in product.data) {
      nation = `<span class="main-container-description_flag" data-country="${product.data.filter.nation}"></span>`;
      type = `<span class="main-container-description_type" data-type="${product.data.filter.type}"></span>`;
    }
    const saleElement = Item.getSale(product);
    $item.innerHTML = `
                     <a class="main-container-link ${
                       isAddedToPurchase ? 'main-container-link-added' : ''
                     }" href="#${product.data.id}">
                          <img class="main-container-link_img" src=${
                            product.data.images.span_2x1
                          } alt="${product.data.name}">
                     </a>
                     <div class="main-container-description">
                            ${nation}
                            ${type}
                            <h2>
                              ${product.data.name}
                              ${saleElement[1]}
                             </h2>
                            <span class="item-price">
                              <span class="item-price-amount ${
                                saleElement[3]
                              }">${humanPrice(product.data.price.basic.cost)} ${
      saleElement[2]
    }</span>
                              ${saleElement[0]}
                            </span>
                            <button class="main-container-description_button-purchase ${
                              isAddedToPurchase ? 'button-purchase-added' : ''
                            }">
                                   ${isAddedToPurchase ? 'added' : 'purchase'}
                            </button>                            
                      </div>
                     <button class="main-container-description_button-like ${
                       isAddedToWishlist ? 'button-like_active' : ' '
                     }"></button>
    `;
    if (product.span === 2) {
      $item.classList.add('span-two');
    }
    const $likeButton: HTMLElement | null = $item.querySelector(
      '.main-container-description_button-like',
    );
    const $purchaseButton: HTMLElement | null = $item.querySelector(
      '.main-container-description_button-purchase',
    );

    if ($purchaseButton) {
      Item.addEvent(
        'click',
        $purchaseButton,
        ShoppingList.changeShoppingListCounter,
        false,
        [product, ShoppingList.showShoppingListCounter, $purchaseButton],
      );
    }
    if ($likeButton) {
      Item.addEvent(
        'click',
        $likeButton,
        Wishlist.changeWishlistCounter,
        false,
        [product, Wishlist.showWishlistCounter, $likeButton],
      );
    }
    return $item;
  }

  /**
   * Метод для создания карточки продукта на странице самого продукта
   * @param product исходный продукт
   * @param userData текущий пользователь
   * @param addEvent
   */

  static createSelectedItem(
    product: IProduct,
    userData: IUser,
    addEvent: IAddEvent,
  ): HTMLElement {
    const isAddedToPurchase = userData.shoppingList.includes(product.data.id);
    const $item: HTMLElement = document.createElement('div');
    $item.classList.add('item-container');
    $item.id = 'mainItem';
    const saleElement = Item.getSale(product);
    if (product) {
      $item.innerHTML = `
          <h2>${product.data.name}
            ${saleElement[1]}
          </h2>
          <img src=${product.data.images.span_1x1} alt="${product.data.name}"/>
          <div class="item-container-purchase">
              <div class="item-price">
                        <span class="item-price-amount ${
                          saleElement[3]
                        }">${humanPrice(product.data.price.basic.cost)} ${
        saleElement[2]
      }</span>
                        ${saleElement[0]}
              </div>
              <button class="item-purchase-button ${
                isAddedToPurchase ? 'button-purchase-added' : ''
              }">${isAddedToPurchase ? 'added' : 'purchase'}</button>
          </div>
          <div class="item-container-description">
                <h3>Details</h3>
                <p>${product.data.description || 'coming soon...'}</p>
            </div>`;
    }
    const $purchaseButton: HTMLElement | null = $item.querySelector(
      '.item-purchase-button',
    );
    if ($purchaseButton) {
      addEvent(
        'click',
        $purchaseButton,
        ShoppingList.changeShoppingListCounter,
        false,
        [product, ShoppingList.showShoppingListCounter, $purchaseButton],
      );
    }
    return $item;
  }

  /**
   * Метод для отображения карточки продукта
   * @param product исходный продукт
   * @param userData текущий пользователь
   * @param createItem функция создания карточки продукта
   */

  static showSelectedItem(
    product: IProduct,
    userData: IUser,
    createItem: (
      product: IProduct,
      userData: IUser,
      addEvent: IAddEvent,
    ) => HTMLElement,
  ) {
    const $visualContainer: HTMLElement | null = document.getElementById(
      'main-visual-container',
    );
    const $container: HTMLElement | null = document.getElementById('main');
    const $itemFilter: HTMLElement | null =
      document.querySelector('.item-filters');

    if ($visualContainer) {
      if ($container) {
        $visualContainer?.removeChild($container!);
      }

      if (
        $visualContainer?.parentElement?.children.length === 3 &&
        $itemFilter
      ) {
        $visualContainer?.parentElement?.removeChild($itemFilter);
      }
      const $item: HTMLElement = createItem(product, userData, Item.addEvent);
      $visualContainer.appendChild($item);
    }
  }

  /**
   * Метод для получения стоимостных данных продукта
   * @param product исходный продукт
   */

  static getSale(product: IProduct) {
    let priceAmount = '';
    let actualPrice = ``;
    let sale = ``;
    let currency = `${product.data.price.basic.currency}`;
    if (product.data.price.basic.cost !== product.data.price.actual.cost) {
      actualPrice = `
      <span class = "item-arrow icon-arrow-right"></span>
      <span class="item-price-reduced">${humanPrice(
        product.data.price.actual.cost,
      )} ${product.data.price.basic.currency}</span>`;
      const discountAmount = Math.ceil(
        100 -
          (100 * +product.data.price.actual.cost) /
            +product.data.price.basic.cost,
      );
      sale = `<span class='item-sale'>-${discountAmount}%</span>`;
      currency = ``;
      priceAmount = 'price-sale';
    }
    return [actualPrice, sale, currency, priceAmount];
  }

  /**
   * Метод для добавления обработчиков
   * @param event тип события
   * @param $element элемент для навешивания обработчика
   * @param eventFunction функция обработчика
   * @param once срабатывание обработчика только 1 раз
   * @param params параметры для функции обработчика
   */

  static addEvent(
    event: string,
    $element: HTMLElement,
    eventFunction: (...args: any[]) => void,
    once: boolean,
    params: any[],
  ): void {
    $element.addEventListener(
      `${event}`,
      () => {
        eventFunction(...params);
      },
      { once },
    );
  }
}

export default Item;
