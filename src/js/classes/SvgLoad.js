class SvgLoad {
    constructor(svgPath) {
        this.ajax = new XMLHttpRequest();
        this.getSvgContent(svgPath);
    }

    /**
     * Подгружает содержимое svg-файла
     * @param svgPath - путь к svg-файлу
     */
    getSvgContent = (svgPath) => {
        this.ajax.open("GET", svgPath, true);
        this.ajax.send();
        this.ajax.onload = this.loadContent;
    }

    /**
     * Добавляет загруженное содержимое svg-файла в скрытый div
     */
    loadContent = () => {
        const svgDiv = document.createElement("div");
        svgDiv.style.display = "none";
        svgDiv.innerHTML = this.ajax.responseText;
        document.body.insertBefore(svgDiv, document.body.childNodes[0]);
    }

    static init(svgPath) {
        if (!SvgLoad[svgPath]) {
            SvgLoad[svgPath] = new SvgLoad(svgPath);
        }
    }
}

export default SvgLoad;