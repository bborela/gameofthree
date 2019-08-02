import { TerminalGameClient } from './terminal-game-client';
import { ServerConnection } from './server-connection';
import { CommandProcessor } from './command-processor';

const connection = new ServerConnection('http://localhost:8080');
const app = new TerminalGameClient(connection, new CommandProcessor());

export { app };