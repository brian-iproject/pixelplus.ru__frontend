class Utils {
    constructor() {

    }

    /**
     * Замена тега на ссылку для SEO
     */
    static replaceLink = (attrLink = 'data-ex-href') => {
        const selector = `[${attrLink}]`;
        const links = document.querySelectorAll(selector);
        links.forEach(item => {
            let link = item,
                linkHtml = link.innerHTML,
                strTag = '';

            let attributes = link.attributes;
            for(let attr of attributes) {
                strTag += ` ${attr.name.replace(attrLink, 'href')}="${attr.value}"`;
            }
            strTag += `data-replaced-link="true"`;
            link.insertAdjacentHTML('beforebegin', `<a${strTag}>${linkHtml}</a>`);
            link.remove();
        });
    }

    /**
     * Обернуть элемент в тэг
     * @param el - оборачиваемый элемент
     * @param tagWrap - тэг, которым будет обернут элемент
     * @param tagClass - класс тэга
     */
    static wrapElement = function(el, tagWrap, tagClass) {
        const wrapper = document.createElement(tagWrap);
        if (tagClass)
            wrapper.classList.add(tagClass);

        el.before(wrapper);
        wrapper.append(el);

        return wrapper;
    }
}

export default Utils;