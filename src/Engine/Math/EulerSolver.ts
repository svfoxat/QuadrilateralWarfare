import {Vector2} from "./Vector2";
import {ODESolver} from "./ODESolver";

export class EulerSolver extends ODESolver {
    constructor(init_x1: Vector2, init_x2: Vector2, init_t: number, delta: number,
                f1: (x1: Vector2, x2: Vector2, t: number, m: number) => Vector2,
                f2: (x1: Vector2, x2: Vector2, t: number, m: number) => Vector2) {
        super(init_x1, init_x2, init_t, delta, f1, f2);
    }

    SolveForIterations = (it: number, m: number): void => {
        for (let i = 0; i < it; i++) {
            let k1 = this.f1(this.x1, this.x2, this.t, m).Mul(this.dt);
            let k2 = this.f2(this.x1, this.x2, this.t, m).Mul(this.dt);
            this.t += this.dt;
            this.x1 = this.x1.Add(k1);
            this.x2 = this.x2.Add(k2);
        }
    }
}
