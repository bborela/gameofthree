import io from 'socket.io-client';
import { EventEmitter } from 'events';

export class ServerConnection extends EventEmitter {
    private url: string;
    private socket: SocketIOClient.Socket;

    constructor(url: string) {
        super();
        this.url = url;
        this.sockets();
        this.listen();
    }

    private sockets(): void {
        this.socket = io.connect(this.url);
    }
    
    private onReceiveMessage(receivedMessage: any) {
        this.emit('incoming', receivedMessage.payload);
    }

    public sendServerMessage(message: any): void {
        const envelope = { payload: message };
        this.socket.emit('message', envelope);
    }

    private listen(): void {
        this.socket.on('message', (message: any, ackFn: any) => {
            this.onReceiveMessage(message);
            if (ackFn) {
                ackFn('OK');
            }
        });

        this.socket.on('disconnect', () => {
            this.emit('disconnect');
        })
    }
}