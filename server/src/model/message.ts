export class Message {
    readonly payload: any;

    constructor(payload: any) {
        this.payload = payload;
    }
}

export class StartMessage extends Message {
    constructor(state: string, score: number, startingPlayerId: string) {
        super({ type: 'start', state, value: { score, startingPlayerId } });
    }
}

export class MoveMessage extends Message {
    constructor(playerId: string, state: string, movedBy: number, result: number, isFinished: boolean) {
        super({ type: 'move', state, value: { playerId, movedBy, result, isFinished } });
    }
}

export class IdMessage extends Message {
    constructor(id: string) {
        super({ type: 'id', value: id });
    }
}

export class PlayerQuitMessage extends Message {
    constructor() {
        super({ type: 'quit' });
    }
}