import socketIo from 'socket.io';
import { Game, StartMessage, Message, FinishMessage, MoveMessage, Player, IdMessage } from './model';
import uuid from 'uuid/v4';

export class GameServer {
    public static readonly PORT: number = 8080;

    private io: SocketIO.Server;
    private port: string | number;
    private game: Game;

    constructor(game: Game) {
        this.game = game;
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

    private start(): void {
        this.game.start();
        var message = new StartMessage(this.game.getState(),
            this.game.getScore(),
            this.game.getCurrentPlayer());
        this.broadcast(message);
        console.log('Game started');
    }

    private broadcast(message: Message): void {
        this.io.emit('message', message);
    }

    private tryMove(state: string, value: number): void {
        if (!this.game.isValidState(state)) {
            return;
        }
        
        const movingPlayer = this.game.getCurrentPlayer();
        this.game.move(value);
        this.broadcastMove(movingPlayer, value);
        if (this.game.isOver()) {
            this.finish(movingPlayer);
        }
    }

    private broadcastMove(movingPlayer: Player, value: number) : void {
        const message = new MoveMessage(movingPlayer, this.game.getState(), value, this.game.getScore());
        this.broadcast(message);
        console.log('Moving');
    }

    private finish(winner: Player): void {
        const message = new FinishMessage(winner.id);
        this.broadcast(message);
        console.log('Game is over.');
    }

    private processMessage(message: any): void {
        switch (message.type) {
            case 'chat':
                this.broadcast({ ...message, sourceId: message.id });
                break;
            case 'move':
                this.tryMove(message.state, message.value);
                break;
            default:
                // drop invalid message
                break;
        }
    }

    private listen(): void {
        this.io.on('connect', (socket: SocketIO.Socket) => {
            if (this.game.isFull()) {
                socket.disconnect(true);
                console.log('Client attempted to connect to game.');
                return;
            }

            console.log('Client connected');

            const playerId = uuid();
            this.game.enterPlayer(playerId);
            socket.emit('message', new IdMessage(playerId), (_ackData: any) => {
                console.log(`Player identified. (${playerId})`);

                if (this.game.isFull()) {
                    this.start();
                }                
            });

            socket.on('message', (data: any) => {
                // TODO: validate message
                console.log('[server](message): %s', JSON.stringify(data));
                this.processMessage(data);
            });

            socket.on('disconnect', () => {
                console.log('Player disconnected');
            });
        });
    }
}