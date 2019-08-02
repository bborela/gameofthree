import { BaseGameClient } from './base-game-client';
import { ServerConnection } from './lib/server-connection';
import { CommandProcessor } from './lib/command-processor';
import { AutoPlayer } from './auto-player';
const messages = require('./messages.json');

export class TerminalGameClient extends BaseGameClient {
    private readonly processor: CommandProcessor;
    private readonly autoPlayer: AutoPlayer;

    constructor(connection: ServerConnection,
        processor: CommandProcessor,
        autoPlayer: AutoPlayer) {
        super(connection);
        
        this.processor = processor;
        this.autoPlayer = autoPlayer;

        this.printHeader();
        this.attachEvents();
    }

    onConnected(): void {
        console.log(messages.connected);
    }

    onDisconnect(): void {
        console.log(messages.serverDisconnected);
        process.exit(0);
    }

    onChat(message: any): void {
        console.log(`> ${message.value}`);
    }

    onMove(isMyMove: boolean, movedBy: number, result: number, isFinished: boolean): void {
        const mover = isMyMove ? messages.me : messages.opponent;
        const additionalMsg = !isFinished
            ? `${!isMyMove ? messages.me : messages.opponent} turn.`
            : `${isMyMove ? messages.win : messages.lose}\n`;
        console.log(`${mover} move: ${movedBy}. Result: ${result}. ${additionalMsg}`);

        if (!isFinished) {
            this.autoPlayer.play(result);
        }
    }

    onOpponentQuit(): void {
        console.log(messages.opponentQuit);
    }

    onStart(score: number, startingPlayerId: string): void {
        const isMyTurn = startingPlayerId == this.playerId;
        const turnMsg = isMyTurn ? messages.me : messages.opponent;
        console.log(`\n${messages.gameStarted}. Number: ${score}. ${turnMsg} turn.`);
        
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
            console.log(messages.switchAutoplay);
            return;
        }

        const parsedValue = this.parseMove(move);
        if (parsedValue != null)
            this.move(parsedValue);
    }

    private printHeader(): void {
        console.log(`${messages.programHeader}\n\n`);
    }

    private attachEvents(): void {
        this.processor.on('quit', () => { this.onQuit(); });
        this.processor.on('say', (text) => { this.onSay(text); });
        this.processor.on('play', (move) => { this.onPlay(move); });
        this.processor.on('unknownCmd', () => { console.log(messages.unknownCommand); })
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