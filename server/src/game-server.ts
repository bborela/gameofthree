import socketIo from 'socket.io';

export class GameServer {
    public static readonly PORT : number = 8080;
    
    private io : SocketIO.Server;
    private port: string | number;

    constructor() {
        this.configure();
        this.sockets();
        this.listen();
    }

    private configure() : void {
        this.port = process.env.PORT || GameServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.port);
    }

    private listen(): void {
        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this.port);
            socket.on('message', (m: string) => {
                console.log('[server](message): %s', m);
                this.io.emit('message', m);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }
}