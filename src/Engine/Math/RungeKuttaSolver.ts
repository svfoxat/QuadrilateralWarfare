import {Vector2} from "./Vector2";

export class RungeKuttaSolver {
    x1: Vector2;
    x2: Vector2;
    t: number;
    dt: number;
    f1: (x1: Vector2, x2: Vector2, t: number) => Vector2;
    f2: (x1: Vector2, x2: Vector2, t: number) => Vector2;

    constructor(init_x1: Vector2, init_x2: Vector2, init_t: number, delta: number,
                f1: (x1: Vector2, x2: Vector2, t: number) => Vector2,
                f2: (x1: Vector2, x2: Vector2, t: number) => Vector2) {
        this.x1 = init_x1;
        this.x2 = init_x2;
        this.t = init_t;
        this.dt = delta;
        this.f1 = f1;
        this.f2 = f2;
    }

    public SolveForIterations(it: number): void {
        for (let i = 0; i < it; i++) {
            let k11 = this.f1(this.x1, this.x2, this.t).Mul(this.dt);
            let k21 = this.f2(this.x1, this.x2, this.t).Mul(this.dt);
            let k12 = this.f1(this.x1.Add(k11.Mul(0.5)), this.x2.Add(k21.Mul(0.5)), this.t + 0.5 * this.dt).Mul(this.dt);
            let k22 = this.f1(this.x1.Add(k11.Mul(0.5)), this.x2.Add(k21.Mul(0.5)), this.t + 0.5 * this.dt).Mul(this.dt);
            let k13 = this.f1(this.x1.Add(k12.Mul(0.5)), this.x2.Add(k22.Mul(0.5)), this.t + 0.5 * this.dt).Mul(this.dt);
            let k23 = this.f1(this.x1.Add(k12.Mul(0.5)), this.x2.Add(k22.Mul(0.5)), this.t + 0.5 * this.dt).Mul(this.dt);
            let k14 = this.f1(this.x1.Add(k13), this.x2.Add(k23), this.t + this.dt).Mul(this.dt);
            let k24 = this.f2(this.x1.Add(k13), this.x2.Add(k23), this.t + this.dt).Mul(this.dt);
            this.x1 = this.x1.Add(k11.Add(k12.Mul(2).Add(k13.Mul(2).Add(k14))).Div(6));
            this.x1 = this.x2.Add(k21.Add(k22.Mul(2).Add(k23.Mul(2).Add(k24))).Div(6));
            this.t += this.dt;
        }
    }
}
