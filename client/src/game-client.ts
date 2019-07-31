import io from 'socket.io-client';
import readline from 'readline';
import uuid from 'uuid/v4';

export class GameClient {
    private url: string;
    private socket: SocketIOClient.Socket;
    private readline: readline.Interface;
    private pendingMessages: { [id: string]: any } = {};

    constructor(url: string) {
        this.url = url;
        this.sockets();
        this.listen();
        this.read();
    }

    private sockets(): void {
        this.socket = io.connect(this.url);
    }

    private listen(): void {
        this.socket.on('message', (message: any) => {
            this.onReceiveMessage(message);
        });
    }

    private onReceiveMessage(message: any) {
        const callback = this.pendingMessages[message.sourceId];
        delete this.pendingMessages[message.sourceId];
        callback(message);
    }

    private read(): void {
        this.initReadline();
        
        this.readline.on('line', (input) => {
            this.sendServerMessage(input, (message: any) => {
                console.log('[client](message): %s', message.payload);
            });
        });
    }

    private sendServerMessage(message: string, callback: any): void {
        const envelope = { id: uuid(), payload: message };
        this.pendingMessages[envelope.id] = callback;
        this.socket.emit('message', envelope);
    }

    private initReadline(): void {
        this.readline = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
}