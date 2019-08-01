export class Player {
    readonly id: string;
    readonly position: number;

    constructor(id: string, position: number) {
        this.id = id;
        this.position = position;
    }
}