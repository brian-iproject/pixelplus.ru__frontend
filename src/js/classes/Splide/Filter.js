import Splide from '@splidejs/splide';

export function SplideFilter( Splide, Components, options ) {
    function mount() {
        const filter = Splide.root.querySelector('.carousel__filter');

        if (!filter || !options.filter) return false;

        const slides = Components.Elements.slides;
        const allSlides = slides.slice();

        const categoryList = [];
        slides.forEach((item, index) => {
            item.dataset.splideCategory.split(', ').forEach(categoryName => {
                if (!categoryList.includes(categoryName)) {
                    categoryList.push(categoryName);
                }
            });
        });

        addButton(filter, 'Все', {
            click: () => {
                Splide.remove(Slide => Slide.index % 1 === 0);
                Splide.add(allSlides);
                Splide.refresh();
            }
        }, true);
        categoryList.forEach((categoryItem, index) => {
            addButton(filter, categoryItem, {
                click: () => {
                    const newSlides = allSlides.filter(item => item.dataset.splideCategory.includes(categoryItem));
                    Splide.remove(Slide => Slide.index % 1 === 0);
                    Splide.add(newSlides);
                    Splide.refresh();
                }
            });
        });
    }

    const addButton = (container, text, on, active) =>  {
        const button = document.createElement('button');

        if (options.filter.buttonClass && typeof options.filter.buttonClass == 'object') {
            options.filter.buttonClass.forEach(cssClass => button.classList.add(cssClass));
        } else {
            button.classList.add('tag');
        }

        button.innerText = text;
        if (on.click) {
            button.addEventListener('click', (e) => {
                on.click();
                container.querySelectorAll('button').forEach(item => item.classList.remove('-is-selected'));
                e.target.classList.add('-is-selected');
            });
        }

        if (active) {
            button.classList.add('-is-selected');
        }

        container.append(button);
    }

    return {
        mount,
    };
}