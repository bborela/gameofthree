import { Player } from './player';
import { Utils } from '../lib/utils';
import { Randomizer } from '../lib/randomizer';
import { StateGenerator } from '../lib/state-generator';

export class Game {
    private static readonly LOWEST_NUMBER: number = 50;
    private static readonly HIGHEST_NUMBER : number = 100;
    private static readonly MAX_PLAYERS: number = 2;
    
    private randomizer: Randomizer;
    private stateGenerator: StateGenerator;
    private players: Player[] = [];
    private score: number;
    private state: string;
    private turn: number;

    constructor(randomizer: Randomizer, stateGenerator: StateGenerator) {
        this.randomizer = randomizer;
        this.stateGenerator = stateGenerator;
    }

    public start(): void {
        if (!this.isFull()) {
            throw new Error('Invalid operation: game does not have enough players.');
        }

        this.score = this.randomizer.random(Game.LOWEST_NUMBER, Game.HIGHEST_NUMBER);
        this.turn = this.randomizer.random(0, Game.MAX_PLAYERS - 1);
        this.updateState();
    }

    public move(moveBy: number, state: string): boolean {
        if (this.isOver()) {
            throw new Error('Invalid operation: game is over.');
        }

        if (!this.isFull()) {
            throw new Error('Invalid operation: game does not have enough players.');
        }

        // just discard move since move ordering is not guaranteed by the deliverer
        if (!this.isValidState(state)) {
            return false;
        }

        this.score += moveBy;
        this.score = Utils.toInt(this.score / 3);
        if (this.isOver()) {
            return true;
        }

        this.switchTurn();
        this.updateState();
        return true;
    }

    public removePlayer(id: string) {
        this.players = this.players.filter((item) => item.id != id);
    }

    public isFull(): boolean {
        return this.players.length == Game.MAX_PLAYERS;
    }

    public enterPlayer(id: string): void {
        if (this.isFull()) {
            throw new Error('Invalid operation: game is full.');
        }
        this.players.push(new Player(id));
    }

    public isOver(): boolean {
        return this.score <= 1;
    }

    public getCurrentPlayer(): Player {
        return this.players[this.turn];
    }

    public getState(): string {
        return this.state;
    }

    public getScore(): number {
        return this.score;
    }

    private isValidState(state: string): boolean {
        return this.state == state;
    }

    private switchTurn(): void {
        ++this.turn;
        this.turn %= this.players.length;
    }

    private updateState(): void {
        this.state = this.stateGenerator.generate();
    }
}