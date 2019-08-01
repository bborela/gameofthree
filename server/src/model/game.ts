import uuid from 'uuid/v4';
import { Player } from './player';
import { Utils } from '../utils';
import { Randomizer } from '../randomizer';

export class Game {
    private lowestNumber: number = 50;
    private highestNumber: number = 100;

    private randomizer: Randomizer;
    private players: Player[] = [];
    private score: number;
    private state: string;
    private turn: number;

    constructor(randomizer: Randomizer) {
        this.randomizer = randomizer;
    }

    public start(): void {
        this.score = this.randomizer.random(this.lowestNumber, this.highestNumber);
        this.turn = this.randomizer.random(0, 1);
        this.updateState();
    }

    public move(moveBy: number): number {
        if (this.isOver()) {
            throw new Error('Game is over.');
        }

        this.score += moveBy;
        this.score = Utils.toInt(this.score / 3);
        if (this.isOver()) {
            return this.score;
        }

        this.switchTurn();
        this.updateState();
        return this.score;
    }

    public isFull(): boolean {
        return this.players.length == 2;
    }

    public enterPlayer(id: string): void {
        if (this.isFull()) return;
        this.players.push(new Player(id, this.players.length + 1));
    }

    public isOver(): boolean {
        return this.score == 1;
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

    public isValidState(state: string): boolean {
        return this.state == state;
    }

    private switchTurn(): void {
        this.turn = ~this.turn;
    }

    private updateState(): void {
        this.state = uuid();
    }    
}