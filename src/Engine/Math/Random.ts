import {Vector2} from "./Vector2";

export class Random {
    public static Range(from: number, to: number): number {
        return Math.random() * (to - from) + from;
    }

    public static OnUnitCircle(): Vector2 {
        let a = Math.random() * 2 - 1;
        let s = Math.sign(Math.random() - 0.5);
        return new Vector2(a, s * Math.sqrt(1 - a * a));
    }
}
