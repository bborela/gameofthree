import { EventEmitter } from "events";

export class MessageHandler extends EventEmitter {
    constructor() {
        super();
    }

    public handleMessage(message: any, playerId: string): void {
        const payload = message.payload;
        switch (payload.type) {
            case 'chat':
                this.emit('chat', message);
                break;
            case 'move':
                this.emit('moving', { playerId, state: payload.state, value: payload.value });
                break;
            default:
                this.emit('invalidMsg', message);
                break;
        }
    }
}