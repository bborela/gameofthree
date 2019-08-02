import { EventEmitter } from "events";
import readline from 'readline';

export class CommandProcessor extends EventEmitter {
    private readline: readline.Interface;

    constructor() {
        super();
        this.read();
    }

    private read(): void {
        this.initReadline();
        this.readline.on('line', (input) => {
            const cmd = input.split(' ')[0];
            const cmdValue = input.substring(input.indexOf(' ') + 1);    
            this.processCommand(cmd, cmdValue);
        });
    }

    private processCommand(cmd: string, cmdValue: string): void {
        switch (cmd) {
            case '/q':
            case '/quit':
                this.emit('quit');
                break;
            case '/s':
            case '/say':
                this.emit('say', cmdValue);
                break;
            case '/p':
            case '/play':
                this.emit('play', cmdValue);
                break;
            default:
                this.emit('unknownCmd', cmdValue);
                break;
        }
    }

    private initReadline(): void {
        this.readline = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
}