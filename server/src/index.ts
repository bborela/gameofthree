import { GameServer } from './game-server';
import { Game } from './model';
import { Randomizer } from './lib/randomizer';
import { MessageHandler } from './message-handler';
import { GameController } from './game-controller';
import { ServerCommandProcessor } from './server-command-processor';

const randomizer = new Randomizer();
const game = new Game(randomizer);
const logger = {
    log: (message: any, args?: any[]) => args ? console.log(message, args) : console.log(message)
};
const gameController = new GameController(game);
const app = new GameServer(gameController, new MessageHandler(), new ServerCommandProcessor(), logger);

export { app };