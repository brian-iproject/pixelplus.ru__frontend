/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class FlickitySet {
    /**
     *
     * @param selector - селектор блока слайдера
     */
    constructor(selector = '[data-flickity-options]') {
        if (typeof Flickity === 'undefined') {
            console.warn('Flickity is not defined');
            return;
        }

        this.selector = selector;
        this.$blocks = document.querySelectorAll(selector);
        this.slidersSet = [];

        this.$blocks.forEach($block => this.init($block));
    }

    /**
     * Добавляет экземпляр в массив
     * @param flkty
     */
    addToSet = (flkty) => {
        this.slidersSet.push(flkty);
    }

    /**
     * Инициализирует flickity
     * @param $block - node-элемент
     */
    init = ($block) => {
        const options = this.getOptions($block);
        const flkty = new Flickity($block, options);
        this.addToSet(flkty);
    }

    /**
     * Возвращает объект с параметры для инициализации flickity
     * @param $block - node-элемент
     * @returns { Object }
     */
    getOptions = ($block) => JSON.parse($block.dataset.flickityOptions);

    /**
     * Проверяет является ли элемент слайдером
     * @param $block - node-элемент
     * @returns {boolean}
     */
    isFlickity = ($block) => Boolean(this.slidersSet.find(flkty => flkty.element === $block));

    /**
     * Возвращает экземпляр flickity
     * @param $block - node-элемент
     * @returns {*}
     */
    getFlkty = ($block) => this.slidersSet.find(flkty => flkty.element === $block);

    /**
     * Возвращает индекс проинициализированного flickity
     * @param $block - node-элемент
     * @returns {number}
     */
    getFlktyIndex = ($block) => this.slidersSet.findIndex(flkty => flkty.element === $block);

    /**
     * Уничтожает экземпляр flickity и удаляет его из массива
     * @param $block - node-элемент
     */
    destroy = ($block) => {
        this.getFlkty($block).destroy();
        this.slidersSet.splice(this.getFlktyIndex($block), 1);
    }
}

/* harmony default export */ __webpack_exports__["default"] = (FlickitySet);

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class MobileMenuSelectors {
    constructor(selector, mobileWrapperSelector) {
        this.selector = selector;
        this.$menu = document.querySelector(selector);
        this.$mobileWrapper = document.querySelector(mobileWrapperSelector);
        this.$burger = document.querySelector(`[data-burger='${mobileWrapperSelector}']`);
    }
}

class MobileMenu extends MobileMenuSelectors{
    constructor(selector, mobileWrapperSelector) {
        super(selector, mobileWrapperSelector);

        this.init();
    }

    eventClick = (e) => {
        const   dropdownSelector = `${this.selector}__dropdown`,
                itemSelector = `${this.selector}__item`,
                dropDown = e.target.closest(dropdownSelector);

        if (!dropDown) return false
        const item = dropDown.closest(itemSelector);
        dropDown.classList.toggle('-is-active');
        item.classList.toggle('-is-active');
    }

    eventBurger = (e) => {
        const $body = document.querySelector('body');
        const burger = e.target.closest('[data-burger]');

        if (!burger) return false;

        burger.classList.toggle('-is-active');
        this.$mobileWrapper.classList.toggle('-is-active');
        $body.classList.toggle('-no-scroll');
    }

    init = () => {
        this.$menu.addEventListener('click', this.eventClick);

        if (this.$mobileWrapper)
            this.$burger.addEventListener('click', this.eventBurger);
    }
}

/* harmony default export */ __webpack_exports__["default"] = (MobileMenu);

/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class ToggleBlock {
    constructor(groupSelector) {
        this.groupSelector = groupSelector;

        document.querySelectorAll(groupSelector).forEach((item) => {
            item.addEventListener('click', this.clickHandler);
        })
    }

    clickHandler = (e) => {
        const toggleBtn = e.target.closest('[data-toggle]');
        if (!toggleBtn) return false;

        e.preventDefault();
        this.toggleBlock(toggleBtn);
    }

    getTargetBlock = (toggleBtn) => {
        return toggleBtn.closest(this.groupSelector).querySelector('[data-toggle-target=' + toggleBtn.dataset.toggle + ']');
    }

    toggleClass = (el, cssClass) => {
        el.classList.toggle(cssClass);
    }

    toggleBlock = (toggleBtn) => {
        const targetBlock = this.getTargetBlock(toggleBtn);
        this.toggleClass(toggleBtn, '-is-active');
        this.toggleClass(targetBlock, '-is-active');
    }

    static init(groupSelector) {
        if (!ToggleBlock[groupSelector]) {
            ToggleBlock[groupSelector] = new ToggleBlock(groupSelector);
        }
    }
}

/* harmony default export */ __webpack_exports__["default"] = (ToggleBlock);

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class SvgLoad {
    constructor(svgPath) {
        this.ajax = new XMLHttpRequest();
        this.getSvgContent(svgPath);
    }

    /**
     * Подгружает содержимое svg-файла
     * @param svgPath - путь к svg-файлу
     */
    getSvgContent = (svgPath) => {
        this.ajax.open("GET", svgPath, true);
        this.ajax.send();
        this.ajax.onload = this.loadContent;
    }

    /**
     * Добавляет загруженное содержимое svg-файла в скрытый div
     */
    loadContent = () => {
        const svgDiv = document.createElement("div");
        svgDiv.style.display = "none";
        svgDiv.innerHTML = this.ajax.responseText;
        document.body.insertBefore(svgDiv, document.body.childNodes[0]);
    }

    static init(svgPath) {
        if (!SvgLoad[svgPath]) {
            SvgLoad[svgPath] = new SvgLoad(svgPath);
        }
    }
}

/* harmony default export */ __webpack_exports__["default"] = (SvgLoad);

/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);


class MovingPlaceholder {
    static #instances = 0;
    static el = [];

    /**
     * Смещающийся placeholder
     * @param selector - селектор для вызова
     * @param classWrapper - класс блока после инициализации
     */
    constructor(selector, classWrapper) {
        MovingPlaceholder.#instances++;
        this.selector = selector;
        this.classWrapper = classWrapper;
        this.$inputs = document.querySelectorAll(selector);

        this.$inputs.forEach(input => this.modifyInput(input, this.classWrapper));
        document.addEventListener('blur', this.eventBlur, true);
    }

    /**
     * Обрабатывает input
     * @param input
     * @param classWrapper
     */
    modifyInput = (input, classWrapper) => {
        if (!input.placeholder)
            return;

        _Utils__WEBPACK_IMPORTED_MODULE_0__.default.wrapElement(input, 'span', classWrapper);
        const name = document.createElement('span');

        name.classList.add(classWrapper+'__name');
        name.innerText = input.placeholder;
        input.after(name);
        input.removeAttribute('placeholder');
        input.classList.add(classWrapper+'__input');
        input.classList.remove(classWrapper.replace('.', ''));
    }

    /**
     * По blur проверяет был ли заполнен input и
     * при необходимости добавляет class
     * @param e
     */
    eventBlur = (e) => {
        if (e.target.classList.contains(this.classWrapper+'__input')) {
            const el = e.target;

            if (el.value !== '' && el.value !== '+7 (___) ___-__-__' && el.value !== '+7 (') {
                el.classList.add('-is-focus');
            } else {
                el.classList.remove('-is-focus');
            }
        }
    }

    static init = (selector, classWrapper) => {
        if (!MovingPlaceholder.el[MovingPlaceholder.#instances]) {
            MovingPlaceholder.el.push(new MovingPlaceholder(selector, classWrapper));
        }
    }
}

/* harmony default export */ __webpack_exports__["default"] = (MovingPlaceholder);

/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class Utils {
    constructor() {

    }

    /**
     * Замена тега на ссылку для SEO
     */
    static replaceLink = (attrLink = 'data-ex-href') => {
        const selector = `[${attrLink}]`;
        const links = document.querySelectorAll(selector);
        links.forEach(item => {
            let link = item,
                linkHtml = link.innerHTML,
                strTag = '';

            let attributes = link.attributes;
            for(let attr of attributes) {
                strTag += ` ${attr.name.replace(attrLink, 'href')}="${attr.value}"`;
            }
            strTag += `data-replaced-link="true"`;
            link.insertAdjacentHTML('beforebegin', `<a${strTag}>${linkHtml}</a>`);
            link.remove();
        });
    }

    /**
     * Обернуть элемент в тэг
     * @param el - оборачиваемый элемент
     * @param tagWrap - тэг, которым будет обернут элемент
     * @param tagClass - класс тэга
     */
    static wrapElement = function(el, tagWrap, tagClass) {
        const wrapper = document.createElement(tagWrap);
        if (tagClass)
            wrapper.classList.add(tagClass);

        el.before(wrapper);
        wrapper.append(el);

        return wrapper;
    }

    static maskPhone = function(selector, masked = '+7 (___) ___-__-__') {
        const elems = document.querySelectorAll(selector);

        function mask(event) {
            const keyCode = event.keyCode;
            const template = masked,
                def = template.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, "");
            //console.log(template);
            let i = 0,
                newValue = template.replace(/[_\d]/g, function (a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
                });
            i = newValue.indexOf("_");
            if (i !== -1) {
                newValue = newValue.slice(0, i);
            }
            let reg = template.substr(0, this.value.length).replace(/_+/g,
                function (a) {
                    return "\\d{1," + a.length + "}";
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
                this.value = newValue;
            }
            if (event.type === "blur" && this.value.length < 5) {
                this.value = "";
            }
        }

        for (const elem of elems) {
            elem.addEventListener("input", mask);
            elem.addEventListener("focus", mask);
            elem.addEventListener("blur", mask);
        }

    }
}

/* harmony default export */ __webpack_exports__["default"] = (Utils);

/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class Tabs {
    static #instances = 0;
    static el = [];

    constructor(tabContainer, tabPanelContainer) {
        Tabs.#instances++;
        if (typeof tabContainer == 'object') {
            this.tabContainer = tabContainer;
        } else {
            this.tabContainer = document.querySelector(tabContainer);
        }

        if (typeof tabPanelContainer === 'object') {
            this.tabPanelContainer = tabPanelContainer;
        } else {
            this.tabPanelContainer = document.querySelector(tabPanelContainer);
        }

        if (this.tabContainer === null || this.tabPanelContainer === null)
            return;

        this.setTabIndex();
        this.openTab(0);

        this.tabContainer.addEventListener('click', event => {
            const tab = event.target.closest('[data-tab-index]');
            if (tab === null)
                return false;
            const index = tab.dataset.tabIndex;

            this.openTab(index);
        });
    }

    /**
     * Проставляем индексы табов
     */
    setTabIndex() {
        const tabList = this.tabContainer.children;
        const tabPanelList = this.tabPanelContainer.children;

        let tabIndex = 0;

        for (let tab of tabList) {
            tab.setAttribute('data-tab-index', tabIndex);
            if (tabPanelList[tabIndex])
                tabPanelList[tabIndex].setAttribute('data-tabpanel-index', tabIndex);
            tabIndex ++;
        }
    }

    /**
     * Открываем таб с выбранным индексом
     * @param index
     */
    openTab(index) {
        let tabActive = this.tabContainer.querySelector('.-is-active');
        let tabPanelActive;

        let tabPanels = this.tabPanelContainer.children;
        for (let tabPanel of tabPanels) {
            if (tabPanel.classList.contains('-is-active')) {
                tabPanelActive = tabPanel;
            }
        }

        if (tabActive)
            tabActive.classList.remove('-is-active');
        if (tabPanelActive)
            tabPanelActive.classList.remove('-is-active');

        this.tabContainer.querySelector(`[data-tab-index = "${index}"]`).classList.add('-is-active');
        this.tabPanelContainer.querySelector(`[data-tabpanel-index = "${index}"]`).classList.add('-is-active');
    }

    static init = (tabContainer, tabPanelContainer) => {
        if (!Tabs.el[Tabs.#instances]) {
            Tabs.el.push(new Tabs(tabContainer, tabPanelContainer));
        }
    }
}

/* harmony default export */ __webpack_exports__["default"] = (Tabs);

/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class HiddenCaptcha {
    static #instancesIndex = 0;
    static instances = [];

    constructor({formSelector, hiddenInput = 'CAPTCHA_HIDDEN', buttonSelector = 'div[class*=button]'}) {
        HiddenCaptcha.#instancesIndex++;

        this.formSelector = formSelector;
        this.hiddenInput = hiddenInput;
        this.buttonSelector = buttonSelector;

        this.getForms().forEach($form => {
            try {
                if (!this.hiddenInput)
                    throw new Error("Не задан селектор скрытого поля");

                if (!this.buttonSelector)
                    throw new Error("Не задан селектор кнопки");

                if (!this.getHiddenInput($form))
                    throw new Error("Не найдено скрытое поле");

                if (!this.getButton($form))
                    throw new Error("Не найдена кнопка");

                $form.setAttribute('data-hidden-captcha', 'true');
                this.changeButton($form);
                $form.addEventListener('submit', this.handlerSubmit);

            } catch(e) {
                console.error(`${e.name}: ${e.message}. Форма:`);
                console.dir($form);
            }
        });
    }

    /**
     * Обработчик submit формы
     * @param e
     */
    handlerSubmit = (e) => {
        e.preventDefault();
        const   $form = e.target,
                $hiddenInput = this.getHiddenInput($form);

        if (this.isEmpty($hiddenInput))
            $form.submit();
    }

    /**
     * Проверяет не заполнил ли бот скрытое поле
     * @param $hiddenInput
     * @returns {boolean}
     */
    isEmpty = ($hiddenInput) => !$hiddenInput.value;

    /**
     * Возвращает коллекцию форм
     * @returns {NodeListOf<*>}
     */
    getForms = () => document.querySelectorAll(this.formSelector);

    /**
     * Возвращает скрытое поле
     * @param $form
     * @returns {any}
     */
    getHiddenInput = ($form) => $form.querySelector(this.hiddenInput);

    /**
     * Возвращает фейковую кнопку
     * @param $form
     * @returns {any}
     */
    getButton = ($form) => $form.querySelector(this.buttonSelector);

    /**
     * Меняет фейковую кнопку на button
     * @param $form
     */
    changeButton = ($form) => {
        const   $button = this.getButton($form),
                $newButton = document.createElement('button'),
                attributes = $button.attributes;

        [...attributes].forEach(attr => {
            $newButton.setAttribute(attr.name, attr.value);
        });

        $newButton.innerHTML = $button.innerHTML;
        $button.after($newButton);
        $button.remove();
    }

    static init = (options) => {
        if (!HiddenCaptcha.instances[HiddenCaptcha.#instancesIndex]) {
            HiddenCaptcha.instances.push(new HiddenCaptcha(options));
        }
    }
}

HiddenCaptcha.init({
    formSelector: '.js-hidden-captcha',
    hiddenInput: '[name=MIDDLE_NAME]',
    buttonSelector: 'div[class*=button]'
});

/* harmony default export */ __webpack_exports__["default"] = (HiddenCaptcha);

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _FlickitySet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _MobileMenu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _ToggleBlock__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _SvgLoad__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);
/* harmony import */ var _MovingPlaceholder__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5);
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6);
/* harmony import */ var _Tabs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7);
/* harmony import */ var _HiddenCaptcha__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(8);









const app = {
    /**
     * Форматирует число с разделением групп (аналог PHP number_format)
     *
     * original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
     * improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
     * bugfix by: Michael White (http://crestidg.com)
     *
     * @param {number} number - Форматируемое число
     * @param {number} decimals - Число знаков после запятой
     * @param {string} decPoint - Разделитель дробной части
     * @param {string} thousandsSep - Разделитель тысяч
     *
     * @returns {string}
     */
    numberFormat: function (number, decimals, decPoint, thousandsSep) {
        var i, j, kw, kd, km;

        if (isNaN(decimals = Math.abs(decimals))) {
            decimals = 2;
        }

        if (typeof decPoint === 'undefined') {
            decPoint = ',';
        }

        if (typeof thousandsSep === 'undefined') {
            thousandsSep = '.';
        }

        i = parseInt(number = (+number || 0).toFixed(decimals)) + '';

        if ((j = i.length) > 3) {
            j = j % 3;
        } else {
            j = 0;
        }

        km = (j ? i.substr(0, j) + thousandsSep : '');
        kw = i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep);
        kd = (decimals
            ? decPoint + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2)
            : '');

        return km + kw + kd;
    },

    filterBlocks: function() {
        const filters = document.querySelectorAll('[data-filter]');
        filters.forEach((item, index, array) => {
            const filterName = item.dataset.filter;
            const block = document.querySelector(`[data-filter-block=${filterName}]`);

            item.addEventListener('click', (e) => {
                const targetName = e.target.dataset.filterSource;
                const elAll = block.querySelectorAll(`[data-filter-target]`);
                const elShow = block.querySelectorAll(`[data-filter-target=${targetName}]`)
                item.querySelector('.-is-active').classList.remove('-is-active');
                e.target.classList.add('-is-active');

                if (targetName === 'all') {
                    elAll.forEach(function (item, index, array) {
                        item.classList.remove('-is-hidden');
                    });
                } else {
                    elAll.forEach(function (item, index, array) {
                        item.classList.add('-is-hidden');
                    });

                    elShow.forEach(function (item, index, array) {
                        item.classList.remove('-is-hidden');
                    });
                }

                if (this.flickitySet.isFlickity(block)) {
                    this.flickitySet.destroy(block);
                    this.flickitySet.init(block);
                }
            });
        });
    },

    init: function() {
        _HiddenCaptcha__WEBPACK_IMPORTED_MODULE_7__.default.init({
            formSelector: '.form--feedback form',
            hiddenInput: '[name=MIDDLE_NAME]',
            buttonSelector: '.form__button'
        });

        _Utils__WEBPACK_IMPORTED_MODULE_5__.default.maskPhone('[type=tel]');
        _Utils__WEBPACK_IMPORTED_MODULE_5__.default.replaceLink('data-href');

        _SvgLoad__WEBPACK_IMPORTED_MODULE_3__.default.init((window.location.hostname === 'localhost')?'/dist/images/icons.svg':'/local/templates/pixelplus.ru_2021/images/icons.svg');

        _MovingPlaceholder__WEBPACK_IMPORTED_MODULE_4__.default.init('.js-moving-placeholder', 'moving-placeholder');

        _ToggleBlock__WEBPACK_IMPORTED_MODULE_2__.default.init('.phones');
        _ToggleBlock__WEBPACK_IMPORTED_MODULE_2__.default.init('.header-search');

        _Tabs__WEBPACK_IMPORTED_MODULE_6__.default.init('.address__cities', '.address__address');
        _Tabs__WEBPACK_IMPORTED_MODULE_6__.default.init('.phones__regions ul', '.phones__regions-inner');

        const mainMenu = new _MobileMenu__WEBPACK_IMPORTED_MODULE_1__.default('.main-menu', '.page-nav');
        const footerMenu = new _MobileMenu__WEBPACK_IMPORTED_MODULE_1__.default('.footer-menu');

        this.filterBlocks();

        this.flickitySet = new _FlickitySet__WEBPACK_IMPORTED_MODULE_0__.default('[data-flickity-options]');
    }
};

document.addEventListener("DOMContentLoaded", function (e) {
    app.init();
});

}();
/******/ })()
;
//# sourceMappingURL=main.js.map