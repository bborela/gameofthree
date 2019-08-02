export class AutoPlayerCalculator {
    static calculate(score: number): number {
        if (score == 2) return 1;
        if (score == 3) return 0;
        return -1;
    }
}