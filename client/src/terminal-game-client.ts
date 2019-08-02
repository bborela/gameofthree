import { BaseGameClient } from './base-game-client';
import { ServerConnection } from './server-connection';
import { CommandProcessor } from './command-processor';

export class TerminalGameClient extends BaseGameClient {
    private readonly myLabel: string = 'Your';
    private readonly opponentLabel: string = 'Opponent\'s';

    private readonly processor: CommandProcessor;

    constructor(connection: ServerConnection, processor: CommandProcessor) {
        super(connection);
        this.processor = processor;
        this.attachEvents();
    }

    onDisconnect(): void {
        console.log('Server disconnected');
        process.exit(0);
    }

    onChat(message: any): void {
        console.log(`> ${message.value}`);
    }

    onError(errorMessage: string): void {
        console.log(`Unexpected server error: ${errorMessage}`);
    }

    onMove(isMyMove: boolean, movedBy: number, result: number, isFinished: boolean): void {
        const mover = isMyMove ? this.myLabel : this.opponentLabel;
        const additionalMsg = !isFinished
            ? `${!isMyMove ? this.myLabel : this.opponentLabel} turn`
            : isMyMove
                ? 'You win!'
                : 'You lose!';
        console.log(`${mover} move: ${movedBy}. Result: ${result}. ${additionalMsg}`);
    }

    onFinish(haveIWon: boolean): void {
        if (haveIWon) {
            return console.log('You win!');
        }
        console.log('You lose!');
    }

    onOpponentQuit(): void {
        console.log('Your opponent gave up. Waiting for another player.');
    }

    onStart(score: number, startingPlayerId: string): void {
        const turnMsg = startingPlayerId == this.playerId ? this.myLabel : this.opponentLabel;
        console.log(`Game started. Number: ${score}. ${turnMsg} turn.`);
    }

    onQuit() {
        process.exit(0);
    }

    onSay(text: string) {
        this.say(text);
    }

    onPlay(move: string) {
        if (this.isValidMove(move)) {
            return this.move(+move);
        }
    }
    
    private attachEvents() {
        this.processor.on('quit', () => { this.onQuit(); });
        this.processor.on('say', (text) => { this.onSay(text); });
        this.processor.on('play', (move) => { this.onPlay(move); });
        this.processor.on('unknownCmd', () => { console.log('Unknown command.'); })        
    }

    private isValidMove(input: string): boolean {
        const value = +input;
        return value == -1 || value == 0 || value == 1;
    }
}