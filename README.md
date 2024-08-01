# Вёрстка сайта pixelplus.ru

* [Установка](#установка)
* [Использование](#использование)
* [Используемые библиотеки](#используемые-библиотеки)
* [О сборке](#о-сборке)
* [Структура проекта](#структура-проекта)

## Установка

Установить NodeJS версии 16 и больше, затем выполнить команду:

```bash
npm install
```

## Использование

Собрать проект:

```bash
npm run build
```

Режим разработки:

(в первый раз всё равно нужно собрать проект, чтобы появились изображения)

```bash
npm run start
```

## Используемые библиотеки

* [normalize.css](https://necolas.github.io/normalize.css/)
* [Fancybox](https://fancyapps.com/fancybox/) - модалки и галереи
* [Swiper](https://swiperjs.com/swiper-api) - слайдеры (карусели)
* [Splide](https://splidejs.com/) - слайдеры (карусели)
* [Flickity](https://flickity.metafizzy.co/) - слайдеры (карусели)
* [Animate.css](https://animate.style/) - анимации
* [Anime.js](https://animejs.com/) - анимации
* [WOW.js](https://wowjs.uk/) - анимации
* [Autosize](https://www.jacklmoore.com/autosize/) - для textarea
* [Body scroll lock](https://github.com/willmcpo/body-scroll-lock)
* [Inputmask](https://github.com/RobinHerbots/Inputmask)
* [JS Cookie](https://github.com/js-cookie/js-cookie)
* [MoveTo](https://www.npmjs.com/package/moveto)

## О сборке

* Gulp 4
* Webpack
* Pug
* SCSS

## Структура проекта

* `src` - исходники
  * `src/assets` - Изображения, которые оптимизируются сборкой
  * `src/blocks` - БЭМ блоки, UI-kit проекта.
                   Каждый блок содержит `pug`-, `scss`-файлы и изображения.
                   Если нет изображения, то читай комментарий в `scss`-файле
  * `src/favicon`
  * `src/fonts`
  * `src/icons` - SVG спрайт
  * `src/images`
  * `src/js` - весь JS, инициализирующий файл - `src/js/main.js` (`appnew.init`)
  * `src/pug` - глобальные `pug`-файлы, в т.ч. страницы
  * `src/scss` - весь CSS
* `build` - собранный проект для бекендера

## Todo

* Добавить превью изображения для всех блоков
