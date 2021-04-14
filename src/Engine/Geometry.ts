import {Vector2} from "./Vector2";

export abstract class Geometry {
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

    public static isPointOnEdge(e: Edge, p: Vector2): boolean {
        // TODO: NOT SURE IF RIGHT
        let l = e.vector();
        p = p.Sub(e.from);
        let c = Vector2.Cross(p, l);
        if (Math.abs(c) < 0.001) {
            if (Math.abs(l.x) >= Math.abs(l.y))
                return l.x > 0 ?
                    e.from.x <= p.x && p.x <= e.to.x :
                    e.to.x <= p.x && p.x <= e.from.x;
            else
                return l.y > 0 ?
                    e.from.y <= p.y && p.y <= e.to.y :
                    e.to.y <= p.y && p.y <= e.from.y;
        } else {
            return false;
        }
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
