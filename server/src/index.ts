import { GameServer } from './game-server';
import { Game } from './model';
import { Randomizer } from './randomizer';
import { CommandProcessor } from './command-processor';
import { MessageHandler } from './message-handler';
import { GameController } from './game-controller';

const randomizer = new Randomizer();
const game = new Game(randomizer);
const logger = {
    log: (message: any, args?: any[]) => args ? console.log(message, args) : console.log(message)
};
const gameController = new GameController(game);
const app = new GameServer(gameController, new MessageHandler(), new CommandProcessor(), logger);

export { app };