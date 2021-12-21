import Utils from "./Utils";

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

        Utils.wrapElement(input, 'span', classWrapper);
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

export default MovingPlaceholder;