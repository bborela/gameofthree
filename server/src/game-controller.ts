import { EventEmitter } from "events";
import { Game } from "./model";

export class GameController extends EventEmitter {
    private readonly game: Game;
    constructor(game: Game) {
        super();
        this.game = game;
    }

    public removePlayer(playerId: string): void {
        this.game.removePlayer(playerId);
    }

    public enterPlayer(playerId: string): void {
        this.game.enterPlayer(playerId);
    }

    public isFull(): boolean {
        return this.game.isFull();
    }

    public tryStart(): boolean {
        if (this.game.isFull()) {
            return false;
        }

        this.game.start();
        this.emit('start', {
            state: this.game.getState(),
            score: this.game.getScore(),
            startingPlayerId: this.game.getCurrentPlayer().id
        });

        return true;
    }

    public tryMove(playerId: string, state: string, value: number): boolean {
        if (!this.game.isFull()
            || this.game.isOver()
            || !this.isPlayerTurn(playerId)
            || !this.game.isValidState(state)) {
            return false;
        }

        const movingPlayer = this.game.getCurrentPlayer();
        this.game.move(value);
        this.emit('move', {
            movingPlayer,
            value,
            state: this.game.getState(),
            score: this.game.getScore(),
            isFinished: this.game.isOver()
        });

        if (this.game.isOver()) {
            this.emit('gameOver');
        }

        return true;
    }

    private isPlayerTurn(playerId: string): boolean {
        const playing = this.game.getCurrentPlayer();
        return playing.id == playerId;
    }
}