import { IProduct } from '@type/product';
import { IUser } from '@type/user';
import ShoppingList from '@classes/ShoppingList';
import Wishlist from '@classes/Wishlist';
import HashRouter from '@classes/HashRouter';

interface AddEvent {
  (
    event: string,
    $element: HTMLElement,
    eventFunction: (...args: any[]) => void,
    once: boolean,
    params: any[],
  ): void;
}

class Item {
  static createItem(
    product: IProduct,
    userData: IUser,
    router: HashRouter,
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
                            <h2>${product.data.name}</h2>
                            <span class="main-container-description_price">${
                              product.data.price.basic.cost
                            }${product.data.price.basic.currency}</span>
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

    // слушатель для добавления роута в роутер
    // почему-то срабатывал не 1 раз, поэтому внутри условие, нужен фикс
    $item.addEventListener(
      'click',
      (event) => {
        if (!router.findRoute(`${product.data.id}`)) {
          router.addRoute(`${product.data.id}`, `${product.data.name}`, () =>
            Item.showSelectedItem(
              product,
              userData,
              Item.createSelectedItem,
            ),
          );
        }
      },
      { once: true },
    );

    $item.addEventListener('click', (event: UIEvent) => {
      const eventTarget = event.target as HTMLElement;
      if (eventTarget && eventTarget.nodeName !== 'BUTTON') {
      }
    });

    return $item;
  }

  static createSelectedItem(
    product: IProduct,
    userData: IUser,
    addEvent: AddEvent,
  ): HTMLElement {

    const isAddedToPurchase = userData.shoppingList.includes(product.data.id);
    const $item: HTMLElement = document.createElement('div');
    $item.classList.add('item-container');
    $item.id = 'mainItem';
    if (product) {
      $item.innerHTML = `
          <h2>${product.data.name}</h2>
          <img src=${product.data.images.span_1x1} alt="${product.data.name}"/>
          <div class="item-container-purchase">
              <span class="item-purchase-price">${
                product.data.price.basic.cost
              }${product.data.price.basic.currency}</span>
              <button class="item-purchase-button ${
                isAddedToPurchase ? 'button-purchase-added' : ''
              }">purchase</button>
          </div>
          <div class="item-container-description">
                <h3>Details</h3>
                <div>${product.data.description || 'coming soon...'}</div>
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

  static showSelectedItem(
    product: IProduct,
    userData: IUser,
    createItem: (
      product: IProduct,
      userData: IUser,
      addEvent: AddEvent,
    ) => HTMLElement,
  ) {
    const $visualContainer: HTMLElement | null = document.getElementById(
      'main-visual-container',
    );
    const $container: HTMLElement | null = document.getElementById('main');
    const $itemFilter: HTMLElement | null =
      document.querySelector('.item-filters');
    if ($visualContainer && $container) {
      $visualContainer?.removeChild($container);
      if (
        $visualContainer?.parentElement?.children.length === 3 &&
        $itemFilter
      ) {
        $visualContainer?.parentElement?.removeChild($itemFilter);
      }
      const $item: HTMLElement = createItem(
        product,
        userData,
        Item.addEvent,
      );
      $visualContainer.appendChild($item);
    }
  }

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
