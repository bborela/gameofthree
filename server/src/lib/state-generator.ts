import uuid from 'uuid/v4';

export class StateGenerator {
    generate(): string {
        return uuid();
    }
}