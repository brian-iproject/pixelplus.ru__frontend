# pixelplus.ru — Frontend

Фронтенд корпоративного сайта digital-агентства PixelPlus.

- [Установка и запуск](#установка-и-запуск)
- [Стек технологий](#стек-технологий)
- [Структура проекта](#структура-проекта)
- [Страницы](#страницы)
- [Архитектура блоков](#архитектура-блоков)
- [JavaScript-модули](#javascript-модули)
- [Процесс сборки](#процесс-сборки)

---

## Установка и запуск

Требуется Node.js версии 16+.

```bash
npm install
```

```bash
npm start       # dev-режим: компиляция + watch + BrowserSync
npm run build   # production-сборка в папку build/
```

> В первый раз перед запуском dev-режима нужно выполнить `npm run build`, чтобы скопировались изображения.

---

## Стек технологий

| Слой | Инструмент |
|---|---|
| Сборщик | Gulp 4 |
| Бандлер JS | Webpack 5 |
| Транспайлер | Babel 7 (`@babel/preset-env`) |
| Шаблонизатор | Pug |
| Стили | SCSS (Dart Sass) + Autoprefixer + group-css-media-queries |
| Линтер стилей | Stylelint + stylelint-scss + rational-order |
| Dev-сервер | BrowserSync |
| Оптимизация изображений | Imagemin |

### Библиотеки

- **Слайдеры:** Splide, Swiper, Flickity
- **Галереи / модалки:** FancyBox 4
- **Анимации:** Anime.js, WOW.js, Animate.css
- **Формы:** Choices.js, nouislider, Inputmask, Intl Tel Input, Autosize
- **Прочее:** Tippy.js, Body Scroll Lock, MoveTo, JS Cookie, Normalize.css
- **Графики:** AmCharts
- **Экспорт PDF:** PDFmake, html2canvas

---

## Структура проекта

```
pixelplus.ru__frontend/
├── src/
│   ├── assets/          # Сторонние библиотеки (AmCharts, PDFmake, html2canvas)
│   ├── blocks/          # BEM-блоки (~130 компонентов)
│   ├── favicon/
│   ├── fonts/
│   ├── icons/           # SVG-спрайт
│   ├── images/
│   ├── js/
│   │   ├── classes/     # ES6-классы (~30 модулей)
│   │   ├── main.js      # Точка входа
│   │   └── tariffs.json # Данные тарифов
│   ├── pug/
│   │   ├── layout.pug   # Основной лейаут
│   │   ├── variables.pug
│   │   ├── mixins.pug
│   │   ├── mixins/      # Вспомогательные миксины (burger, tooltip, menu-multilevel)
│   │   └── pages/       # Страницы (14 шт. + 2 AJAX)
│   └── scss/
│       ├── styles.scss         # Точка входа
│       ├── libs.scss           # Стили сторонних библиотек
│       ├── _css-variables.scss # CSS-переменные / дизайн-токены
│       ├── _variables.scss
│       ├── _mixins.scss
│       ├── _fonts.scss
│       ├── _modifiers.scss
│       └── mixins/             # SCSS-миксины (burger, form, icon)
├── build/               # Скомпилированный результат для бэкендера
├── gulpfile.js
├── babel.config.json
├── .stylelintrc.json
└── package.json
```

---

## Страницы

| Файл | Страница |
|---|---|
| `index.pug` | Главная |
| `portfolio.pug` | Портфолио |
| `tariffs.pug` | Тарифы |
| `news.pug` | Новости |
| `reviews.pug` | Отзывы |
| `team.pug` | Команда |
| `infographics.pug` | Инфографика |
| `images.pug` | Галерея изображений |
| `tables.pug` | Таблицы |
| `blocks.pug` | Демо компонентов |
| `ui-kit.pug` | UI-kit |
| `empty.pug` | Пустой шаблон |
| `ajax/order-online.pug` | Форма заказа (AJAX) |
| `ajax/order-succes.pug` | Страница успешного заказа (AJAX) |

---

## Архитектура блоков

Каждый блок живёт в `src/blocks/<name>/` и может содержать:

```
block-name/
├── index.pug      # Pug-шаблон
├── style.scss     # Стили блока
├── script.js      # JS (опционально)
├── images/        # Изображения блока (опционально)
└── preview.jpg    # Превью (опционально)
```

Стили блоков подключаются индивидуально через `styles.scss`.

---

## JavaScript-модули

Все классы находятся в `src/js/classes/` и инициализируются в `src/js/main.js`.

| Класс | Назначение |
|---|---|
| `Utils.js` | Вспомогательные функции |
| `LoadScripts.js` | Динамическая подгрузка скриптов |
| `AcceptCookie.js` | Баннер согласия с cookie |
| `AnimateNumber.js` | Анимация числовых значений |
| `DetailsSpoiler.js` | Аккордеон / раскрывающийся блок |
| `Tabs.js` | Табы |
| `Toggle.js` / `ToggleBlock.js` | Переключатели |
| `MovingPlaceholder.js` | Анимированный плейсхолдер |
| `FieldFile.js` | Кастомная загрузка файлов |
| `FieldRange.js` | Слайдер диапазона (nouislider) |
| `MultiSelectCheckbox.js` | Мультивыбор чекбоксами |
| `Calculator.js` | Калькулятор |
| `HiddenCaptcha.js` | Антиспам |
| `FlickitySet.js` | Карусели на Flickity |
| `Splide/Filter.js` | Splide с фильтрацией |
| `Splide/Like.js` | Splide с лайками |
| `StoriesVideo.js` | Stories-карусель с видео |
| `VideoLoad.js` | Ленивая загрузка видео |
| `VideoService.js` | Работа с YouTube и другими сервисами |
| `SvgLoad.js` | Загрузка SVG-спрайта |
| `Quiz.js` | Квиз / опрос |
| `TrafficForecast.js` | График прогноза трафика (AmCharts) |
| `SimpleDiagram.js` | Простая диаграмма |
| `Like.js` | Лайки |
| `LockedButton.js` | Заблокированная кнопка |
| `MobileMenu.js` | Мобильное меню |
| `TimerModal.js` | Модалка с таймером |
| `CallToAction.js` | Кнопки CTA |
| `Tariffs.js` | Отображение тарифов из `tariffs.json` |

---

## Процесс сборки

```
SCSS  →  autoprefixer  →  group-media-queries  →  minify  →  build/css/
Pug   →  HTML                                              →  build/
JS    →  Webpack + Babel  →  bundle.js                     →  build/js/
libs  →  concat           →  libs.js                       →  build/js/
img / fonts / favicon / assets  →  copy                   →  build/
```

В production (`npm run build`) CSS и JS минифицируются, изображения оптимизируются.
