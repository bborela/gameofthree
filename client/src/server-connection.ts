import io from 'socket.io-client';
import uuid from 'uuid/v4';

type MessageHandler = (message: any) => void;

export class ServerConnection {
    private url: string;
    private socket: SocketIOClient.Socket;
    private pendingMessages: { [id: string]: Function } = {};
    private onUnsourcedMessage: MessageHandler;

    constructor(url: string,
        onUnsourcedMessage: MessageHandler) {
        this.url = url;
        this.onUnsourcedMessage = onUnsourcedMessage;
        this.sockets();
        this.listen();
    }

    private sockets(): void {
        this.socket = io.connect(this.url);
    }
    
    private onReceiveMessage(message: any) {
        if (!message.sourceId || !(message.sourceId in this.pendingMessages)) {
            return this.onUnsourcedMessage(message);
        }

        const callback = this.pendingMessages[message.sourceId];
        delete this.pendingMessages[message.sourceId];
        callback(message);
    }

    public sendServerMessage(message: string, callback: MessageHandler): void {
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