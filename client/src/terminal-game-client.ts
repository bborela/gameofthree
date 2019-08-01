import readline from 'readline';
import { BaseGameClient } from './base-game-client';

export class TerminalGameClient extends BaseGameClient {
    private readline: readline.Interface;

    constructor(url: string) {
        super(url);
        this.read();
    }

    onChat(message: any): void {
    }
    onError(errorMessage: string): void {
    }
    onOpponentMove(movedBy: number, result: number): void {
    }
    onFinish(haveIWon: boolean): void {
    }
    onOpponentQuit(): void {
    }
    onStart(score: number, turn: number): void {
        const turnMsg = turn == this.player.position ? 'Your' : 'Opponent\'s';
        console.log(`Game started. Number: ${score}. Player ${turnMsg}'s turn.`);
    }    

    private read(): void {
        this.initReadline();
        
        this.readline.on('line', (input) => {
            this.processCommand(input);
        });
    }

    private processCommand(input: string): void {
        const cmd = input.split(' ')[0];
        const cmdValue = input.substring(input.indexOf(' ') + 1);
        switch (cmd) {
            case '/quit':
                process.exit(0);
                break;
            case '/say':
                this.say(cmdValue);
                break;
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

    private initReadline(): void {
        this.readline = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
}