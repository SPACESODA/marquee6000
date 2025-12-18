/**
 * marquee6k
 * http://github.com/SPACESODA/marquee6k
 * MIT License
 */
interface MarqueeOptions {
    selector: string;
}
declare global {
    interface Window {
        MARQUEES: marquee6k[];
    }
}
declare class marquee6k {
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
    wrapper: HTMLElement;
    contentWidth: number;
    requiredReps: number;
    constructor(element: HTMLElement, options: MarqueeOptions);
    _setupWrapper(): void;
    _setupContent(): void;
    _setupEvents(): void;
    _createClone(): void;
    animate(): void;
    _refresh(): void;
    repopulate(difference: number, isLarger: boolean): void;
    static refresh(index: number): void;
    static pause(index: number): void;
    static play(index: number): void;
    static toggle(index: number): void;
    static refreshAll(): void;
    static pauseAll(): void;
    static playAll(): void;
    static toggleAll(): void;
    static init(options?: MarqueeOptions): void;
}
export default marquee6k;
