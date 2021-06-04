export class RungeKuttaSolver {
    x1: number;
    x2: number;
    t: number;
    dt: number;
    f1: (x1: number, x2: number, t: number) => number;
    f2: (x1: number, x2: number, t: number) => number;

    constructor(init_x1: number, init_x2: number, init_t: number, delta: number,
                f1: (x1: number, x2: number, t: number) => number,
                f2: (x1: number, x2: number, t: number) => number) {
        this.x1 = init_x1;
        this.x2 = init_x2;
        this.t = init_t;
        this.dt = delta;
        this.f1 = f1;
        this.f2 = f2;
    }

    public SolveForIterations(it: number): void {
        for (let i = 0; i < it; i++) {
            let k11 = this.dt * this.f1(this.x1, this.x2, this.t);
            let k21 = this.dt * this.f2(this.x1, this.x2, this.t);
            let k12 = this.dt * this.f1(this.x1 + 0.5 * k11, this.x2 + 0.5 * k21, this.t + 0.5 * this.dt);
            let k22 = this.dt * this.f2(this.x1 + 0.5 * k11, this.x2 + 0.5 * k21, this.t + 0.5 * this.dt);
            let k13 = this.dt * this.f1(this.x1 + 0.5 * k12, this.x2 + 0.5 * k22, this.t + 0.5 * this.dt);
            let k23 = this.dt * this.f2(this.x1 + 0.5 * k12, this.x2 + 0.5 * k22, this.t + 0.5 * this.dt);
            let k14 = this.dt * this.f1(this.x1 + k13, this.x2 + k23, this.t + this.dt);
            let k24 = this.dt * this.f2(this.x1 + k13, this.x2 + k23, this.t + this.dt);
            this.x1 += (k11 + 2 * k12 + 2 * k13 + k14) / 6;
            this.x2 += (k21 + 2 * k22 + 2 * k23 + k24) / 6;
            this.t += this.dt;
        }
    }
}
