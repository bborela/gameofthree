import { ServerConnection } from './server-connection';

export abstract class BaseGameClient {
    private connection: ServerConnection;
    private state: string;
    
    protected playerId: string;

    constructor(connection: ServerConnection) {
        this.connection = connection;
        connection.on('incoming', (message: any) => { this.handleIncomingMessage(message) });
        connection.on('disconnect', () => {  this.onDisconnect() });
    }

    abstract onChat(message: any) : void;
    abstract onError(errorMessage: string) : void;
    abstract onMove(isMyMove: boolean, movedBy: number, result: number, isFinished: boolean) : void;
    abstract onOpponentQuit() : void;
    abstract onStart(score: number, startingPlayerId: string) : void;
    abstract onDisconnect() : void;

    private handleIncomingMessage(message: any) {
        this.updateState(message);

        switch (message.type) {
            case 'id':
                this.playerId = message.value;
                break;
            case 'start':
                const { score, startingPlayerId } = message.value;
                return this.onStart(score, startingPlayerId);
            case 'chat':
                return this.onChat(message);
            case 'error':
                return this.onError(message.value);
            case 'move':
                const { movedBy, playerId, result, isFinished } = message.value;
                const isMyMove = playerId == this.playerId;
                return this.onMove(isMyMove, movedBy, result, isFinished);
            case 'quit':
                return this.onOpponentQuit();
        }
    }

    private updateState(message: any): void {
        if (message.state) {
            this.state = message.state;
        }
    }

    public say(text: string) {
        this.connection.sendServerMessage({ type: 'chat', value: text });
    }

    public move(value: number) {
        this.connection.sendServerMessage({ type: 'move', value, state: this.state });
    }
}