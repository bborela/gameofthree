import { ServerConnection } from './server-connection';
import readline from 'readline';
import { Message } from './model';

export class TerminalGameClient {
    private readline: readline.Interface;
    private connection: ServerConnection;

    constructor(url: string) {
        this.connection = new ServerConnection(url, this.handleMessage);
        this.read();
    }

    private handleMessage(message: any) {
        console.log(message.value);
    }

    private read(): void {
        this.initReadline();
        
        this.readline.on('line', (input) => {
            this.processCommand(input);
        });
    }

    private processCommand(input: string) {
        const cmd = input.split(' ')[0];
        switch (cmd) {
            case '/quit':
                process.exit(0);
                break;
            case '/say':
                const msg = { type: 'chat', value: input.substring(input.indexOf(' ') + 1) };
                this.connection.sendServerMessage(msg, (message: Message) => {
                    console.log(message.value);
                });
                break;
            default:
                console.log('Unknown command.');
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