import { CommandProcessor } from "./lib/command-processor";

export class TerminalCommandProcessor extends CommandProcessor {
    processCommand(cmd: string, cmdValue: string): void {
        switch (cmd) {
            case '/q':
            case '/quit':
                this.emit('quit');
                break;
            case '/s':
            case '/say':
                this.emit('say', cmdValue);
                break;
            case '/p':
            case '/play':
                this.emit('play', cmdValue);
                break;
            case '/auto':
                this.emit('auto');
                break;
            default:
                this.emit('unknownCmd', cmdValue);
                break;
        }
    }
}