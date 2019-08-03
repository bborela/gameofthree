import { CommandProcessor } from "./lib";

export class ServerCommandProcessor extends CommandProcessor {
    processCommand(cmd: string, _cmdValue?: string): void {
        switch (cmd) {
            case '/q':
            case '/quit':
                this.emit('quit');
                break;
            default:
                this.emit('unknownCmd');
                break;
        }
    }
}