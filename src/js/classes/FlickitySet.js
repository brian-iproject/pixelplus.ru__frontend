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
        options.on = {
            ready: function() {
                const startIndex = this.element.dataset.flickityStartIndex;
                this.select(startIndex);
            }
        }
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

export default FlickitySet;