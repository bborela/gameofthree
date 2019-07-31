import { ServerConnection } from './server-connection';
import readline from 'readline';

export class TerminalGameClient {
    private readline: readline.Interface;
    private connection: ServerConnection;

    constructor(url: string) {
        this.connection = new ServerConnection(url, this.handleMessage);
        this.read();
    }

    private handleMessage(message: any) {
        console.log(message.payload);
    }

    private read(): void {
        this.initReadline();
        
        this.readline.on('line', (input) => {
            this.connection.sendServerMessage(input, (message: any) => {
                console.log(message.payload);
            });
        });
    }

    private initReadline(): void {
        this.readline = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
}