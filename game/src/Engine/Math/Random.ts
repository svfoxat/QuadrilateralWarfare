import {Vector2} from "./Vector2";

export class Random {
    public static Range(from: number, to: number): number {
        return Math.random() * (to - from) + from;
    }

    public static OnUnitCircle(): Vector2 {
        let a = Math.random() * 2 * Math.PI;
        return new Vector2(Math.cos(a), Math.sin(a));
    }
}
