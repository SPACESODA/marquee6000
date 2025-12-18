/**
 * marquee6k
 * http://github.com/SPACESODA/marquee6k
 * MIT License
 */

'use strict';

interface MarqueeOptions {
    selector: string;
}

// Augment window to include MARQUEES
declare global {
    interface Window {
        MARQUEES: marquee6k[];
    }
}

let MARQUEES: marquee6k[] = [];
let animationId: number = 0;

class marquee6k {
    element: HTMLElement;
    selector: string;
    speed: number;
    pausable: boolean;
    reverse: boolean;
    paused: boolean;
    parent: HTMLElement;
    parentProps: DOMRect;
    content: HTMLElement;
    innerContent: string;
    wrapStyles: string;
    offset: number;
    wrapper!: HTMLElement;
    contentWidth!: number;
    requiredReps!: number;

    constructor(element: HTMLElement, options: MarqueeOptions) {
        if (element.children.length === 0) {
            throw new Error('Encountered a marquee element without children, please supply a wrapper for your content');
        }

        this.element = element;
        this.selector = options.selector;
        this.speed = parseFloat(element.dataset.speed || '0.25');
        this.pausable = element.dataset.pausable === 'true';
        this.reverse = element.dataset.reverse === 'true';
        this.paused = false;
        this.parent = element.parentElement as HTMLElement;
        this.parentProps = this.parent.getBoundingClientRect();
        this.content = element.children[0] as HTMLElement;
        this.innerContent = this.content.innerHTML;
        this.wrapStyles = '';
        this.offset = 0;

        this._setupWrapper();
        this._setupContent();
        this._setupEvents();

        this.wrapper.appendChild(this.content);
        this.element.appendChild(this.wrapper);
    }

    _setupWrapper() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('marquee6k__wrapper');
        this.wrapper.style.whiteSpace = 'nowrap';
    }

    _setupContent() {
        this.content.classList.add(`${this.selector}__copy`);
        this.content.style.display = 'inline-block';
        this.contentWidth = this.content.offsetWidth;

        this.requiredReps = this.contentWidth > this.parentProps.width ? 2 : Math.ceil((this.parentProps.width - this.contentWidth) / this.contentWidth) + 1;

        for (let i = 0; i < this.requiredReps; i++) {
            this._createClone();
        }

        if (this.reverse) {
            this.offset = this.contentWidth * -1;
        }

        this.element.classList.add('is-init');
    }

    _setupEvents() {
        this.element.addEventListener('mouseenter', () => {
            if (this.pausable) this.paused = true;
        });

        this.element.addEventListener('mouseleave', () => {
            if (this.pausable) this.paused = false;
        });
    }

    _createClone() {
        const clone = this.content.cloneNode(true) as HTMLElement;
        clone.style.display = 'inline-block';
        clone.classList.add(`${this.selector}__copy`);
        this.wrapper.appendChild(clone);
    }

    animate() {
        if (!this.paused) {
            const isScrolled = this.reverse ? this.offset < 0 : this.offset > this.contentWidth * -1;
            const direction = this.reverse ? -1 : 1;
            const reset = this.reverse ? this.contentWidth * -1 : 0;

            if (isScrolled) this.offset -= this.speed * direction;
            else this.offset = reset;

            this.wrapper.style.whiteSpace = 'nowrap';
            this.wrapper.style.transform = `translate(${this.offset}px, 0) translateZ(0)`;
        }
    }

    _refresh() {
        this.contentWidth = this.content.offsetWidth;
    }

    repopulate(difference: number, isLarger: boolean) {
        this.contentWidth = this.content.offsetWidth;

        if (isLarger) {
            const amount = Math.ceil(difference / this.contentWidth) + 1;

            for (let i = 0; i < amount; i++) {
                this._createClone();
            }
        }
    }

    static refresh(index: number) {
        MARQUEES[index]._refresh();
    }

    static pause(index: number) {
        MARQUEES[index].paused = true;
    }

    static play(index: number) {
        MARQUEES[index].paused = false;
    }

    static toggle(index: number) {
        MARQUEES[index].paused = !MARQUEES[index].paused;
    }

    static refreshAll() {
        for (let i = 0; i < MARQUEES.length; i++) {
            MARQUEES[i]._refresh();
        }
    }

    static pauseAll() {
        for (let i = 0; i < MARQUEES.length; i++) {
            MARQUEES[i].paused = true;
        }
    }

    static playAll() {
        for (let i = 0; i < MARQUEES.length; i++) {
            MARQUEES[i].paused = false;
        }
    }

    static toggleAll() {
        for (let i = 0; i < MARQUEES.length; i++) {
            MARQUEES[i].paused = !MARQUEES[i].paused;
        }
    }

    static init(options: MarqueeOptions = { selector: 'marquee6k' }) {
        if (animationId) window.cancelAnimationFrame(animationId);

        MARQUEES = [];
        window.MARQUEES = MARQUEES;
        const marquees = Array.from(document.querySelectorAll(`.${options.selector}`)) as HTMLElement[];
        let previousWidth = window.innerWidth;
        let timer: number | undefined;

        for (let i = 0; i < marquees.length; i++) {
            const marquee = marquees[i];
            const instance = new marquee6k(marquee, options);
            MARQUEES.push(instance);
        }

        animate();

        function animate() {
            for (let i = 0; i < MARQUEES.length; i++) {
                MARQUEES[i].animate();
            }

            animationId = window.requestAnimationFrame(animate);
        }

        window.addEventListener('resize', () => {
            clearTimeout(timer);

            timer = window.setTimeout(() => {
                const isLarger = previousWidth < window.innerWidth;
                const difference = window.innerWidth - previousWidth;

                for (let i = 0; i < MARQUEES.length; i++) {
                    MARQUEES[i].repopulate(difference, isLarger);
                }

                previousWidth = window.innerWidth;
            }, 250);
        });
    }
}

export default marquee6k;
