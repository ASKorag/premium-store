import HashRouter from '@classes/HashRouter';
import Wishlist from '@classes/Wishlist';
import ShoppingList from '@classes/ShoppingList';
import NavPanel from '@classes/NavPanel';
import Filter from '@scripts/filter';

const router = new HashRouter();

router
  .addRoute('wishlist', 'Wishlist', () => {
    Wishlist.createWishlist();
  })
  .addRoute('shoppingcart', 'Shopping cart', () =>
    ShoppingList.createShoppingList(),
  )
  .addRoute('', 'Premium Store', () => {
    NavPanel.showMainNavContainer();
    Filter.addEvent();
    Filter.filterProducts('All', router);
  })
  .addRoute('all', 'All products', () => {
    NavPanel.showMainNavContainer();
    Filter.filterProducts('All', router);
    Filter.addEvent();
  })
  .addRoute('vehicles', 'Vehicles', () => {
    NavPanel.showMainNavContainer();
    Filter.filterProducts('Technique', router);
    Filter.addEvent();
  })
  .addRoute('gold', 'Gold', () => {
    NavPanel.showMainNavContainer();
    Filter.filterProducts('Gold', router);
    Filter.addEvent();
  })
  .addRoute('premium', 'Premium', () => {
    NavPanel.showMainNavContainer();
    Filter.filterProducts('Premium', router);
    Filter.addEvent();
  })
  .addRoute('provisions', 'Provisions', () => {
    NavPanel.showMainNavContainer();
    Filter.filterProducts('Provisions', router);
    Filter.addEvent();
  });

export default router;
