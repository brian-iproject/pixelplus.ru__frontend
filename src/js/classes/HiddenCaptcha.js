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

export default HiddenCaptcha;