import { TerminalGameClient, TerminalCommandProcessor } from './terminal';
import { ServerConnection } from './lib';
import { AutoPlayer } from './auto-player';

const host = process.argv[2] || 'http://localhost:8080';
const connection = new ServerConnection(host);
const autoPlayer = new AutoPlayer(process.env.AUTO_DELAY);
const app = new TerminalGameClient(connection, new TerminalCommandProcessor(), autoPlayer);

export { app };