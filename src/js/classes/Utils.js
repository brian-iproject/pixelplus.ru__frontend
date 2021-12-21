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

    static maskPhone = function(selector, masked = '+7 (___) ___-__-__') {
        const elems = document.querySelectorAll(selector);

        function mask(event) {
            const keyCode = event.keyCode;
            const template = masked,
                def = template.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, "");
            //console.log(template);
            let i = 0,
                newValue = template.replace(/[_\d]/g, function (a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
                });
            i = newValue.indexOf("_");
            if (i !== -1) {
                newValue = newValue.slice(0, i);
            }
            let reg = template.substr(0, this.value.length).replace(/_+/g,
                function (a) {
                    return "\\d{1," + a.length + "}";
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
                this.value = newValue;
            }
            if (event.type === "blur" && this.value.length < 5) {
                this.value = "";
            }
        }

        for (const elem of elems) {
            elem.addEventListener("input", mask);
            elem.addEventListener("focus", mask);
            elem.addEventListener("blur", mask);
        }

    }
}

export default Utils;