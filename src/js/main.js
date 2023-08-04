import FlickitySet from './classes/FlickitySet'
import MobileMenu from "./classes/MobileMenu"
import ToggleBlock from "./classes/ToggleBlock"
import SvgLoad from "./classes/SvgLoad"
import MovingPlaceholder from "./classes/MovingPlaceholder"
import Utils from "./classes/Utils"
import Tabs from "./classes/Tabs"
import HiddenCaptcha from "./classes/HiddenCaptcha"
import Tariffs from "./classes/Tariffs";
import AcceptCookie from "./classes/AcceptCookie";
import YtVideoLoad from "./classes/YtVideoLoad";
import CallToAction from "./classes/CallToAction.js";
import {SimpleDiagramGroup} from "./classes/SimpleDiagram.js";

const appnew = {
    filterBlocks: function() {
        const filters = document.querySelectorAll('[data-filter]');
        filters.forEach((item, index, array) => {
            const filterName = item.dataset.filter;
            const block = document.querySelector(`[data-filter-block=${filterName}]`);

            item.addEventListener('click', (e) => {
                const targetName = e.target.dataset.filterSource;
                if (!targetName) return;

                const elAll = block.querySelectorAll(`[data-filter-target]`);
                const elShow = block.querySelectorAll(`[data-filter-target*=${targetName}]`)
                item.querySelector('.-is-active').classList.remove('-is-active');
                e.target.classList.add('-is-active');

                if (targetName === 'all') {
                    elAll.forEach(function (item, index, array) {
                        item.classList.remove('-is-hidden');
                        item.style.visibility = 'visible';
                    });
                } else {
                    elAll.forEach(function (item, index, array) {
                        item.classList.add('-is-hidden');
                    });

                    elShow.forEach(function (item, index, array) {
                        item.classList.remove('-is-hidden');
                        item.style.visibility = 'visible';
                    });
                }

                elShow.forEach((item) => {
                    let flickity = item.querySelector('[data-flickity-options]');
                    if (flickity) {
                        flickity.style.visibility = 'visible';
                        const flkty = this.flickitySet.getFlkty(flickity);
                        flkty.resize();
                    }
                });

                if (this.flickitySet.isFlickity(block)) {
                    this.flickitySet.destroy(block);
                    this.flickitySet.init(block);

                }
            });
        });
    },

    init: function() {
        HiddenCaptcha.init({
            formSelector: '.form--feedback form',
            hiddenInput: '[name=MIDDLE_NAME]',
            buttonSelector: '.form__button'
        });

        Utils.replaceLink('data-href');

        SvgLoad.init((window.location.hostname === 'localhost')?'/images/icons.svg':'/local/templates/pixelplus.ru_2021/images/icons.svg');

        MovingPlaceholder.init('.js-moving-placeholder', 'moving-placeholder');

        ToggleBlock.init('.phones');
        ToggleBlock.init('.header-search');
        ToggleBlock.init('.faq');
        ToggleBlock.init('.main-slider');

        Tabs.init('.address__cities', '.address__address');
        Tabs.init('.phones__regions ul', '.phones__regions-inner');

        CallToAction.init();
        SimpleDiagramGroup.init();

        const mainMenu = new MobileMenu('.main-menu', '.page-nav');
        const footerMenu = new MobileMenu('.footer-menu');

        this.filterBlocks();

        this.flickitySet = new FlickitySet('[data-flickity-options]');

        if (typeof WOW !== 'undefined') {
            const wow = new WOW({
                animateClass: 'animate__animated',
                offset: 50,
                mobile: false
            });
            wow.init();
        }

        if (typeof tippy !== 'undefined') {
            tippy('[data-tippy-content]',{
                animation: 'shift-toward',
                theme: 'light',
                allowHTML: true,
                interactive: true
            });
        }

        if (typeof autosize !== 'undefined') {
            autosize(document.querySelectorAll('.form-short textarea'));
        }

        if (typeof Inputmask !== 'undefined') {
            Inputmask({"mask": "+9 (999) 999-99-99"}).mask('[type=tel]:not(.form__input)');
        }
    }
};

document.addEventListener("DOMContentLoaded", function (e) {
    appnew.init();

    const fieldSelect = document.querySelectorAll('.field-select select');
    for (let i = 0; i < fieldSelect.length; ++i) {
        const el = fieldSelect[i];
        new Choices(el, {
            allowHTML: true,
            searchEnabled: false
        });
    }

    document.querySelectorAll('[data-service]').forEach((item) => {
        const service = new Tariffs(item, {
            tariffsContainer: '.tariff-options',
            selectorTitle: '.tile__title',
            selectorPrice: '.price-more__old span',
            selectorPriceDiscount: '.price-more__actual span',
            discount: 0.15,
            priceSymbol: 'руб.',
            paramsSelectors: [
                '.timing'
            ]
        });
        service.init();
    });

    if (typeof AcceptCookie !== 'undefined') {
        const acceptCookie = new AcceptCookie({
            text: 'Оставаясь на сайте, вы соглашаетесь с использованием cookie-файлов и обработкой <a href="/privacy-policy/">персональных данных</a>.'
        });
        acceptCookie.init();
    }


    const moveTo = new MoveTo();
    document.querySelectorAll('[data-target]').forEach((item) => {
        moveTo.registerTrigger(item);
    });

    if (typeof YtVideoLoad !== 'undefined') {
        document.querySelectorAll('.yt-video').forEach((item) => {
            new YtVideoLoad.init(item);
        });

    }
})
