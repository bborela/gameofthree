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

        const fire = () => this.emit('play', AutoPlayerCalculator.calculate(score));
        if (this.delay) {
            this.delayedPlay = setTimeout(fire, +this.delay);
            return;
        }
        fire();
    }

    switch() {
        this.isAutoPlayOn = !this.isAutoPlayOn;
        clearTimeout(this.delayedPlay);
    }

    isOn() {
        return this.isAutoPlayOn;
    }

    private configure(delay: string): void {
        this.delay = delay != null ? delay : AutoPlayer.AUTOPLAY_DELAY;
    }
}