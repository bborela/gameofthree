import io from 'socket.io-client';
import uuid from 'uuid/v4';

type MessageHandler = (message: any) => void;

export class ServerConnection {
    private url: string;
    private socket: SocketIOClient.Socket;
    private pendingMessages: { [id: string]: MessageHandler } = {};
    private onIncomingMessage: MessageHandler;

    constructor(url: string,
        onIncomingMessage: MessageHandler) {
        this.url = url;
        this.onIncomingMessage = onIncomingMessage;
        this.sockets();
        this.listen();
    }

    private sockets(): void {
        this.socket = io.connect(this.url);
    }
    
    private onReceiveMessage(receivedMessage: any) {
        if (!receivedMessage.sourceId || !(receivedMessage.sourceId in this.pendingMessages)) {
            return this.onIncomingMessage(receivedMessage.payload);
        }

        const callback = this.pendingMessages[receivedMessage.sourceId];
        delete this.pendingMessages[receivedMessage.sourceId];
        callback(receivedMessage.payload);
    }

    public sendServerMessage(message: any, callback: MessageHandler = () => {}): void {
        const envelope = { id: uuid(), payload: message };
        this.pendingMessages[envelope.id] = callback;
        this.socket.emit('message', envelope);
    }

    private listen(): void {
        this.socket.on('message', (message: any, ackFn: any) => {
            this.onReceiveMessage(message);
            if (ackFn) {
                ackFn('OK');
            }
        });
    }
}