import {Vector2} from "./Vector2";

export abstract class ODESolver {
    x1: Vector2;
    x2: Vector2;
    t: number;
    dt: number;
    f1: (x1: Vector2, x2: Vector2, t: number, m: number) => Vector2;
    f2: (x1: Vector2, x2: Vector2, t: number, m: number) => Vector2;

    protected constructor(init_x1: Vector2, init_x2: Vector2, init_t: number, delta: number,
                          f1: (x1: Vector2, x2: Vector2, t: number, m: number) => Vector2,
                          f2: (x1: Vector2, x2: Vector2, t: number, m: number) => Vector2) {
        this.x1 = init_x1;
        this.x2 = init_x2;
        this.t = init_t;
        this.dt = delta;
        this.f1 = f1;
        this.f2 = f2;
    }

    public SolveForIterations: (it: number, m: number) => void;
}
