import io from 'socket.io-client';
import uuid from 'uuid/v4';
import { Message, ReceivedMessage } from './model';

type MessageHandler = (message: Message) => void;

export class ServerConnection {
    private url: string;
    private socket: SocketIOClient.Socket;
    private pendingMessages: { [id: string]: MessageHandler } = {};
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
    
    private onReceiveMessage(receivedMessage: ReceivedMessage) {
        if (!receivedMessage.sourceId || !(receivedMessage.sourceId in this.pendingMessages)) {
            return this.onUnsourcedMessage(receivedMessage.payload);
        }

        const callback = this.pendingMessages[receivedMessage.sourceId];
        delete this.pendingMessages[receivedMessage.sourceId];
        callback(receivedMessage.payload);
    }

    public sendServerMessage(message: Message, callback: MessageHandler): void {
        const envelope = { id: uuid(), payload: message };
        this.pendingMessages[envelope.id] = callback;
        this.socket.emit('message', envelope);
    }

    private listen(): void {
        this.socket.on('message', (message: ReceivedMessage) => {
            this.onReceiveMessage(message);
        });
    }
}