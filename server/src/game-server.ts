import socketIo from 'socket.io';

export class GameServer {
    public static readonly PORT: number = 8080;
    
    private io: SocketIO.Server;
    private port: string | number;

    constructor() {
        this.configure();
        this.sockets();
        this.listen();
    }

    private configure(): void {
        this.port = process.env.PORT || GameServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.port);
    }

    private listen(): void {
        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this.port);
            socket.on('message', (message: any) => {
                console.log('[server](message): %s', message.payload);
                this.io.emit('message', { sourceId: message.id, ...message });
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }
}