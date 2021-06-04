export class VerletSolver {
    x: number
    v: number
    a: number
    dt: number
    f: (x: number) => number;

    constructor(init_x: number, init_v: number, init_a: number, delta: number, f: (x: number) => number) {
        this.x = init_x;
        this.v = init_v;
        this.a = init_a;
        this.f = f;
    }

    public SolveForIterations(it: number) {
        for (let i = 0; i < it; i++) {
            let x_next = this.x + this.v * this.dt + 0.5 * this.a * this.dt * this.dt;
            let a_next = this.f(x_next);
            let v_next = this.v + 0.5 * (this.a + a_next) * this.dt;

            this.x = x_next;
            this.a = a_next;
            this.v = v_next;
        }
    }
}
