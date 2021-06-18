import {Vector2} from "./Vector2";

export abstract class Geometry {
    public static AABBOverlap(p1: AABB, p2: AABB): boolean {
        if (p2.max.x > p1.min.x && p2.max.y > p1.min.y && p2.max.x < p1.max.x && p2.max.y < p1.max.y ||
            p1.max.x > p2.min.x && p1.max.y > p2.min.y && p1.max.x < p2.max.x && p1.max.y < p2.max.y ||
            p2.max.x > p1.max.x && p1.max.y > p2.max.y && p1.max.x > p2.min.x && p2.max.y > p1.min.y ||
            p1.max.x > p2.max.x && p2.max.y > p1.max.y && p2.max.x > p1.min.x && p1.max.y > p2.min.y) return true;
        return false;
    }

    public static GetAABB(vertices: Array<Vector2>): AABB {
        let ret = new AABB();
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (const vertex of vertices) {
            if (vertex.x > maxX) maxX = vertex.x;
            if (vertex.y > maxY) maxY = vertex.y;
            if (vertex.x < minX) minX = vertex.x;
            if (vertex.y < minY) minY = vertex.y;
        }
        ret.min = new Vector2(minX, minY);
        ret.max = new Vector2(maxX, maxY);
        return ret;
    }

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

    public static GetProjection(axis: Vector2, vertices: Array<Vector2>): Vector2 {
        let min = Infinity, max = -Infinity;
        for (let v of vertices) {
            let p = axis.Dot(v);
            if (p < min) {
                min = p;
            }
            if (p > max) {
                max = p;
            }
        }
        return new Vector2(min, max);
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

export class AABB {
    max: Vector2;
    min: Vector2;

    ToString(): string {
        return "AABB: Min: " + this.min.ToString() + ", Max: " + this.max.ToString();
    }
}
