import FlickitySet from './classes/FlickitySet'
import MobileMenu from "./classes/MobileMenu"
import ToggleBlock from "./classes/ToggleBlock"
import SvgLoad from "./classes/SvgLoad"
import MovingPlaceholder from "./classes/MovingPlaceholder"
import Utils from "./classes/Utils"
import Tabs from "./classes/Tabs"
import HiddenCaptcha from "./classes/HiddenCaptcha"

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
        HiddenCaptcha.init({
            formSelector: '.form--feedback form',
            hiddenInput: '[name=MIDDLE_NAME]',
            buttonSelector: '.form__button'
        });

        Utils.maskPhone('[type=tel]');
        Utils.replaceLink('data-href');

        SvgLoad.init((window.location.hostname === 'localhost')?'/images/icons.svg':'/local/templates/pixelplus.ru_2021/images/icons.svg');

        MovingPlaceholder.init('.js-moving-placeholder', 'moving-placeholder');

        ToggleBlock.init('.phones');
        ToggleBlock.init('.header-search');
        ToggleBlock.init('.faq');

        Tabs.init('.address__cities', '.address__address');
        Tabs.init('.phones__regions ul', '.phones__regions-inner');

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
    }
};

document.addEventListener("DOMContentLoaded", function (e) {
    app.init();
});