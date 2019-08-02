import { TerminalGameClient } from './terminal-game-client';
import { ServerConnection } from './server-connection';

const connection = new ServerConnection('http://localhost:8080');
const app = new TerminalGameClient(connection);

export { app };