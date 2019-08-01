import { ServerConnection } from './server-connection';
import { Player } from './model/player';

export abstract class BaseGameClient {
    private connection: ServerConnection;
    private state: string;
    
    protected player: Player;

    constructor(url: string) {
        this.connection = new ServerConnection(url, (message) => { this.handleIncomingMessage(message) });
    }

    private handleIncomingMessage(message: any) {
        this.updateState(message);

        switch (message.type) {
            case 'id':
                this.player = message.value;
                break;
            case 'start':
                const { score, turn } = message.value;
                return this.onStart(score, turn);
            case 'chat':
                return this.onChat(message);
            case 'error':
                return this.onError(message.value);
            case 'move':
                const { movedBy, player, result } = message.value;
                if (player.id != this.player.id) {
                    return this.onOpponentMove(movedBy, result);
                }
            case 'finish':
                return this.onFinish(message.value == this.player.id);
            case 'opponentQuit':
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

    abstract onChat(message: any) : void;
    abstract onError(errorMessage: string) : void;
    abstract onOpponentMove(movedBy: number, result: number) : void;
    abstract onFinish(haveIWon: boolean) : void;
    abstract onOpponentQuit() : void;
    abstract onStart(score: number, turn: number) : void;
}