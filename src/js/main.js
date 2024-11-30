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
import DetailsSpoiler from "./classes/DetailsSpoiler.js";

import CallToAction from "./classes/CallToAction.js";
import {SimpleDiagramGroup} from "./classes/SimpleDiagram.js";
import Splide from '@splidejs/splide';
import { SplideFilter } from "./classes/Splide/Filter.js"
import LoadScripts from "./classes/LoadScripts.js";
import Like from "./classes/Like.js";
import Calculator from "./classes/Calculator.js";
import Quiz from "./classes/Quiz.js";
import TrafficForecast from "./classes/TrafficForecast.js";
import LockedButton from "./classes/LockedButton.js";
import intlTelInput from 'intl-tel-input';
import { ru } from "intl-tel-input/i18n";

window.pixelplus = {
    Quiz,
    TrafficForecast
};

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
        Calculator.init();

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

        // if (typeof Inputmask !== 'undefined') {
        //     Inputmask({"mask": "+9 (999) 999-99-99", "showMaskOnHover": false}).mask('[type=tel]:not(.form__input)');
        // }

        if (typeof intlTelInput !== 'undefined') {
            const inputsPhone = document.querySelectorAll("[type=tel]:not(.form__input)");
            inputsPhone.forEach(input => {
                intlTelInput(input, {
                    i18n: ru,
                    placeholderNumberType: 'MOBILE',
                    initialCountry: "auto",
                    onlyCountries: ['ru', 'by', 'kz', 'am', 'az', 'kg', 'md', 'tj', 'uz', 'ge', 'us',
                                    'at', 'ax', 'al', 'ad', 'be', 'bg', 'ba', 'va', 'gb', 'hu', 'de',
                                    'gr', 'dk', 'ie', 'is', 'es', 'it', 'lv', 'lt', 'li', 'lu', 'mk',
                                    'mt', 'mk', 'nl', 'no', 'pl', 'pt', 'ro', 'sm', 'rs', 'sk', 'si',
                                    'fi', 'fr', 'hr', 'me', 'cz', 'ch', 'se', 'sj', 'ee', 'ae'],
                    //strictMode: true,
                    nationalMode: false,
                    geoIpLookup: callback => {
                        fetch("https://ipapi.co/json")
                            .then(res => res.json())
                            .then(data => callback(data.country_code))
                            .catch(() => callback("ru"));
                    },
                    loadUtilsOnInit: `https://cdn.jsdelivr.net/npm/intl-tel-input@${intlTelInput.version}/build/js/utils.js`
                });
            });
        }
    }
};

document.addEventListener("DOMContentLoaded", function (e) {
    appnew.init();

    // Оформленный select
    if (typeof Choices !== 'undefined') {
        const fieldSelect = document.querySelectorAll('.field-select select');
        for (let i = 0; i < fieldSelect.length; ++i) {
            const el = fieldSelect[i];
            new Choices(el, {
                allowHTML: true,
                searchEnabled: false,
                itemSelectText: '',
            });
        }
    }

    // Покупка услуг
    document.querySelectorAll('[data-service]').forEach((item) => {
        const service = new Tariffs(item, {
            tariffsContainer: '.tariff-options',
            selectorTitle: '.tile__title',
            selectorPrice: '.price-more__old span',
            selectorPriceDiscount: '.price-more__actual span',
            discount: 0.05,
            priceSymbol: 'руб.',
            paramsSelectors: [
                '.timing'
            ]
        });
        service.init();
    });

    // Плавный скролл до элемента
    if (typeof MoveTo !== 'undefined') {
        const moveTo = new MoveTo();
        document.querySelectorAll('[data-target]').forEach((item) => {
            moveTo.registerTrigger(item);
        });
    }

    // Подгрузка видео
    if (typeof YtVideoLoad !== 'undefined') {
        document.querySelectorAll('.yt-video').forEach((item) => {
            new YtVideoLoad.init(item);
        });
    }

    // Слайдер
    if (typeof Splide !== 'undefined') {
        const mainslider = document.querySelector('.splide.main-slider');
        if (mainslider) {
            new Splide(mainslider, {
                type: 'fade',
                rewind: true,
                autoplay: false,
                interval: 3000,
                speed: 0,
                pauseOnHover: true,
                mediaQuery: 'min',
                perPage: 1,
                autoWidth: false,
                dragMinThreshold: {
                    mouse: 100,
                    touch: 10,
                },
                arrows: true,
                pagination: true,
                arrowPath: 'M15.5387,34.6673a2.20921,2.20921,0,0,1-1.562-3.7729L24.8721,20.0006,13.9767,9.10511A2.20907,2.20907,0,1,1,17.1008,5.981L29.5599,18.4385a2.21446,2.21446,0,0,1,0,3.1241L17.1008,34.0217A2.21276,2.21276,0,0,1,15.5387,34.6673Z',
            }).mount();
        }

        const carouselList = document.querySelectorAll('.splide.carousel');
        if (carouselList.length > 0) {
            carouselList.forEach((item) => {
                new Splide(item, {
                    mediaQuery: 'min',
                    gap: 'var(--grid-gutter)',
                    perPage: 1,
                    autoWidth: false,
                    arrows: true,
                    pagination: true,
                    arrowPath: 'M15.5387,34.6673a2.20921,2.20921,0,0,1-1.562-3.7729L24.8721,20.0006,13.9767,9.10511A2.20907,2.20907,0,1,1,17.1008,5.981L29.5599,18.4385a2.21446,2.21446,0,0,1,0,3.1241L17.1008,34.0217A2.21276,2.21276,0,0,1,15.5387,34.6673Z',
                }).mount({
                    SplideFilter,

                    function(Splide, Components, options) {
                        const slides = Components.Elements.slides;
                        const stages = Splide.root.querySelector('.carousel__stages');

                        function mount() {
                            if (stages) {
                                Splide
                                    .on('mounted', () => {
                                        slides.forEach((item, index) => {
                                            const button = document.createElement('button');
                                            button.classList.add('tag');

                                            if (item.classList.contains('is-active')) {
                                                button.classList.add('-is-selected');
                                            }
                                            button.innerText = `${index + 1} этап`;
                                            button.addEventListener('click', () => {
                                                Splide.go(index);

                                            });
                                            stages.append(button);
                                        });
                                    })
                                    .on('inactive', (slide) => {
                                        const button = stages.children[slide.index];
                                        if (button) {
                                            button.classList.remove('-is-selected');
                                        }
                                    })

                                    .on('active', (slide) => {
                                        const button = stages.children[slide.index];
                                        if (button) {
                                            button.classList.add('-is-selected');
                                        }
                                    });
                            }
                        }

                        return {
                            mount,
                        };
                    }
                });
            });
        }
    }

    // Спойлер для элементов details
    if (typeof DetailsSpoiler !== 'undefined') {
        document.querySelectorAll('.details').forEach((el) => {
            new DetailsSpoiler(el);
        });
    }

    // Предупреждение об использовании кук
    if (typeof AcceptCookie !== 'undefined') {
        new AcceptCookie({
            cookie: {
                name: 'ACCEPT_COOKIE'
            },
            showModal: true,
            text: `
                <div>
                    <div class="h3">Пиксель Плюс — агентство без неожиданностей!</div>
                    <p>Наша миссия: помогать бизнесу зарабатывать больше</p>
                    <ol class="list">
                        <li>С 2006 года остались верны своим убеждениям и подходу. Мы помогли 1000+ бизнесам наших клиентов. Наша цель — стать № 1 по лояльности клиентов.</li>
                        <li>Мы используем cookie-файлы для аналитики, чтобы ваше посещение сайта было удобным и персонализированным. Нажимая «Продолжить» или закрывая окно вы соглашаетесь с использованием cookie-файлов и обработку персональных данных с использованием Яндекс.Метрики и Google Analytics.</li>
                    </ol>
                    <div class="-ta-c"><button class="button button--green" data-fancybox-close="">Продолжить</button></div>
                </div>
            `,
            on: {
                afterClose: () => {
                    if (typeof yaCounter97488884 !== 'undefined') {
                        yaCounter97488884.reachGoal("klick-po-forme");
                    }
                },
                beforeSet: () => {
                    if (typeof LoadScripts !== 'undefined') {
                        new LoadScripts([
                            {
                                html: `<script type="text/javascript">(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date(); for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }} k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}) (window, document, "script", "https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js", "ym"); ym(97488884, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true, trackHash:true }); <\/script><noscript><div><img src="https://mc.yandex.ru/watch/97488884" style="position:absolute; left:-9999px;" alt="" /><\/div><\/noscript>`,
                                areaSelector: '#loadCounters'
                            }
                        ],{
                            uaSearchBotCustom: ['PixelTools', 'PixelBot'],
                        });
                    }
                },
                afterSet: () => {
                    if (typeof LoadScripts !== 'undefined') {
                        new LoadScripts([
                            {
                                html: `<script type="text/javascript">(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}) (window, document, "script", "https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js", "ym"); ym(11819104, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true, trackHash:true }); <\/script> <noscript><div><img src="https://mc.yandex.ru/watch/11819104" style="position:absolute; left:-9999px;" alt="" \/><\/div><\/noscript>`,
                                areaSelector: '#loadCounters'
                            },
                            {
                                html: `<script async src="https://www.googletagmanager.com/gtag/js?id=UA-10559811-1"></script><script>window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date());gtag('config', 'UA-10559811-1');</script>`,
                                areaSelector: '#loadCounters'
                            },
                            {
                                html: `<script async src="https://www.googletagmanager.com/gtag/js?id=G-0RP8TPZEPS"><\/script><script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-0RP8TPZEPS');<\/script>`,
                                areaSelector: '#loadCounters'
                            }
                        ],{
                            uaSearchBotCustom: ['PixelTools', 'PixelBot'],
                        });
                    }
                }
            }
        });
    }

    // Лайк
    if (typeof Like !== 'undefined') {
        document.querySelectorAll('.like').forEach((item) => {
            new Like(item, '/local/templates/pixelplus.ru_2021/components/bitrix/news.detail/team/ajax.php');
        });
    }

    // Блокировка повторного клика по кнопке формы
    if (typeof LockedButton !== 'undefined') {
        document.querySelectorAll('form[data-locked-button=true]').forEach((el) => {
            new LockedButton(el, {
                selectors: {
                    button: '.form-short__field .button, button.subscribe-footer__button, .form .form__button',
                }
            });
        })
    }
})
