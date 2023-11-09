import Splide from '@splidejs/splide';

export function SplideFilter( Splide, Components, options ) {
    function mount() {
        const filter = Splide.root.querySelector('.carousel__filter');

        if (!filter || !options.filter) return false;

        const slides = Components.Elements.slides;
        const allSlides = slides.slice();

        const categoryList = [];
        slides.forEach((item, index) => {
            if (!categoryList.includes(item.dataset.splideCategory)) {
                categoryList.push(item.dataset.splideCategory);
            }
        });

        addButton(filter, 'Все', {
            click: () => {
                Splide.remove(Slide => Slide.index % 1 === 0);
                Splide.add(allSlides);
                Splide.refresh();
            }
        });
        categoryList.forEach((categoryItem, index) => {
            addButton(filter, categoryItem, {
                click: () => {
                    const newSlides = allSlides.filter(item => item.dataset.splideCategory === categoryItem);
                    Splide.remove(Slide => Slide.index % 1 === 0);
                    Splide.add(newSlides);
                    Splide.refresh();
                }
            });
        });
    }

    const addButton = (container, text, on) =>  {
        const button = document.createElement('button');
        button.classList.add('tag');
        button.innerText = text;
        if (on.click) {
            button.addEventListener('click', (e) => {
                on.click();
                container.querySelectorAll('button').forEach(item => item.classList.remove('-is-selected'));
                e.target.classList.add('-is-selected');
            });
        }
        container.append(button);
    }

    return {
        mount,
    };
}