import { GameServer } from './game-server';
import { Game } from './model';
import { Randomizer } from './randomizer';

const randomizer = new Randomizer();
const game = new Game(randomizer);
const app = new GameServer(game);

export { app };