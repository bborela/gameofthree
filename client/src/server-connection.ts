import io from 'socket.io-client';
import uuid from 'uuid/v4';

export class ServerConnection {
    private url: string;
    private socket: SocketIOClient.Socket;
    private pendingMessages: { [id: string]: any } = {};

    constructor(url: string) {
        this.url = url;
        this.sockets();
        this.listen();
    }

    private sockets(): void {
        this.socket = io.connect(this.url);
    }
    
    private onReceiveMessage(message: any) {
        const callback = this.pendingMessages[message.sourceId];
        delete this.pendingMessages[message.sourceId];
        callback(message);
    }

    public sendServerMessage(message: string, callback: any): void {
        const envelope = { id: uuid(), payload: message };
        this.pendingMessages[envelope.id] = callback;
        this.socket.emit('message', envelope);
    }

    private listen(): void {
        this.socket.on('message', (message: any) => {
            this.onReceiveMessage(message);
        });
    }
}