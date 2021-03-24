export class Vector3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public static Zero(): Vector3 {
        return new Vector3(0, 0, 0);
    }

    public static Add(vec1: Vector3, vec2: Vector3): Vector3 {
        return new Vector3(vec1.x + vec2.x,
            vec1.y + vec2.y,
            vec1.z + vec2.z);
    }

    public static Sub(vec1: Vector3, vec2: Vector3): Vector3 {
        return new Vector3(vec1.x - vec2.x,
            vec1.y - vec2.y,
            vec1.z - vec2.z);
    }

    public static Mult(vec1: Vector3, num: number): Vector3 {
        return new Vector3(vec1.x * num,
            vec1.y * num,
            vec1.z * num);
    }

    public static Div(vec1: Vector3, num: number): Vector3 {
        return new Vector3(vec1.x / num,
            vec1.y / num,
            vec1.z / num);
    }

    public static SimpleMult(vec1: Vector3, vec2: Vector3): Vector3 {
        return new Vector3(vec1.x * vec2.x,
            vec1.y * vec2.y,
            vec1.z * vec2.z);
    }

    public static SimpleDiv(vec1: Vector3, vec2: Vector3): Vector3 {
        return new Vector3(vec1.x / vec2.x,
            vec1.y / vec2.y,
            vec1.z / vec2.z);
    }

    public static Dot(vec1: Vector3, vec2: Vector3): number {
        return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.y;
    }

    public static Cross(vec1: Vector3, vec2: Vector3): Vector3 {
        return new Vector3(vec1.y * vec2.z - vec1.z * vec2.y,
            vec1.z * vec2.x - vec1.x * vec2.z,
            vec1.x * vec2.y - vec1.y * vec2.x);
    }
}
