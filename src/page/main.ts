import { IUser } from '@type/user';
import { IProduct, TFilter } from '@type/product';

import UserAPI from '@api/user';
import Item from '@scripts/item';
import Shopping from '@scripts/changeUserLists';
import ProductAPI from '@api/product';
import Filter from '@scripts/filter';
import Wishlist from '@scripts/wishlist';
import LocalStorage from '@scripts/localStorage';
import ShoppingList from '@scripts/shoppingList';
import Popup from '@classes/Popup';
import Router from '@classes/Router';

import lazy from '@scripts/lazy';

import '@scss/main.scss';
import '@scss/variables/colors.scss';
import '@scss/variables/sizes.scss';
import '@scss/popup.scss';
import '@scss/main-content.scss';
import '@scss/item.scss';
import '@scss/items-filtered-list.scss';
import '@scss/filters.scss';

const router = new Router(process.env.DEPLOY_PATH!);

router
  .addRoute('wishlist', 'Wishlist', () => {
    Wishlist.createWishlist();
  })
  .addRoute('shoppingcart', 'Shopping Cart', () =>
    ShoppingList.createShoppingList(),
  )
  .addRoute('', 'Premium Store', () => {
    Item.showMainNavContainer();
    Filter.addEvent(router);
    Filter.filterProducts('all', router);
  })
  .addRoute('?filter=all', 'All products', () =>
    Filter.filterProducts('all', router),
  )
  .addRoute('?filter=vehicles', 'Vehicles', () =>
    Filter.filterProducts('vehicles', router),
  )
  .addRoute('?filter=gold', 'Gold', () => Filter.filterProducts('gold', router))
  .addRoute('?filter=premium', 'Premium', () =>
    Filter.filterProducts('premium account', router),
  )
  .addRoute('?filter=provisions', 'Provisions', () =>
    Filter.filterProducts('provisions', router),
  );

router.init();

const $wishlistLink = document.getElementById('wishlistId') as HTMLElement;

$wishlistLink.addEventListener('click', (event) => {
  event.preventDefault();
  router.changeURI('wishlist');
});

const $shoppingCartLink = document.getElementById('shoppingId') as HTMLElement;

$shoppingCartLink.addEventListener('click', (event) => {
  event.preventDefault();
  router.changeURI('shoppingcart');
});

const $headerLogoLink = document.getElementById('headerLogo') as HTMLElement;

$headerLogoLink.addEventListener('click', (event) => {
  event.preventDefault();
  router.changeURI('');
});

class MainPage {
  #productData: IProduct[] | null = [];

  #userData: IUser | null = null;

  #userId = '61a6286353b5dad92e57b4c0';

  static updateLocalData() {
    UserAPI.getUserByID('61a6286353b5dad92e57b4c0').then((data) => {
      localStorage.setItem('user', JSON.stringify(data));
    });
    ProductAPI.getProductsByFilter('All').then((data) => {
      localStorage.setItem('productData', JSON.stringify(data));
    });
  }

  async getAllData() {
    const productData = await this.getProductDataByFilter('All');
    const userData = await this.getUserData();
    return [productData, userData];
  }

  async updateUserData() {
    const userData = await UserAPI.getUserByID(this.#userId);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  }

  async sendUserData() {
    const userData = LocalStorage.getLocalData('user') as IUser | null;
    if (userData) {
      const data = await UserAPI.changeUserData(userData);
    }
  }

  async updateProductDataByFilter(filter: TFilter | 'All') {
    const productDataByFilter = await ProductAPI.getProductsByFilter(filter);
    localStorage.setItem(filter, JSON.stringify(productDataByFilter));
    return productDataByFilter;
  }

  async getProductDataByFilter(filter: TFilter | 'All') {
    let productDataByFilter = LocalStorage.getLocalData(filter) as
      | IProduct[]
      | null;
    if (!productDataByFilter)
      productDataByFilter = await this.updateProductDataByFilter(filter);
    return productDataByFilter;
  }

  async getUserData() {
    let userData = LocalStorage.getLocalData('user') as IUser | null;
    if (!userData) userData = await this.updateUserData();
    this.#userData = userData;
    return userData;
  }

  async getListData(property: 'shoppingList' | 'wishlist') {
    const userData = await this.getUserData();
    if (userData) {
      if (userData[property].length > 0) {
        return ProductAPI.getProductsByList(userData[property]);
      }
    }
    return null;
  }

  async init(): Promise<any> {
    const data = (await this.getAllData()) as any[];
    console.log(data[0]);
    await Filter.filterProducts('all', router);
    Filter.addEvent(router);
    Shopping.showShoppingList(data[1].shoppingList);
    Shopping.showWishlist(data[1].wishlist);
    await lazy(20, 100, data[1], data[0], new Item(), router);

    setTimeout(() => {
      this.updateUserData();
    });
  }
}

export const main: MainPage = new MainPage();

main.init();

/// /////////////////////////////////////////////////////////////////////

const $wrapper: HTMLElement | null = document.getElementById('popupWrapper'); // серый фон попапа
const $body: HTMLBodyElement | null = document.querySelector('body'); // боди

function openPopup(event: MouseEvent) {
  let popup;

  const eventTarget = event.target as HTMLElement; // куда кликнули
  if ($wrapper?.children) $wrapper.innerHTML = ''; // если в обертке что-то есть, то нужно это обнулить, чтобы не плодить попапы
  $body?.classList.add('lock'); // класс запрещает body скроллиться
  // описание аргументов класса ниже
  switch (
    eventTarget.id // определяем id элемента, каждому айдишнику соответствуют поля для класса
  ) {
    case 'login': // попап для логина
      popup = new Popup(
        eventTarget,
        [
          ['nickname', 'text'],
          ['password', 'password'],
        ],
        true,
        openPopup,
      );
      break;

    case 'create-account': // попап для создания
      popup = new Popup(
        eventTarget,
        [
          ['full name', 'text'],
          ['nickname', 'text'],
          ['email', 'email'],
          ['password', 'password'],
        ],
        false,
      );
      break;

    case 'reset-password': // попап для забыл пароль
      popup = new Popup(eventTarget, [['email', 'email']], false);
      if ($wrapper) $wrapper.innerHTML = '';
      break;

    default:
      throw new Error('eventTarget has no ID');
  }

  if ($wrapper && popup) {
    $wrapper.appendChild(popup.renderHTML()); // добавить попап в обертку
    $wrapper.classList.add('opened-popup'); // добавить класс, который открывает попап
  }
}

function closePopup(event: MouseEvent) {
  const eventTarget = event.target as HTMLElement; // куда кликнули
  $body?.classList.remove('lock'); // удалить запрет на скролл body

  // если кликнули, чтобы закрыть попап по
  if (
    eventTarget === $wrapper || // врапперу (серому фону)
    eventTarget === document.querySelector('.pop-up-container span') || // крестику
    eventTarget === document.querySelector('.pop-up-container button')
  ) {
    // кнопке ОК

    $wrapper?.classList.remove('opened-popup'); // сворачивает фраппер
    if ($wrapper) $wrapper.innerHTML = ''; // снести все, что осталось в обертке
  }
}

const $login: HTMLElement | null = document.getElementById('login'); // ссылка логина
const $create: HTMLElement | null = document.getElementById('create-account'); // ссылка создать аккаунт

window.addEventListener('resize', () => {
  // отслеживание ширины экрана, если <= 720, то css убирает текст по медиа запросам, а здесь добавляется класс login
  // для логина, который клеит картинку на место текста
  if (window.screen.width <= 720) {
    $login?.classList.add('login');
  } else {
    $login?.classList.remove('login');
  }
});

$login?.addEventListener('click', (event) => openPopup(event));
$create?.addEventListener('click', (event) => openPopup(event));
$wrapper?.addEventListener('click', (event) => closePopup(event));
