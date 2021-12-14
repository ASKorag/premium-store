import {IUser} from '@type/user';
import {IProduct} from '@type/product';

import UserAPI from '@api/user';
import Item from '@scripts/item';
import Shopping from '@scripts/changeUserLists';
import ProductAPI from '@api/product';
import lazy from '@scripts/lazy';

import '@scss/main.scss';
import '@scss/variables/colors.scss';
import '@scss/variables/sizes.scss';
import '@scss/popup.scss';
import '@scss/main-content.scss';
import '@scss/item.scss';
import Filter from '@scripts/filter';

class MainPage {
    #productData: IProduct[] | null = [];

    #userData: IUser | null = null;

    async getData() {
        const localUserData = localStorage.getItem('user');
        if (localUserData) {
            this.#userData = JSON.parse(localUserData);
        } else {
            this.#userData = await UserAPI.getUserByID('61a6286353b5dad92e57b4c0');
            localStorage.setItem('user', JSON.stringify(this.#userData));
        }
        this.#productData = await ProductAPI.getProductsByFilter('All');
        localStorage.setItem('productData', JSON.stringify(this.#productData));
        return [this.#productData, this.#userData];
    }

    static showMainItems(productData: IProduct[], userData: IUser): void {
        const $container: HTMLElement | null = document.getElementById('main');
        let itemCounter = 0;
        productData.forEach((value: IProduct) => {
            if ($container) {
                if (itemCounter < 20) {
                    $container.appendChild(Item.createItem(value, userData, productData));
                    itemCounter += value.span;
                }
            }
        });
    }

    init(): void {
        this.getData()
            .then((data: any[]) => {
                MainPage.showMainItems(data[0], data[1]);
                Shopping.showShoppingList(data[1].shoppingList);
                Shopping.showWishlist(data[1].wishlist);
                return data;
            })
            .then((data) => lazy(20, 100, data[1], data[0], new Item()));
        Filter.addEvent();
    }
}

const main: MainPage = new MainPage();
main.init();


let $wrapper: HTMLElement | null = document.getElementById('popupWrapper');     // серый фон попапа

const $login: HTMLElement | null = document.getElementById('login');            // ссылка логина
const $create: HTMLElement | null = document.getElementById('create-account');  // ссылка создать аккаунт
const $body: HTMLBodyElement | null = document.querySelector('body');            // боди


window.addEventListener('resize', function () {
    //отслеживание ширины экрана, если <= 720, то css убирает текст по медиа запросам, а здесь добавляется класс login
    //для логина, который клеит картинку на место текста
    if (window.screen.width <= 720) {
        $login?.classList.add('login');
    }
})

$login?.addEventListener('click', openPopup);
$create?.addEventListener('click', openPopup);
$wrapper?.addEventListener('click', closePopup);

function openPopup() {
    let popup;

    const eventTarget = event?.target as HTMLElement;   // куда кликнули
    if ($wrapper?.children) $wrapper.innerHTML = '';    // если в обертке что-то есть, то нужно это обнулить, чтобы не плодить попапы
    $body?.classList.add('lock');   // класс запрещает body скроллиться
//описание аргументов класса ниже
    switch (eventTarget.id) {       // определяем id элемента, каждому айдишнику соответствуют поля для класса
        case 'login':       // попап для логина
            popup = new Popup(eventTarget, [['nickname', 'text'], ['password', 'password']], true);
            break;

        case 'create-account':      // попап для создания
            popup = new Popup(eventTarget, [['full name', 'text'], ['nickname', 'text'], ['email', 'email'], ['password', 'password']], false);
            break;

        case 'reset-password':      // попап для забыл пароль
            popup = new Popup(eventTarget, [['email', 'email']], false);
            if ($wrapper) $wrapper.innerHTML = '';
            break;

        default:
            throw new Error('eventTarget has no ID')
    }

    if ($wrapper && popup) {
        $wrapper.appendChild(popup.renderHTML());      // добавить попап в обертку
        $wrapper.classList.add('opened-popup');        // добавить класс, который открывает попап
    }
}

function closePopup() {
    const eventTarget = event?.target as HTMLElement;      // куда кликнули
    $body?.classList.remove('lock');    // удалить запрет на скролл body

    //если кликнули, чтобы закрыть попап по
    if (eventTarget === $wrapper || //врапперу (серому фону)
        eventTarget === document.querySelector('.pop-up-container span') ||      //крестику
        eventTarget === document.querySelector('.pop-up-container button')) {  //кнопке ОК

        $wrapper?.classList.remove('opened-popup');  //сворачивает фраппер
        if ($wrapper) $wrapper.innerHTML = '';  //снести все, что осталось в обертке
    }
}

class Popup {
    target: HTMLElement;
    inputs: any;        //хз, какой тут должен быть тип, он на все ругается. Передаются данные для инпутов: [0] - текст,[1] - тип инпута
    hasLink: boolean;   //есть ли в попапе ссылка, по-хорошему, нужно было бы отпочковаться в другой класс с расширением, но ради одной ссылки не знаю, стоит ли

    constructor(target: HTMLElement, inputs: any, hasLink: boolean) {
        this.target = target;
        this.inputs = inputs;
        this.hasLink = hasLink;
    }

//каждый метод возвращает заполненный элемент HTML
    createHeader() {
        const title = this.target.id.split('-').join(" ");      //айдишник элемента, по которому кликнули переходит в читабельную форму
        let $header = document.createElement('h2'); //создать Н2
        $header.innerText = title; //записать
        return $header;
    }

    createForm() {
        let $form = document.createElement('form'); //создать форму
        $form.classList.add('popup-form');  //только стили

        for (let i = 0; i < this.inputs.length; i++) {
            //пробегает по каждому input [0] - текст для лейбла и плейсхолдера,[1] - тип инпута
            $form.innerHTML += `<label>${this.inputs[i][0]} <input type='${this.inputs[i][1]}' placeholder='Enter your ${this.inputs[i][0]}'></label>`;
        }
//после генерации инпутов заталкиваем кнопу в форму
        $form.appendChild(this.createButton());
        if (this.hasLink) {
            //ссылка на восстановление пароля
            //передавать аргументы наверняка можно и человеческим способом)

            $form.appendChild(this.createLink('forget your password?', "reset-password"));

            if (window.screen.width <= 720) {
                //ссылка на создание аккаунта для мал разрешения
                $form.appendChild(this.createLink('Create account', 'create-account'));
            }
        }

        return $form;
    }

    createButton() {
        //единственный адекватный метод без черни
        let $btn = document.createElement('button');
        $btn.type = 'submit';
        $btn.innerText = 'OK';
        return $btn;
    }

    createLink(str: string, id: string) {
        //принимает str - для текста самой ссылки, id - нужен, чтобы генерить попап новый по клику
        let $link = document.createElement('a');
        $link.id = id;
        $link.href = "#";
        $link.classList.add('popup-form-link');
        $link.innerText = str;
        // не знаю, как по-другому повесить листенер, думала через нодлист как-то, он ведь должен обновляться сам, по идее
        //но у меня не вышло
        $link.addEventListener('click', openPopup)
        return $link;
    }

    createSpan() {
        //это крестик
        //можно по- идее сразу на него повесить лисенер на закрытие, как на линках, сейчас он вешается в функции closePopup,
        // но там диким образом вытягиваю элемент

        let $cross = document.createElement('span');
        $cross.innerText = 'X';
        return $cross;
    }

    renderHTML() {
        let $container = document.createElement('div'); //контейнер в обертке, оранжевый
        $container.classList.add("pop-up-container");//только стили

        $container.append(this.createHeader(), this.createSpan(), this.createForm());//аппендаются все сгенеренные элементы
        return $container;
    }
}