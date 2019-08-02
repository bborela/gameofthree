import { GameServer } from './game-server';
import { Game } from './model';
import { Randomizer } from './randomizer';
import { CommandProcessor } from './command-processor';

const randomizer = new Randomizer();
const game = new Game(randomizer);
const logger = {
    log: (message: any, args?: any[]) => args ? console.log(message, args) : console.log(message)
};
const app = new GameServer(game, new CommandProcessor(), logger);

export { app };