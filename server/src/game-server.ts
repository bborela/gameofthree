import socketIo from 'socket.io';
import { Game, StartMessage, Message, MoveMessage, Player, IdMessage, PlayerQuitMessage } from './model';
import uuid from 'uuid/v4';
import { Logger } from './logger';
import { CommandProcessor } from './command-processor';

export class GameServer {
    public static readonly PORT: number = 8080;

    private readonly game: Game;
    private readonly logger: Logger;
    private readonly processor: CommandProcessor;

    private io: SocketIO.Server;
    private port: string | number;

    constructor(game: Game, processor: CommandProcessor, logger: Logger) {
        this.game = game;
        this.logger = logger;
        this.processor = processor;
        this.attachCmdProcessor();
        this.configure();
        this.sockets();
        this.listen();
    }

    private processCommand(cmd: string, cmdValue?: string): void {
        switch (cmd) {
            case '/q':
            case '/quit':
                this.logger.log('Shutting down server...');
                process.exit(0);
                break;
            default:
                this.logger.log('Unknown command.');
                break;
        }
    }

    private attachCmdProcessor(): void {
        this.processor.on('cmd', (cmd, cmdValue) => { this.processCommand(cmd, cmdValue) });
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
            this.game.getCurrentPlayer().id);
        this.broadcast(message);
        this.logger.log('Game started');
    }

    private broadcast(message: Message): void {
        this.io.emit('message', message);
    }

    private isPlayerTurn(playerId: string): boolean {
        const playing = this.game.getCurrentPlayer();
        return playing.id == playerId;
    }

    private tryMove(playerId: string, state: string, value: number): boolean {
        if (!this.game.isFull()
            || this.game.isOver()
            || !this.isPlayerTurn(playerId)
            || !this.game.isValidState(state)) {
            return false;
        }

        const movingPlayer = this.game.getCurrentPlayer();
        this.game.move(value);
        this.broadcastMove(movingPlayer, value);

        if (this.game.isOver()) {
            this.logger.log('Game is over.');
            this.start();
        }

        return true;
    }

    private broadcastMove(movingPlayer: Player, value: number) : void {
        const message = new MoveMessage(movingPlayer.id,
            this.game.getState(),
            value,
            this.game.getScore(),
            this.game.isOver());
        this.broadcast(message);
        this.logger.log('Moving');
    }

    private processMessage(message: any, playerId: string): void {
        const payload = message.payload;
        switch (payload.type) {
            case 'chat':
                this.broadcast(message);
                break;
            case 'move':
                this.tryMove(playerId, payload.state, payload.value);
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
                this.logger.log('Client attempted to connect to game.');
                return;
            }

            this.logger.log('Client connected');

            const playerId = uuid();
            this.game.enterPlayer(playerId);
            socket.emit('message', new IdMessage(playerId), (_ackData: any) => {
                this.logger.log(`Player identified. (${playerId})`);

                if (this.game.isFull()) {
                    this.start();
                }                
            });

            socket.on('message', (data: any) => {
                // TODO: validate message
                this.logger.log('[server](message): %s', JSON.stringify({ playerId, ...data }));
                this.processMessage(data, playerId);
            });

            socket.on('disconnect', () => {
                this.game.removePlayer(playerId);
                this.logger.log('Player disconnected');
                this.broadcast(new PlayerQuitMessage());
            });
        });

        this.logger.log('Server listening on port %s', this.port);
    }
}