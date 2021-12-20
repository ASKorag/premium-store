/**
 * @module Filter
 */

import { IProduct, TFilter } from '@type/product';
import { IUser } from '@type/user';
import { IProductLocalStorageData } from '@type/local-storage';

import Item from '@classes/Item';
import ProductAPI from '@api/product';
import Wishlist from '@classes/Wishlist';

import LocalStorage from '@classes/LocalStorage';

import lazy from '@scripts/lazy';
import lazyBD from '@scripts/lazyBD';

/**
 * Класс для фильтрации продуктов и работы с уже отфильтрованными продуктами
 */

class Filter {
  //  #nation #type #tier используются для фильтрации продуктов типа техника
  /** страна техники */
  static #nation: string | undefined;

  /** тип техники */
  static #type: string | undefined;

  /** уровень техники */
  static #tier: string | undefined;

  /**
   * Метод для добавления обработчиков кнопок фильтров
   */

  static addEvent(): void {
    const $filterButtons: NodeListOf<Element> =
      document.querySelectorAll('.main-nav-link');
    $filterButtons.forEach((item: Node) => {
      item.addEventListener('click', (e) => {
        const $eventTarget: HTMLElement = e.target as HTMLElement;
        const $prevFilter = document.querySelector('.active-link');
        if ($prevFilter && $prevFilter !== $eventTarget) {
          $prevFilter.classList.remove('active-link');
        }
        $eventTarget.classList.add('active-link');
      });
    });
  }

  /**
   * Метод для фильтрации всех продуктов
   * @param filter фильтр для сортировки
   */

  static filterProducts(filter: TFilter | 'All' | null) {
    let $target: HTMLElement | null;
    LocalStorage.getUserData().then((userData) => {
      if (userData) {
        const actualFilter = filter;
        $target = document.querySelector(`[data-filter=${filter}]`);
        $target?.classList.add('active-link');

        if (filter === 'All') {
          this.createAllFilterProducts(userData);
        } else {
          LocalStorage.getProductDataByFilter(actualFilter!).then((data) => {
            if (data)
              this.createFilterProducts(data, userData, data, actualFilter!);
          });
        }
      }
    });
  }

  /**
   * Метод для фильтрации техники
   * @param userData текущий пользователь
   */

  static filterTechniqueProducts(userData: IUser) {
    const techniqueProduct = LocalStorage.getLocalData(
      'Technique',
    ) as IProductLocalStorageData | null;
    if (techniqueProduct) {
      let check = false;
      const filteredProducts = techniqueProduct.data.filter((item) => {
        if ('filter' in item.data) {
          check = true;
          if (this.#nation && this.#nation !== 'all') {
            check = item.data.filter.nation === this.#nation;
          }
          if (this.#tier && this.#tier !== 'all') {
            check = check && item.data.filter.tier === this.#tier;
          }
          if (this.#type && this.#type !== 'all') {
            check = check && item.data.filter.type === this.#type;
          }
        }
        return check;
      });
      Filter.showFilterProduct(filteredProducts, userData);
    }
  }

  /**
   * Метод для создания фильтрованных продуктов
   * @param filteredProducts массив фильтрованных продуктов
   * @param userData текущий пользователь
   * @param productData массив всех продуктов
   * @param filter фильтр для сортировки
   */

  static createFilterProducts(
    filteredProducts: IProduct[],
    userData: IUser,
    productData: IProduct[],
    filter: string,
  ) {
    const $visualContainer: HTMLElement | null = document.getElementById(
      'main-visual-container',
    );
    const $wrapper: HTMLElement | null =
      document.querySelector('.main-container');
    if ($wrapper?.lastChild) {
      if ($wrapper?.children.length === 3) {
        $wrapper?.removeChild($wrapper?.lastChild);
      }
      $wrapper?.removeChild($wrapper?.lastChild);
    }
    if (filter === 'Technique') {
      const $itemFilter = document.createElement('div');
      $itemFilter.classList.add('item-filters');
      $itemFilter.innerHTML = `
        <div class="filter-container">
                <button class="filter-container-checkedBtn nations arrow" id="allNations" type="button">All nations</button>
                <ul class="filter-list nations-list">
                    <li class="nations-btn filter-btn" data-nation="all">
                        <button class="nations">All nations</button>
                    </li>
                    <li class="nations-btn filter-btn" data-nation="china">
                        <button class="china_btn">China</button>
                    </li>
                    <li class="nations-btn filter-btn" data-nation="france">
                        <button class="france_btn">France</button>
                    </li>
                    <li class="nations-btn filter-btn" data-nation="germany">
                        <button class="germany_btn">Germany</button>
                    </li>
                    <li class="nations-btn filter-btn" data-nation="japan">
                        <button class="japan_btn">Japan</button>
                    </li>
                    <li class="nations-btn filter-btn" data-nation="uk">
                        <button class="uk_btn">U.K.</button>
                    </li>
                    <li class="nations-btn filter-btn" data-nation="usa">
                        <button class="usa_btn">U.S.A.</button>
                    </li>
                    <li class="nations-btn filter-btn" data-nation="ussr">
                        <button class="ussr_btn">U.S.S.R.</button>
                    </li>
                </ul>
            </div>
            <div class="filter-container">
                <button class="filter-container-checkedBtn types arrow" id="allTypes" type="button">All types</button>
                <ul class="filter-list type-list">
                    <li class="type-btn filter-btn" data-type="all">
                        <button class="types">All types</button>
                    </li>
                    <li class="type-btn filter-btn" data-type="lightTank">
                        <button class="light">Light Tanks</button>
                    </li>
                    <li class="type-btn filter-btn" data-type="mediumTank">
                        <button class="medium">Medium Tanks</button>
                    </li>
                    <li class="type-btn filter-btn" data-type="heavyTank">
                        <button class="heavy">Heavy Tanks</button>
                    </li>
                    <li class="type-btn filter-btn" data-type="AT-SPG">
                        <button class="destroy">Tank Destroyers</button>
                    </li>
                    <li class="type-btn filter-btn" data-type="SPG">
                        <button class="spg">SPGs</button>
                    </li>
                    <li class="type-btn filter-btn" data-type="all">
                        <button class="multirole">Multirole fighter</button>
                    </li>
                </ul>
            </div>
            <div class="filter-container">
                <button class="filter-container-checkedBtn tiers arrow" id="allTiers" type="button">All Tiers</button>
                <ul class="filter-list tiers-list">
                  <li class="tires-btn filter-btn" data-tier="all">
                        <button>&#8545;-&#8553;</button>
                    </li>
                    <li class="tires-btn filter-btn" data-tier="2">
                        <button>&#8545;</button>
                    </li>
                    <li class="tires-btn filter-btn" data-tier="4">
                        <button>&#8544;&#8548;</button>
                    </li>
                    <li class="tires-btn filter-btn" data-tier="5">
                        <button>&#8548;</button>
                    </li>
                    <li class="tires-btn filter-btn" data-tier="7">
                        <button>&#8548;&#8545;</button>
                    </li>
                    <li class="tires-btn filter-btn" data-tier="9">
                        <button>&#8544;&#8553;</button>
                    </li>
                    <li class="tires-btn filter-btn" data-tier="10">
                        <button>&#8553;</button>
                    </li>
                </ul>
            </div>
            <button class="item-filters-btn" id="allVehicles">Show all vehicles</button>
      `;
      $wrapper?.append($itemFilter);
      const filterList = $itemFilter.querySelectorAll(
        '.filter-container-checkedBtn',
      );
      const filterType = $itemFilter.querySelectorAll('.filter-btn');
      const allVehicles = $itemFilter.querySelector('.item-filters-btn');
      const allFilterButtons = $itemFilter.querySelectorAll(
        '.filter-container-checkedBtn',
      );
      allVehicles?.addEventListener('click', () => {
        allFilterButtons.forEach((item, index) => {
          if (index === 0) {
            item.textContent = 'All nations';
          }
          if (index === 1) {
            item.textContent = 'All types';
          }
          if (index === 2) {
            item.textContent = 'All tiers';
          }
          item.classList.remove(item.classList[3]);
        });
        this.#type = 'all';
        this.#tier = 'all';
        this.#nation = 'all';
        this.filterTechniqueProducts(userData /* , productData, router */);
      });
      filterType.forEach((item) => {
        item.addEventListener('click', (e: any) => {
          const elem = e.currentTarget.parentElement.parentElement
            ?.firstElementChild as HTMLElement;
          if (e.currentTarget.classList[0] === 'nations-btn') {
            this.#nation = e.currentTarget.dataset.nation;
          } else if (e.currentTarget.classList[0] === 'type-btn') {
            this.#type = e.currentTarget.dataset.type;
          }
          if (e.currentTarget.classList[0] !== 'tires-btn') {
            if (elem.classList.length > 3) {
              elem.classList.remove(elem.classList[3]);
              elem.classList.add(e.currentTarget.firstElementChild.className);
              elem.textContent = `${e.currentTarget.firstElementChild.textContent}`;
            } else {
              elem.classList.add(e.currentTarget.firstElementChild.className);
              elem.textContent = `${e.currentTarget.firstElementChild.textContent}`;
            }
          }
          if (e.currentTarget.classList[0] === 'tires-btn') {
            elem.textContent = `${e.currentTarget.firstElementChild.textContent}`;
            this.#tier = e.currentTarget.dataset.tier;
          }
          e.currentTarget.parentElement.parentElement.lastElementChild.classList.toggle(
            'opened-list',
          );
          this.filterTechniqueProducts(userData);
        });
      });
      filterList.forEach((item) => {
        item.addEventListener('click', (e: any) => {
          e.currentTarget.nextElementSibling.classList.toggle('opened-list');
        });
      });
    }
    if ($visualContainer) {
      $wrapper?.append($visualContainer);
    }
    Filter.showFilterProduct(filteredProducts, userData);
  }

  /**
   * Метод для показа фильтрованных продуктов
   * @param filteredProducts массив фильтрованных продуктов
   * @param userData текущий пользователь
   */

  static showFilterProduct(filteredProducts: IProduct[], userData: IUser) {
    const $visualContainer: HTMLElement | null = document.getElementById(
      'main-visual-container',
    );
    if ($visualContainer) {
      $visualContainer.innerText = '';
      if (filteredProducts.length === 0) {
        $visualContainer.append(Wishlist.createEmptyListItems('List is Empty'));
      }
      const $container = document.createElement('div');
      $container.id = 'main';
      $container.classList.add('main-container-content');
      $visualContainer.appendChild($container);

      let itemCounter = 0;
      filteredProducts.forEach((value: IProduct) => {
        if (itemCounter < 20) {
          $container.appendChild(
            Item.createItem(value, userData /* , router */),
          );
          itemCounter += value.span;
        }
      });
    }

    lazy(20, 100, userData, filteredProducts, new Item());
  }

  /**
   * Метод для создания всех продуктов
   * @param userData текущий пользователь
   */

  static createAllFilterProducts(userData: IUser) {
    const $visualContainer: HTMLElement | null = document.getElementById(
      'main-visual-container',
    );
    const $wrapper: HTMLElement | null =
      document.querySelector('.main-container');
    if ($wrapper?.lastChild) {
      if ($wrapper?.children.length === 3) {
        $wrapper?.removeChild($wrapper?.lastChild);
      }
      $wrapper?.removeChild($wrapper?.lastChild);
    }
    if ($visualContainer) {
      $wrapper?.append($visualContainer);
    }
    Filter.showAllFilterProduct(userData);
  }

  /**
   * Метод для показа всех продуктов
   * @param userData текущий пользователь
   */

  static showAllFilterProduct(userData: IUser) {
    const $visualContainer: HTMLElement | null = document.getElementById(
      'main-visual-container',
    );
    if ($visualContainer) {
      $visualContainer.innerText = '';
      const $container = document.createElement('div');
      $container.id = 'main';
      $container.classList.add('main-container-content');
      $visualContainer.appendChild($container);

      ProductAPI.getAllProductsByLazy(1, 40, LocalStorage.getCurrency()).then(
        (value) => {
          if (value) {
            value.products.forEach((product: IProduct) => {
              $container.appendChild(Item.createItem(product, userData));
            });
            lazyBD(40, 500, userData, new Item());
          }
        },
      );
    }
  }
}

export default Filter;
