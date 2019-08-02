import { TerminalGameClient } from './terminal-game-client';
import { ServerConnection } from './lib/server-connection';
import { AutoPlayer } from './auto-player';
import { TerminalCommandProcessor } from './terminal-command-processor';

const connection = new ServerConnection('http://localhost:8080');
const autoPlayer = new AutoPlayer(process.env.AUTO_DELAY);
const app = new TerminalGameClient(connection, new TerminalCommandProcessor(), autoPlayer);

export { app };