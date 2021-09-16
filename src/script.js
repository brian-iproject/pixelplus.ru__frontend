class ToggleBlock {
    constructor(groupSelector) {
        this.groupSelector = groupSelector;

        document.querySelectorAll(groupSelector).forEach((item) => {
            item.addEventListener('click', this.clickHandler);
        })
    }

    clickHandler = (e) => {
        e.preventDefault();
        const toggleBtn = e.target.closest('[data-toggle]');
        if (!toggleBtn) return false;

        this.toggleBlock(toggleBtn);
    }

    getTargetBlock = (toggleBtn) => {
        return toggleBtn.closest(this.groupSelector).querySelector('[data-toggle-target=' + toggleBtn.dataset.toggle + ']');
    }

    toggleClass = (el, cssClass) => {
        el.classList.toggle(cssClass);
    }

    // inputFocus = (targetBlock) => {
    //     const input = targetBlock.querySelector('input[type=text]');
    //     if (input) {
    //         setTimeout(function(){
    //             input.focus();
    //         }, 500);
    //     }
    // }

    toggleBlock = (toggleBtn) => {
        const targetBlock = this.getTargetBlock(toggleBtn);
        // this.inputFocus(targetBlock);
        this.toggleClass(toggleBtn, '-is-active');
        this.toggleClass(targetBlock, '-is-active');
    }

    static init(groupSelector) {
        if (!ToggleBlock[groupSelector]) {
            ToggleBlock[groupSelector] = new ToggleBlock(groupSelector);
        }
    }
}

class MobileMenu {
    constructor(selector, mobileWrapperSelector) {
        this.$menu = document.querySelector(selector);
        this.$mobileWrapper = document.querySelector(mobileWrapperSelector);
        this.$burger = document.querySelector(`[data-burger='${mobileWrapperSelector}']`);
        this.$body = document.querySelector('body');
        this.dropdownSelector = `${selector}__dropdown`;
        this.itemSelector = `${selector}__item`;

        this.init();
    }

    eventClick = (e) => {
        const dropDown = e.target.closest(this.dropdownSelector);
        if (!dropDown) return false
            const item = dropDown.closest(this.itemSelector);
            dropDown.classList.toggle('-is-active');
            item.classList.toggle('-is-active');
    }

    eventBurger = (e) => {
        const burger = e.target.closest('[data-burger]');

        if (!burger) return false;

        burger.classList.toggle('-is-active');
        this.$mobileWrapper.classList.toggle('-is-active');
        this.$body.classList.toggle('-no-scroll');
    }

    init = () => {
        this.$menu.addEventListener('click', this.eventClick);

        if (this.$mobileWrapper)
            this.$burger.addEventListener('click', this.eventBurger);
    }
}


const app = {
    pathToTemplate: '/dist/', // Абсолютный путь до шаблона сайта

    /**
     * Для подгрузки svg-спрайта на сервере
     */
    svgLoad: function() {
        const ajax = new XMLHttpRequest();
        ajax.open("GET", app.pathToTemplate+"images/icons.svg", true);
        ajax.send();
        ajax.onload = function(e) {
            const svgDiv = document.createElement("div");
            svgDiv.style.display = "none";
            svgDiv.innerHTML = ajax.responseText;
            document.body.insertBefore(svgDiv, document.body.childNodes[0]);
        };
    },

    /**
     * Замена тега на ссылку для SEO
     */
    replaceLink: () => {
        const links = document.querySelectorAll('[data-ex-href]');
        links.forEach(item => {
            let link = item,
                linkHtml = link.innerHTML,
                strTag = '';

            let attributes = link.attributes;
            for(let attr of attributes) {
                strTag += ` ${attr.name.replace('data-ex-', '')}="${attr.value}"`;
            }
            strTag += `data-replaced-link="true"`;
            link.insertAdjacentHTML('beforebegin', `<a${strTag}>${linkHtml}</a>`);
            link.remove();
        });
    },

    /**
     * Обернуть элемент в тэг
     * @param el
     * @param tagWrap
     * @param tagClass
     */
    wrapElement: function(el, tagWrap, tagClass) {
        const wrapper = document.createElement(tagWrap);
        if (tagClass)
            wrapper.classList.add(tagClass);

        el.before(wrapper);
        wrapper.append(el);

        return wrapper;
    },
    
    /**
     * Смещающийся placeholder
     * @param selector
     */
    movingPlaceholder: function(selector, classInit) {
        const inputs = document.querySelectorAll(selector);
        for (let input of inputs) {

            if (!input.placeholder)
                continue;
            this.wrapElement(input, 'span', classInit);
            const name = document.createElement('span');

            name.classList.add(classInit+'__name');
            name.innerText = input.placeholder;
            input.after(name);
            input.removeAttribute('placeholder');
            input.classList.add(classInit+'__input');
            input.classList.remove(selector.replace('.', ''));
        }
        document.addEventListener('blur', function (e) {
            if (e.target.classList.contains(classInit+'__input')) {
                const el = e.target;

                if (el.value !== '' && el.value !== '+7 (___) ___-__-__') {
                    el.classList.add('-is-focus');
                } else {
                    el.classList.remove('-is-focus');
                }
            }
        }, true);
    },

    init: function() {
        this.svgLoad();
        this.replaceLink();
        this.movingPlaceholder('.js-moving-placeholder', 'moving-placeholder');
        ToggleBlock.init('.phones');
        ToggleBlock.init('.header-search');
        const mainMenu = new MobileMenu('.main-menu', '.page-nav');
        const footerMenu = new MobileMenu('.footer-menu');
    }
};

app.init();