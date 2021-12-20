/**
 * @module Popup
 */

import { TPopupInputs, TLinkHandler } from '@type/popup';

/**
 * Класс для создания всплывающих окон
 */

class Popup {
  /** элемент, вызвавший создание окна */
  #target: HTMLElement;

  /** массив входных данных для заполнения формы */
  readonly #inputs: TPopupInputs; // хз, какой тут должен быть тип, он на все ругается. Передаются данные для инпутов: [0] - текст,[1] - тип инпута

  /** коллбэк для ссылки восстановления пароля */
  #linkHandler: TLinkHandler | undefined;

  /** флаг для указания наличия в форме ссылки восстановления пароля */
  readonly #hasLink: boolean; // есть ли в попапе ссылка, по-хорошему, нужно было бы отпочковаться в другой класс с расширением, но ради одной ссылки не знаю, стоит ли

  constructor(
    target: HTMLElement,
    inputs: TPopupInputs,
    hasLink: boolean,
    linkHandler?: TLinkHandler,
  ) {
    this.#target = target;
    this.#inputs = inputs;
    this.#hasLink = hasLink;
    this.#linkHandler = linkHandler;
  }

  /**
   * Метод для создания заголовка формы
   */

  createHeader(): HTMLHeadingElement {
    const title = this.#target.id.split('-').join(' '); // айдишник элемента, по которому кликнули переходит в читабельную форму
    const $header = document.createElement('h2'); // создать Н2
    $header.innerText = title; // записать
    return $header;
  }

  /**
   * Метод для создания формы
   * @param linkHandler коллбэк для ссылки восстановления пароля
   */

  createForm(linkHandler?: TLinkHandler): HTMLFormElement {
    const $form = document.createElement('form'); // создать форму
    $form.classList.add('popup-form'); // только стили

    for (let i = 0; i < this.#inputs.length; i += 1) {
      // пробегает по каждому input [0] - текст для лейбла и плейсхолдера,[1] - тип инпута
      $form.innerHTML += `<label>${this.#inputs[i][0]} <input type='${
        this.#inputs[i][1]
      }' placeholder='Enter your ${this.#inputs[i][0]}'></label>`;
    }
    // после генерации инпутов заталкиваем кнопу в форму
    $form.appendChild(Popup.createButton());

    if (this.#hasLink) {
      // ссылка на восстановление пароля
      // передавать аргументы наверняка можно и человеческим способом)

      $form.appendChild(
        Popup.createLink(
          'forget your password?',
          'reset-password',
          linkHandler!,
        ),
      );

      if (window.screen.width <= 720) {
        // ссылка на создание аккаунта для мал разрешения
        $form.appendChild(
          Popup.createLink('Create account', 'create-account', linkHandler!),
        );
      }
    }

    return $form;
  }

  /**
   * Метод для создания кнопки OK
   */

  static createButton(): HTMLButtonElement {
    // единственный адекватный метод без черни
    const $btn = document.createElement('button');
    $btn.type = 'submit';
    $btn.innerText = 'OK';
    return $btn;
  }

  /**
   * Метод для создания ссылки
   * @param str текст ссылки
   * @param id ID для созданной ссылки
   * @param handler коллбэк для созданной ссылки
   */

  static createLink(
    str: string,
    id: string,
    handler: TLinkHandler,
  ): HTMLAnchorElement {
    // принимает str - для текста самой ссылки, id - нужен, чтобы генерить попап новый по клику
    const $link = document.createElement('a');
    $link.id = id;
    $link.href = '#';
    $link.classList.add('popup-form-link');
    $link.innerText = str;
    // не знаю, как по-другому повесить листенер, думала через нодлист как-то, он ведь должен обновляться сам, по идее
    // но у меня не вышло
    $link.addEventListener('click', (event) => handler(event));
    return $link;
  }

  /**
   * Метод для создания крестика закрытия формы
   */

  static createSpan(): HTMLSpanElement {
    // это крестик
    // можно по- идее сразу на него повесить лисенер на закрытие, как на линках, сейчас он вешается в функции closePopup,
    // но там диким образом вытягиваю элемент

    const $cross = document.createElement('span');
    $cross.innerText = 'X';
    return $cross;
  }

  /**
   * Метод для создания самого всплывающего окна
   */

  renderHTML(): HTMLDivElement {
    const $container = document.createElement('div'); // контейнер в обертке, оранжевый
    $container.classList.add('pop-up-container'); // только стили

    $container.append(
      this.createHeader(),
      Popup.createSpan(),
      this.#linkHandler
        ? this.createForm(this.#linkHandler)
        : this.createForm(),
    ); // аппендаются все сгенеренные элементы
    return $container;
  }
}

export default Popup;
