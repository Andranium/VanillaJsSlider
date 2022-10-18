class Slider {
    constructor(sliderWrapper) {
        this.sliderWrapper = sliderWrapper;

        this.position = 0;
        this.containerWidth = 0;
        this.elementWidth = 0;
        this.elementsCount = 0;
        this.margin = 16;

        this.intervalDelay = 10000;
        this.transitionDuration = '0.4s';

        this.readyToScroll = true;

        this.viewportMax = 990;
    }

    calculateSizes() {
        const { children } = this.sliderWrapper;

        const [element] = children;

        this.elementWidth = element.offsetWidth;

        this.elementsCount = children.length;

        this.containerWidth = this.elementsCount * (this.elementWidth + this.margin) - this.margin

        this.sliderWrapper.style.width = this.containerWidth + 'px';
    }

    move(direction) {
        const { innerWidth } = window;

        if(!this.readyToScroll || (innerWidth >= this.viewportMax && this.elementsCount <= 3) ) return;

        const moveTo = direction === 'next' ? -1 : 1;
        const scrollX = (this.elementWidth + this.margin) * moveTo;

        this.readyToScroll = false;

        this.position = direction === 'next' ? scrollX + this.position : 0;

        this.sliderWrapper.style.transitionDuration = this.transitionDuration;
        this.sliderWrapper.style.transform = `translateX(${this.position}px)`;

        const appender = () => {
            this.appender(direction);
            this.sliderWrapper.removeEventListener('transitionend', appender);
            this.readyToScroll = true;
        }

        this.sliderWrapper.addEventListener('transitionend', appender, { once: true });
    }

    resizer() {
        this.calculateSizes();

        this.position = innerWidth >= this.viewportMax && this.elementsCount <= 3 ? 0 : (this.elementWidth + this.margin) * -1;

        this.sliderWrapper.style.transform = `translateX(${this.position}px)`;
    }

    appender(direction, init = false) {
        const { children } = this.sliderWrapper;
        const { innerWidth } = window;

        if(innerWidth >= this.viewportMax && this.elementsCount <= 3) return;

        const [firstChild] = children;
        const lastChild = children[children.length - 1];

        this.position = -(this.elementWidth + this.margin);

        if(direction === 'next') {
            this.sliderWrapper.append(firstChild);
        } else {
            this.sliderWrapper.prepend(lastChild);
        }

        this.sliderWrapper.style.transitionDuration = '0s';
        this.sliderWrapper.style.transform = `translateX(${this.position}px)`;
    }

    clone() {
        const { children } = this.sliderWrapper;

        if(children.length >= 5) return;

        let count = 0;
        const DEFAULT_COUNT = 5;
        const cloneCount = children.length === 1 ? DEFAULT_COUNT : (children.length * 2) - 1;

        for(let i = 0; i <= cloneCount; i++) {
            let child = children[count];

            if(!child) {
                count = 0;


                child = children[count];
            }

            count++;

            const node = child.cloneNode(child);

            this.sliderWrapper.append(node);
        }
    }

    static init() {
        const sliderElement = document.querySelector('.slider');
        const wrapper = sliderElement.querySelector('.slider__wrapper');

        const next = sliderElement.querySelector('.slider__control--next');
        const previous = sliderElement.querySelector('.slider__control--previous');

        const slider = new Slider(wrapper);

        slider.clone();

        slider.calculateSizes();

        slider.appender('previous', true);

        next.addEventListener('click', slider.move.bind(slider, 'next'));
        previous.addEventListener('click', slider.move.bind(slider, 'previous'));

        setInterval(slider.move.bind(slider, 'next'), slider.intervalDelay);

        window.addEventListener('resize', slider.resizer.bind(slider));
    }
}

Slider.init();

