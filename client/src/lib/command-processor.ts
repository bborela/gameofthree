import { EventEmitter } from "events";
import readline from 'readline';

export abstract class CommandProcessor extends EventEmitter {
    private readline: readline.Interface;

    constructor() {
        super();
        this.read();
    }

    private read(): void {
        this.initReadline();
        this.prompt();
        this.readline.on('line', (input) => {
            const cmd = input.split(' ')[0];
            const cmdValue = input.substring(input.indexOf(' ') + 1);    
            this.processCommand(cmd, cmdValue);
            this.prompt();
        });
    }

    private prompt() {
        this.readline.setPrompt('');
        this.readline.prompt();
    }

    abstract processCommand(cmd: string, cmdValue: string): void;

    private initReadline(): void {
        this.readline = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
}