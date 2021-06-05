import {Vector2} from "./Math/Vector2";

export class Forcefield {
    static GetForceAtPosition(pos: Vector2): Vector2 {
        return new Vector2(0, 10);
    }
}
