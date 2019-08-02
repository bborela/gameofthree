import socketIo from 'socket.io';
import { StartMessage, Message, MoveMessage, IdMessage, PlayerQuitMessage } from './model';
import uuid from 'uuid/v4';
import { Logger } from './lib/logger';
import { CommandProcessor } from './lib/command-processor';
import { GameController } from './game-controller';
import { MessageHandler } from './message-handler';
const messages = require('./messages.json');

export class GameServer {
    public static readonly PORT: number = 8080;

    private readonly controller: GameController;
    private readonly msgHandler: MessageHandler;
    private readonly logger: Logger;
    private readonly processor: CommandProcessor;

    private io: SocketIO.Server;
    private port: string | number;

    constructor(gameController: GameController,
        msgHandler: MessageHandler,
        processor: CommandProcessor,
        logger: Logger) {
        this.controller = gameController;
        this.msgHandler = msgHandler;
        this.logger = logger;
        this.processor = processor;

        this.printHeader();
        this.attachEvents();
        this.configure();
        this.sockets();
        this.listen();
    }

    private printHeader(): void {
        this.logger.log(messages.programHeader);
    }

    private attachEvents(): void {
        this.processor.on('quit', () => { this.onQuit(); });
        this.processor.on('unknownCmd', () => this.logger.log(messages.unknownCommand));

        this.controller.on('start', (data) => { this.onStart(data); });
        this.controller.on('move', (data) => { this.onMoved(data); });
        this.controller.on('gameOver', () => { this.onFinish(); });

        this.msgHandler.on('chat', (msg) => { this.onChat(msg); });
        this.msgHandler.on('moving', (data) => { this.onMoving(data); });
    }

    private configure(): void {
        this.port = process.env.PORT || GameServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.port);
    }

    private onFinish(): void {
        this.logger.log(messages.gameOver);
        this.controller.tryStart();
    }

    private onQuit(): void {
        this.logger.log(messages.shutdown);
        process.exit(0);
    }

    private onStart(data: any): void {
        const message = new StartMessage(data.state,
            data.score,
            data.startingPlayerId);
        this.broadcast(message);
        this.logger.log(messages.gameStarted);
    }

    private broadcast(message: Message): void {
        this.io.emit('message', message);
    }

    private onMoved(data: any): void {
        const message = new MoveMessage(data.movingPlayer.id,
            data.state,
            data.value,
            data.score,
            data.isFinished);
        this.broadcast(message);
        this.logger.log(messages.moving);
    }

    private onChat(message: any): void {
        this.broadcast(message);
    }

    private onMoving(data: any): void {
        this.controller.tryMove(data.playerId, data.state, data.value);
    }

    private listen(): void {
        this.io.on('connect', (socket: SocketIO.Socket) => {
            this.connectSocket(socket);
        });

        this.logger.log(messages.listening, this.port);
    }

    private connectSocket(socket: SocketIO.Socket) {
        if (this.controller.isGameFull()) {
            socket.disconnect(true);
            this.logger.log(messages.connectAttempt);
            return;
        }

        this.logger.log(messages.connected);

        const playerId = uuid();
        this.controller.enterPlayer(playerId);
        socket.emit('message', new IdMessage(playerId), (_ackData: any) => {
            this.logger.log(`${messages.identified} (id=${playerId})`);
            this.controller.tryStart();
        });

        socket.on('message', (data: any) => {
            this.logger.log('[server](message): %s', JSON.stringify({ playerId, ...data }));
            this.msgHandler.handleMessage(data, playerId);
        });

        socket.on('disconnect', () => {
            this.controller.removePlayer(playerId);
            this.logger.log(messages.disconnected);
            this.broadcast(new PlayerQuitMessage());
        });
    }
}