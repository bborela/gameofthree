export class StubStateGenerator {
    private index: number = 0;
    private states: Array<string>;

    constructor(states: Array<string> | string) {
        this.states = typeof states === 'string'
            ? [states]
            : states as Array<string>;
    }

    generate(): string {
        const state = this.states[this.index];
        this.index = ++this.index % this.states.length;
        return state;
    }
}