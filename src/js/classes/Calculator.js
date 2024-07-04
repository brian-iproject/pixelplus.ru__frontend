"use strict";

class Calculator {
    constructor() {
        this.$calcFrame = document.querySelector('.calculator');
        if (!this.$calcFrame) return;

        this.$inputs = this.$calcFrame.querySelectorAll('.calculator__input');
        this.$detailResult = this.$calcFrame.querySelector('.calculator__detail-result');
        this.$showDetail = this.$calcFrame.querySelector('.calculator__toggle-detail');
        this.$result = this.$calcFrame.querySelector('.calculator__result');
        this.$detailResult = this.$calcFrame.querySelector('.calculator__detail-result');
        this.$totalPrice = this.$calcFrame.querySelector('.calculator__total-price');

        this.trafficValue = 0;
        this.trafficBrandValue = 0;
        this.trafficNewValue = 0;

        this.init();
    }

    /**
     * Проверяем заполнен ли input
     * @param input
     * @returns {boolean}
     */
    checkInput = (input) => {
        /*if (input.name === 'TRAFFIC' && (input.value > this.trafficNewValue && this.trafficNewValue > 0))
            return false*/

        if (input.name === 'TRAFFIC_BRAND' && input.value > 100)
            return false

        /*if (input.name === 'TRAFFIC_NEW' && input.value <= this.trafficValue)
            return false*/

        return !!input.value;
    }

    /**
     * Получить результаты расчёта
     * @returns {{trafficBrand: (*|number), trafficNew: (*|number), baseTraffic: number, totalPrice: number, traffic: (*|number)}|boolean}
     */
    getResult = () => {
        this.trafficValue = Number(this.deleteSymbols(this.$calcFrame.querySelector('[name=TRAFFIC]').value));
        this.trafficBrandValue =  Number(this.deleteSymbols(this.$calcFrame.querySelector('[name=TRAFFIC_BRAND]').value));
        this.trafficNewValue =  Number(this.deleteSymbols(this.$calcFrame.querySelector('[name=TRAFFIC_NEW]').value));

        const traffic = this.trafficValue,
            trafficBrand =  this.trafficBrandValue,
            trafficNew =  this.trafficNewValue;

        if (!trafficNew || trafficBrand > 100)
            return false;

        let baseTraffic = traffic - (traffic * trafficBrand/100);
        let totalPrice = (trafficNew - baseTraffic - (trafficNew * trafficBrand/100)) * 8;

        totalPrice = (totalPrice >= 0) ? Math.ceil(totalPrice) : 0;

        return {traffic, trafficBrand, trafficNew, baseTraffic, totalPrice};
    }

    /**
     * Отрисовка результатов расчёта
     */
    renderResult = () => {
        const dataExists = !!this.getResult();

        this.$result.classList.toggle('-active', dataExists);

        if (dataExists) {
            const {traffic, trafficBrand, trafficNew, baseTraffic, totalPrice} = this.getResult();
            this.$totalPrice.innerText = this.numberFormatting(totalPrice);

            if (trafficNew > traffic) {
                this.$detailResult.innerHTML = `
                    <span class="fw-b">Расчеты</span><br>
                      Базовый трафик = ${this.numberFormatting(traffic)} - (${this.numberFormatting(traffic)} * ${this.numberFormatting(trafficBrand)}%) = ${this.numberFormatting(baseTraffic)}<br>
                                    Итоговая сумма платежа = (${this.numberFormatting(trafficNew)} - ${this.numberFormatting(baseTraffic)} - (${this.numberFormatting(trafficNew)} * ${this.numberFormatting(trafficBrand)}%)) * 8 = ${this.numberFormatting(totalPrice)} рублей
                `;
            } else {
                this.$detailResult.innerHTML = `
                    <span class="fw-b">Расчеты</span><br>
                      Базовый трафик = ${this.numberFormatting(traffic)} - (${this.numberFormatting(traffic)} * ${this.numberFormatting(trafficBrand)}%) = ${this.numberFormatting(baseTraffic)}<br>
                                    Итоговая сумма платежа = 0 рублей
                `;
            }


        } else {
            this.$detailResult.innerText = '';
            this.$totalPrice.innerText = '';
        }
    }

    /**
     * Форматируем значение внутри инпута:
     * убираем лишние символы, добавляем единицу
     * @param input
     * @returns {string}
     */
    inputFormatting = (input) => {
        let value = this.deleteSymbols(input.value);
        if (!value) return '';
        return `${this.numberFormatting(value)}${input.dataset.unit?input.dataset.unit:''}`;
    }

    /**
     * Форматирование числа
     * @param value
     * @returns {string}
     */
    numberFormatting = (value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    /**
     * Удаляем все символы, кроме чисел
     * @param value
     */
    deleteSymbols = (value) => value.replace(/[^\+\d]/g, '');

    init = () => {
        this.$calcFrame.addEventListener('input', (e) => {
            const input = e.target;
            input.value = this.deleteSymbols(input.value);

            input.classList.toggle('-success', this.checkInput(input));
            input.classList.toggle('-error', !this.checkInput(input));

            this.renderResult();
        });

        this.$calcFrame.addEventListener('blur', (e) => {
            const input = e.target;
            input.value = this.inputFormatting(input);

            this.renderResult();
        }, true);

        this.$calcFrame.addEventListener('focus', (e) => {
            const input = e.target;
            input.value = this.deleteSymbols(input.value);
        }, true);

        this.$showDetail.addEventListener('click', (e) => {
            const button = e.target;
            button.classList.toggle('-active');
            this.$detailResult.classList.toggle('-active');
        });

        this.renderResult();

        this.$inputs.forEach(item => {
            item.value = this.inputFormatting(item);

            item.classList.toggle('-success', this.checkInput(item));
            item.classList.toggle('-error', !this.checkInput(item));
        });
    }

    static init() {
        new Calculator();
    }
}

export default Calculator;
