const app = {
    pathToTemplate: '/local/templates/extrapla.st/', // Абсолютный путь до шаблона сайта

    /**
     * Для подгрузки svg-спрайта на сервере
     */
    svgLoad: function() {
        const ajax = new XMLHttpRequest();
        ajax.open("GET", app.pathToTemplate+"images/icons.svg", true);
        ajax.send();
        ajax.onload = function(e) {
            const svgDiv = document.createElement("div");
            svgDiv.style.display = "none";
            svgDiv.innerHTML = ajax.responseText;
            document.body.insertBefore(svgDiv, document.body.childNodes[0]);
        };
    },

    /**
     * Переключалка мобильного меню
     */
    mobileMenuToggle: function() {
        const burger = document.querySelector('.js-burger');
        const navBlock = document.querySelector('.js-nav');
        burger.addEventListener('click', function (e) {
            burger.classList.toggle('--is-active');
            navBlock.classList.toggle('--is-active');
        });
    },

    init: function() {
        this.mobileMenuToggle();
        this.svgLoad();
    }
};

app.init();