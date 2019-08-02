import { ServerConnection } from './server-connection';
import { MessageTypes } from './message-types';

export abstract class BaseGameClient {
    private connection: ServerConnection;
    private state: string;
    
    protected playerId: string;

    constructor(connection: ServerConnection) {
        this.connection = connection;
        connection.on('incoming', (message: any) => { this.onIncomingMessage(message) });
        connection.on('disconnect', () => {  this.onDisconnect() });
    }

    abstract onChat(message: any) : void;
    abstract onError(errorMessage: string) : void;
    abstract onMove(isMyMove: boolean, movedBy: number, result: number, isFinished: boolean) : void;
    abstract onOpponentQuit() : void;
    abstract onStart(score: number, startingPlayerId: string) : void;
    abstract onDisconnect() : void;

    private onIncomingMessage(message: any) {
        this.updateState(message);

        switch (message.type) {
            case MessageTypes.ID:
                this.playerId = message.value;
                break;
            case MessageTypes.START:
                const { score, startingPlayerId } = message.value;
                return this.onStart(score, startingPlayerId);
            case MessageTypes.CHAT:
                return this.onChat(message);
            case MessageTypes.ERROR:
                return this.onError(message.value);
            case MessageTypes.MOVE:
                const { movedBy, playerId, result, isFinished } = message.value;
                const isMyMove = playerId == this.playerId;
                return this.onMove(isMyMove, movedBy, result, isFinished);
            case MessageTypes.QUIT:
                return this.onOpponentQuit();
        }
    }

    private updateState(message: any): void {
        if (message.state) {
            this.state = message.state;
        }
    }

    public say(text: string) {
        this.connection.sendServerMessage({ type: MessageTypes.CHAT, value: text });
    }

    public move(value: number) {
        this.connection.sendServerMessage({ type: MessageTypes.MOVE, value, state: this.state });
    }
}