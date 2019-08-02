import { BaseGameClient } from './base-game-client';
import { ServerConnection } from './server-connection';
import { CommandProcessor } from './command-processor';
import { AutoPlayer } from './auto-player';

export class TerminalGameClient extends BaseGameClient {
    private readonly myLabel: string = 'Your';
    private readonly opponentLabel: string = 'Opponent\'s';

    private readonly processor: CommandProcessor;
    private readonly autoPlayer: AutoPlayer;

    constructor(connection: ServerConnection,
        processor: CommandProcessor,
        autoPlayer: AutoPlayer) {
        super(connection);
        this.processor = processor;
        this.autoPlayer = autoPlayer;
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
            ? `${!isMyMove ? this.myLabel : this.opponentLabel} turn.`
            : isMyMove
                ? 'You win!'
                : 'You lose!';
        console.log(`${mover} move: ${movedBy}. Result: ${result}. ${additionalMsg}`);

        if (!isFinished) {
            this.autoPlayer.play(result);
        }
    }

    onOpponentQuit(): void {
        console.log('Your opponent gave up. Waiting for another player.');
    }

    onStart(score: number, startingPlayerId: string): void {
        const isMyTurn = startingPlayerId == this.playerId;
        const turnMsg = isMyTurn ? this.myLabel : this.opponentLabel;
        console.log(`Game started. Number: ${score}. ${turnMsg} turn.`);
        
        this.autoPlayer.play(score);
    }

    onQuit(): void {
        process.exit(0);
    }

    onSay(text: string): void {
        this.say(text);
    }

    onPlay(move: string): void {
        if (this.autoPlayer.isOn()) {
            console.log('Auto-play is on. Please switch it off to play.');
            return;
        }

        const parsedValue = this.parseMove(move);
        if (parsedValue != null)
            this.move(parsedValue);
    }

    private attachEvents(): void {
        this.processor.on('quit', () => { this.onQuit(); });
        this.processor.on('say', (text) => { this.onSay(text); });
        this.processor.on('play', (move) => { this.onPlay(move); });
        this.processor.on('unknownCmd', () => { console.log('Unknown command.'); })
        this.processor.on('auto', () => { this.autoPlayer.switch(); });

        this.autoPlayer.on('play', (value) => { this.move(value); })
    }

    private parseMove(input: string): number {
        return input == '-'
            ? -1
            : input == '0'
                ? 0
                : input == '+'
                    ? 1
                    : null;
    }
}