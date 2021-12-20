import LocalStorage from '@classes/LocalStorage';
import router from '@scripts/init/router';
import ShoppingList from '@classes/ShoppingList';
import Wishlist from '@classes/Wishlist';

// инициализация магазина
const storeInit = () =>
  document.addEventListener(
    'DOMContentLoaded',
    async () => {
      const userData = await LocalStorage.getUserData();
      const currency = LocalStorage.getCurrency();
      if (userData) {
        router.init(currency);
        ShoppingList.showShoppingListCounter(userData.shoppingList);
        Wishlist.showWishlistCounter(userData.wishlist);
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }
    },
    { once: true },
  );

export default storeInit;
