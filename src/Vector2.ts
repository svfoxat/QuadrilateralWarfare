import Point = PIXI.Point;

export class Vector2 {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public AsPoint(): Point {
        return new Point(this.x, this.y);
    }

    public static FromPoint(point: Point): Vector2 {
        return new Vector2(point.x, point.y)
    }

    public static Zero(): Vector2 {
        return new Vector2(0, 0);
    }

    public static Add(vec1: Vector2, vec2: Vector2): Vector2 {
        return new Vector2(vec1.x + vec2.x,
            vec1.y + vec2.y);
    }

    public static Sub(vec1: Vector2, vec2: Vector2): Vector2 {
        return new Vector2(vec1.x - vec2.x,
            vec1.y - vec2.y);
    }

    public static Mul(vec1: Vector2, num: number): Vector2 {
        return new Vector2(vec1.x * num,
            vec1.y * num);
    }

    public static Div(vec1: Vector2, num: number): Vector2 {
        return new Vector2(vec1.x / num,
            vec1.y / num);
    }

    public static SimpleMult(vec1: Vector2, vec2: Vector2): Vector2 {
        return new Vector2(vec1.x * vec2.x,
            vec1.y * vec2.y);
    }

    public static SimpleDiv(vec1: Vector2, vec2: Vector2): Vector2 {
        return new Vector2(vec1.x / vec2.x,
            vec1.y / vec2.y,);
    }

    public static Dot(vec1: Vector2, vec2: Vector2): number {
        return vec1.x * vec2.x + vec1.y * vec2.y;
    }
}
