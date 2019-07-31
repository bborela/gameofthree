export interface Message {
    type: string;
    value: string;
}

export interface ReceivedMessage {
    sourceId: string;
    payload: Message;
}