import { TerminalGameClient } from './terminal-game-client';
import { ServerConnection } from './server-connection';
import { CommandProcessor } from './command-processor';
import { AutoPlayer } from './auto-player';

const connection = new ServerConnection('http://localhost:8080');
const autoPlayer = new AutoPlayer(process.env.AUTO_DELAY);
const app = new TerminalGameClient(connection, new CommandProcessor(), autoPlayer);

export { app };