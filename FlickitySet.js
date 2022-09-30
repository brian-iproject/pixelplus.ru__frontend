class FlickitySet {
    static #instances = 0;
    static el = [];

    /**
     *
     * @param selector - селектор блока слайдера
     */
    constructor($block) {
        if (typeof Flickity === 'undefined') {
            console.warn('Flickity is not defined');
            return;
        }

        this.$block = $block;
        this.flkty = null;

        this.create();
    }

    /**
     * Инициализирует flickity
     * @param $block - node-элемент
     */
    create = () => {
        this.$block.setAttribute('data-flickity-index', FlickitySet.#instances);
        const options = this.getOptions();

        this.flkty = new Flickity(this.$block, options);

        FlickitySet.#instances++;
    }

    /**
     * Возвращает объект с параметры для инициализации flickity
     * @param $block - node-элемент
     * @returns { Object }
     */
    getOptions = () => JSON.parse(this.$block.dataset.flickityOptions);

    /**
     * Проверяет является ли элемент слайдером
     * @param $block - node-элемент
     * @returns {boolean}
     */
    isFlickity = () => Boolean(this.$block.dataset.flickityIndex);

    /**
     * Возвращает экземпляр flickity
     * @param $block - node-элемент
     * @returns {*}
     */
    getFlkty = () => this.flkty;

    /**
     * Возвращает индекс проинициализированного flickity
     * @param $block - node-элемент
     * @returns {*}
     */
    getFlktyIndex = () => this.$block.dataset.flickityIndex;

    /**
     * Уничтожает экземпляр flickity и удаляет его из массива
     * @param $block - node-элемент
     */
    destroy = ($block) => {
        this.flkty.destroy();
    }

    static init = (selector) => {
        if (!FlickitySet.el[FlickitySet.#instances]) {
            FlickitySet.el.push(new FlickitySet(selector));
        }
    }
}

export default FlickitySet;