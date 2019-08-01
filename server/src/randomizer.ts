import { Utils } from "./utils";

export class Randomizer {
    public random(min: number, max: number): number {
        return Utils.toInt(Math.random() * (max - min + 1) + min);
    }
}