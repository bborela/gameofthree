import { Randomizer } from "../src/lib/randomizer";
import { StateGenerator } from "../src/lib/state-generator";
import { StubStateGenerator } from "./stubs";
import { Game } from "../src/model";

export class GameBuilder {
    private randomizer: Randomizer;
    private stateGenerator: StateGenerator;
    private players: string[] = [];

    withRandomizer(randomFn: (min: number, max: number) => number): GameBuilder {
        this.randomizer = { random: randomFn };
        return this;
    }

    withStates(states: string | Array<string> = 'any'): GameBuilder {
        this.stateGenerator = new StubStateGenerator(states);
        return this;
    }

    withPlayer(id: string): GameBuilder {
        this.players.push(id);
        return this;
    }

    build(): Game {
        const game = new Game(this.randomizer, this.stateGenerator);
        this.players.forEach((id) => game.enterPlayer(id));
        return game;
    }
}