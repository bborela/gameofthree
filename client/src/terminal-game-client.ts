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
        this.processor.on('cmd', (cmd, cmdValue) => { this.processCommand(cmd, cmdValue) });
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

    private processCommand(cmd: string, cmdValue: string): void {
        switch (cmd) {
            case '/q':
            case '/quit':
                process.exit(0);
                break;
            case '/s':
            case '/say':
                this.say(cmdValue);
                break;
            case '/p':
            case '/play':
                if (this.isValidMove(cmdValue)) {
                    return this.move(+cmdValue);
                }
                console.log('Invalid move.');
                break;
            default:
                console.log('Unknown command.');
                break;
        }
    }

    private isValidMove(input: string): boolean {
        const value = +input;
        return value == -1 || value == 0 || value == 1;
    }
}