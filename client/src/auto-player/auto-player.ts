import { EventEmitter } from "events";
import { AutoPlayerCalculator } from "./auto-player-calculator";

export class AutoPlayer extends EventEmitter {
    private static readonly AUTOPLAY_DELAY: number = 3000;

    private delay: string | number;
    private isAutoPlayOn: boolean = true;
    private delayedPlay: NodeJS.Timeout;

    constructor(delay: string) {
        super();
        this.configure(delay);
    }
    
    play(score: number): void {
        if (!this.isOn()) {
            return;
        }
        console.log(`Will delay by ${this.delay} ${new Date().toISOString()}`);
        this.delayedPlay = setTimeout(
            () => { this.emit('play', AutoPlayerCalculator.calculate(score)); console.log(new Date().toISOString()) },
            +this.delay);
    }

    switch() {
        this.isAutoPlayOn = !this.isAutoPlayOn;
        clearTimeout(this.delayedPlay);
    }

    isOn() {
        return this.isAutoPlayOn;
    }

    private configure(delay: string): void {
        this.delay = delay || AutoPlayer.AUTOPLAY_DELAY;
    }
}