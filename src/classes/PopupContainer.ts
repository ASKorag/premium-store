/**
 * @module Popup
 */

import Popup from '@classes/Popup';

/**
 * Класс для работы со всплывающими окнами
 */

class PopupContainer {
  /**
   * Метод для открытия всплывающего окна
   * @param event объект события, вызвавшего метод
   */
  static openPopup(event: MouseEvent) {
    let popup;
    const $wrapper: HTMLElement | null =
      document.getElementById('popupWrapper'); // серый фон попапа
    const $body: HTMLBodyElement | null = document.querySelector('body'); // боди
    const eventTarget = event.target as HTMLElement; // куда кликнули
    if ($wrapper?.children) $wrapper.innerHTML = ''; // если в обертке что-то есть, то нужно это обнулить, чтобы не плодить попапы
    $body?.classList.add('lock'); // класс запрещает body скроллиться
    $wrapper?.classList.add('visible');
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
          this.openPopup,
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

  /**
   * Метод для закрытия всплывающего окна
   * @param event объект события, вызвавшего метод
   */

  static closePopup(event: MouseEvent) {
    const $wrapper: HTMLElement | null =
      document.getElementById('popupWrapper'); // серый фон попапа
    const $body: HTMLBodyElement | null = document.querySelector('body'); // боди
    const eventTarget = event.target as HTMLElement; // куда кликнули
    $body?.classList.remove('lock'); // удалить запрет на скролл body

    // если кликнули, чтобы закрыть попап по
    if (
      eventTarget === $wrapper || // врапперу (серому фону)
      eventTarget === document.querySelector('.pop-up-container span') || // крестику
      eventTarget === document.querySelector('.pop-up-container button') // кнопке ОК
    ) {
      $wrapper?.classList.remove('opened-popup'); // сворачивает фраппер
      if ($wrapper) $wrapper.innerHTML = ''; // снести все, что осталось в обертке
    }
  }
}

export default PopupContainer;
