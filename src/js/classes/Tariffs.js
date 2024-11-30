import HiddenCaptcha from "./HiddenCaptcha";
import MovingPlaceholder from "./MovingPlaceholder";
import intlTelInput from "intl-tel-input";
import {ru} from "intl-tel-input/i18n";

class Tariffs {
    constructor($service, {
        serviceId               = null,
        currentTariff           = null,
        tariffsContainer        = '[data-service-tariffs]',
        selectorPrice           = '[data-service-price]',
        selectorPriceDiscount   = '[data-service-price-discount]',
        discount                = 0,
        paramsSelectors         = []
    }) {

        this.serviceList = null;
        this.$service = $service;
        this.serviceId = serviceId ? serviceId : this.$service.dataset.service;
        this.$tariffList = null;
        this.currentTariff = currentTariff;

        this.tariffsContainer = tariffsContainer;
        this.selectorPrice = selectorPrice;
        this.selectorPriceDiscount = selectorPriceDiscount;
        this.discount = discount;
        this.paramsSelectors = paramsSelectors;

        this.selectorTariff = '[data-service-tariff]';
        this.priceFormat = {
            style: 'decimal',
            currency: 'RUB',
            currencyDisplay: 'code',
            maximumFractionDigits: 0
        };

        this.$loader = '<svg width="51px" height="50px" viewBox="0 0 51 50"><rect y="0" width="13" height="50" fill="#800000"><animate attributeName="height" values="50;10;50" begin="0s" dur="1s" repeatCount="indefinite" /><animate attributeName="y" values="0;20;0" begin="0s" dur="1s" repeatCount="indefinite" /></rect><rect x="19" y="0" width="13" height="50" fill="#cc0000"><animate attributeName="height" values="50;10;50" begin="0.2s" dur="1s" repeatCount="indefinite" /><animate attributeName="y" values="0;20;0" begin="0.2s" dur="1s" repeatCount="indefinite" /></rect><rect x="38" y="0" width="13" height="50" fill="#e00000"><animate attributeName="height" values="50;10;50" begin="0.4s" dur="1s" repeatCount="indefinite" /><animate attributeName="y" values="0;20;0" begin="0.4s" dur="1s" repeatCount="indefinite" /></rect></svg>';
    }

    getServiceList = async () => {
        const url = (window.location.hostname === 'localhost') ?
            '/js/tariffs.json' :
            '/services-order/tariffs.json'

        const response = await fetch(url);

        if (response.status !== 200) {
            throw new Error("Ошибка чтения файла. Код: " + response.status);
        }
        return await response.json();
    }

    init = async () => {
        try {
            this.serviceList = await this.getServiceList();

            this.initTariff();
            this.setCurrentTariff();
            const $button = this.$service.querySelector('button');
            if ($button && !$button.closest('form')) {
                $button.addEventListener('click', this.buyServiceHandler);
            }

            const forms = this.$service.querySelectorAll('form');
            forms.forEach((item) => {
                item.addEventListener('submit', this.sendOrderHandler);
            });
        } catch (e) {
            console.error( e.name + ' ' + e.message );
        }
    }

    selectTariffsHandler = (e) => {
        const $tariff = e.target.closest(this.selectorTariff);
        const tariffId = $tariff.dataset.serviceTariff;
        this.setTariff(tariffId);
    }

    sendOrderHandler = async (e) => {
        e.preventDefault();
        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.ready(() => {
                grecaptcha.execute(e.target.querySelector('[name*=RC_KEY]').value, {action: 'service_by'})
                    .then(function (token) {
                        var recaptchaResponse = e.target.querySelector('input[name=recaptcha_response]');

                        if (recaptchaResponse)
                            recaptchaResponse.value = token;
                    })
                    .then(()=> {
                        this.sendOrder(e.target);
                    });
            });
        } else {
            await this.sendOrder(e.target);
        }
    }

    startLoading = () => {
        const $loader = document.createElement('div');
        const $orderWrap = document.querySelector('.order-service');

        $loader.innerHTML = this.$loader;
        $loader.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,.8); z-index: 5;';

        $orderWrap.append($loader);

        return $loader;
    }

    addAlert = (alertText, type = 'info') => {
        try {
            const $based = document.querySelector('.order-service');
            const $head = $based.querySelector('h1, h2, h3');
            const $alert = document.createElement('div');
            $alert.classList.add('alert', 'alert--' + type);

            alertText.forEach((item) => {
                const $p = document.createElement('p');
                $p.innerHTML = item;

                $alert.append($p);
            })

            if ($head) {
                $head.after($alert);
            } else if ($based) {
                $based.prepend($alert);
            }
        } catch (error) {
            console.error(error);

            if (type == 'error') {
                console.error(alertText);
            } else {
                console.info(alertText);
            }
        }
    }

    removeAlert = () => {
        try {
            const $based = document.querySelector('.order-service');
            $based.querySelector('.alert').remove();
        } catch (error) {
            console.error(error);
        }
    }

    sendOrder = async ($form) => {
        const $loader = this.startLoading();
        this.removeAlert();

        const url = (window.location.hostname === 'localhost') ?
            'http://pixelplus.local/services-order/ajax.php' :
            '/services-order/ajax.php';

        fetch(url, {
            method: 'POST',
            headers:{
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': '*'
            },
            body: new FormData($form)
        })

            .then((response) => response.json())
            .then((result) => {
                if (result['data']['errors']) {
                    $loader.remove();
                    this.addAlert(
                        result['data']['errors'],
                        'error'
                    );
                } else if (result['data']['success']) {
                    $loader.remove();
                    $form.closest('[data-service]').remove();
                    this.addAlert(
                        result['data']['success'],
                        'success'
                    );
                    const confirmationUrl = result['data']['confirmationUrl'];
                    window.open(confirmationUrl);
                }
            });
    }



    buyServiceHandler = (e) => {
        e.preventDefault();

        const url = (window.location.hostname === 'localhost') ?
                    'http://pixelplus.local/services-order/ajax.php' :
                    '/services-order/ajax.php';

        Fancybox.show([{
            src: url + '?SERVICE_ID=' + this.serviceId + '&TARIFF_ID=' + this.currentTariff + '&PAGE_URL=' + window.location.href,
            type: 'ajax'
        }], {
            dragToClose: false,
            mainClass: 'modal-fancybox',
            on : {
                done: () => {
                    const servicesNode = document.querySelectorAll('.modal-fancybox [data-service]');
                   // const forms = document.querySelectorAll('.modal-fancybox [data-service] form');

                    servicesNode.forEach((item) => {
                        const service = new Tariffs(item, {
                            serviceId: this.serviceId,
                            currentTariff: this.currentTariff,
                            tariffsContainer: '.tariff-options',
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
                    HiddenCaptcha.init({
                        formSelector: '.modal-fancybox .js-hidden-captcha',
                        hiddenInput: '[name=MIDDLE_NAME]',
                        buttonSelector: 'div[class*=js-hidden-button]'
                    });
                    MovingPlaceholder.init('.js-moving-placeholder', 'moving-placeholder');
                    if (typeof autosize !== 'undefined') {
                        autosize(document.querySelectorAll('.form-short textarea'));
                    }
                    // if (typeof Inputmask !== 'undefined') {
                    //     Inputmask({"mask": "+9 (999) 999-99-99"}).mask('[type=tel]:not(.form__input)');
                    // }

                    if (typeof intlTelInput !== 'undefined') {
                        const inputsPhone = document.querySelectorAll("[type=tel]:not(.form__input)");
                        inputsPhone.forEach(input => {
                            intlTelInput(input, {
                                i18n: ru,
                                placeholderNumberType: 'MOBILE',
                                initialCountry: "auto",
                                onlyCountries: ['ru', 'by', 'kz', 'am', 'az', 'kg', 'md', 'tj', 'uz', 'us',
                                    'at', 'ax', 'al', 'ad', 'be', 'bg', 'ba', 'va', 'gb', 'hu', 'de',
                                    'gr', 'dk', 'ie', 'is', 'es', 'it', 'lv', 'lt', 'li', 'lu', 'mk',
                                    'mt', 'mk', 'nl', 'no', 'pl', 'pt', 'ro', 'sm', 'rs', 'sk', 'si',
                                    'fi', 'fr', 'hr', 'me', 'cz', 'ch', 'se', 'sj', 'ee'],
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

                    // forms.forEach((item) => {
                    //     item.addEventListener('submit', this.sendOrderHandler);
                    // });
                }
            }
        });
    }


    renderTariffs = () => {
        const $tariffsContainer = this.$service.querySelector(this.tariffsContainer);
        if ($tariffsContainer === null) {
            console.error('Не найден контейнер для тарифов');
            return false;
        }

        let $tariffsList = null;
        const tariffLst = this.getTariffList();

        if (this.tariffsContainer !== '.tariff-options') {
            $tariffsList = document.createElement('ul');
            $tariffsList.classList.add('tariff-options');
        }

        tariffLst.forEach((item) => {
            const tariffItem =  ($tariffsContainer.tagName == 'UL') ?
                                document.createElement('li') :
                                document.createElement('div');
            tariffItem.innerText = item.title;
            tariffItem.setAttribute('data-service-tariff', item.id);
            tariffItem.classList.add('tariff-options__item');

            //this.$tariffList.push(tariffItem);

            $tariffsList ? $tariffsList.append(tariffItem) : $tariffsContainer.append(tariffItem)
        });

        if ($tariffsList)
            $tariffsContainer.append($tariffsList);
    }

    getTariffNode = (tariffId) =>
        this.$service.querySelector(`[data-service-tariff="${tariffId}"]`);

    setTariff = (tariffId) => {
        const   $tariff = this.getTariffNode(tariffId),
                $price = this.$service.querySelector(this.selectorPrice),
                $priceDiscount = this.$service.querySelector(this.selectorPriceDiscount),

                tariffObj = this.getTariffList().find(item => item.id == tariffId),
                price = tariffObj.price;

        this.setPrice($price, price);
        this.setPrice($priceDiscount, this.getPriceDiscount(price));

        if (this.paramsSelectors.length)
            this.setParams(tariffObj.params);

        this.setTariffClass($tariff);
        this.setButtonParams(tariffId);
        this.setFormParams(tariffId);
        this.currentTariff = tariffId;
    }

    initTariff = () => {
        if (this.$service.querySelectorAll(this.selectorTariff).length === 0) {
            this.renderTariffs();
        }

        this.$tariffList = this.$service.querySelectorAll(this.selectorTariff);

        this.$tariffList.forEach((item) => {
            item.addEventListener('click', this.selectTariffsHandler);
        });
    }

    /**
     * Устанавливает отформатированную цену в элементе
     * @param {Element} $price - элемент
     * @param {number} price - цена
     */
    setPrice = ($price, price) => {
        $price.innerText = new Intl.NumberFormat('ru-RU', this.priceFormat).format(price);
    }

    /**
     * Возвращает цену со скидкой
     * @param {number} price - цена
     * @returns {number} - цена со скидкой
     */
    getPriceDiscount = (price) => price * (1 - this.discount);

    /**
     * Устанавливает параметры тарифа
     * @param {Array} params - массив параметров тарифа
     */
    setParams = (params) => {
        this.paramsSelectors.forEach((item, index) => {
            const $params = this.$service.querySelector(item);
            if ($params)
                $params.innerText = params[index]
        });
    }

    /**
     * Устанавливает class активности для тарифа
     * @param {Element} $tariff - элемент тарифа
     */
    setTariffClass = ($tariff) => {
        this.$service.querySelectorAll(this.selectorTariff).forEach((item) => {
            item.classList.remove('-is-selected');
        });
        $tariff.classList.add('-is-selected');
    }

    /**
     * Возвращает объект услуги
     * @returns {*}
     */
    getServiceObj = () => this.serviceList.find(item => item.id == this.serviceId);

    /**
     * Возвращает список тарифов
     * @returns {*}
     */
    getTariffList = () => this.getServiceObj(this.serviceId)['tariffs'];

    /**
     * Возвращает тариф по-умолчанию, либо первый тариф
     * @returns {*}
     */
    getDefaultTariff = () =>   {
        return  this.getTariffList().find(item => item.default === true) ||
                this.getTariffList()[0];
    }

    setCurrentTariff = () => {
        const tariffId = this.currentTariff ? this.currentTariff : this.getDefaultTariff(this.serviceId).id;
        const $tariff = this.getTariffNode(tariffId);

        this.setTariff(tariffId);
        this.setTariffClass($tariff);
    }

    setButtonParams = (tariffId) => {
        const $button = this.$service.querySelector('button');
        if ($button) {
            $button.dataset.serviceId = this.serviceId;
            $button.dataset.tariffId = tariffId;
        }
    }

    setFormParams = (tariffId) => {
        const $inputService = this.$service.querySelector('[name*=SERVICE_ID]');
        const $inputTariff = this.$service.querySelector('[name*=TARIFF_ID]');

        if ($inputService && $inputTariff) {
            $inputService.value = this.serviceId;
            $inputTariff.value = tariffId;
        }

    }

    // static init($service, obj) {
    //     if (!Tariffs.item) {
    //         Tariffs.item = new Tariffs($service, obj);
    //     }
    // }
}

export default Tariffs;