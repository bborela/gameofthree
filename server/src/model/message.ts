export class Message {
    readonly payload: any;
    readonly sourceId: string;

    constructor(payload: any,
        sourceId: string = null) {
        this.payload = payload;
        this.sourceId = sourceId;
    }
}

export class StartMessage extends Message {
    constructor(state: string, score: number, turn: any) {
        super({ type: 'start', state, value: { score, turn } });
    }
}

export class FinishMessage extends Message {
    constructor(winner: string) {
        super({ type: 'finish', value: winner });
    }
}

export class MoveMessage extends Message {
    constructor(player: any, state: string, movedBy: number, result: number) {
        super({ type: 'move', state, value: { player, movedBy, result } });
    }
}

export class IdMessage extends Message {
    constructor(id: string) {
        super({ type: 'id', value: id });
    }
}