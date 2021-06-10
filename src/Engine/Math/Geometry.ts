import {Vector2} from "./Vector2";

export abstract class Geometry {
    public static Overlap(p1: Vector2, p2: Vector2): boolean {
        return p1.x < p2.x && p1.y > p2.x || p2.x < p1.x && p2.y > p1.x;
    }

    public static GetOverlap(p1: Vector2, p2: Vector2): number {
        if (p1.x < p2.x && p1.y > p2.x) {
            return p1.y - p2.x;
        } else if (p2.x < p1.x && p2.y > p1.x) {
            return p2.y - p1.x;
        }
    }

    public static clip(v1: Vector2, v2: Vector2, n: Vector2, o: number): Array<Vector2> {
        let cp = new Array<Vector2>();
        let d1 = Vector2.Dot(n, v1) - o;
        let d2 = Vector2.Dot(n, v2) - o;
        if (d1 >= 0.0) cp.push(v1);
        if (d2 >= 0.0) cp.push(v2);
        if (d1 * d2 < 0.0) {
            cp.push(Vector2.Add(Vector2.Mul(Vector2.Sub(v2, v1), d1 / (d1 - d2)), v1));
        }

        return cp;
    }
}

export class Edge {
    maxProj: Vector2;
    from: Vector2;
    to: Vector2;

    constructor(max: Vector2, from: Vector2, to: Vector2) {
        this.maxProj = max;
        this.from = from;
        this.to = to;
    }

    public vector(): Vector2 {
        return Vector2.Sub(this.to, this.from);
    }
}

export class ClippingPlane {
    ref: Edge;
    inc: Edge;
    flip: boolean;

    constructor(ref: Edge, inc: Edge, flip: boolean) {
        this.ref = ref;
        this.inc = inc;
        this.flip = flip;
    }
}
