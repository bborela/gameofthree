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
            this.emit('cmd', cmd, cmdValue);
        });
    }

    private initReadline(): void {
        this.readline = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
}