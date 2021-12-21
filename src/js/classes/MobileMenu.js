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

export default MobileMenu;