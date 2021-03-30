import {Component} from "./Component";
import {Vector2} from "./Vector2";
import {Rigidbody} from "./Rigidbody";

export abstract class Collider extends Component {
    isTrigger: boolean = false;
    attachedRigidbody: Rigidbody;

    abstract Collision(other: Collider): Vector2;

    abstract GetSeperatingAxes(): Array<Vector2>;

    abstract GetProjection(axis: Vector2): Vector2;

    public static IsColliding(c1: Collider, c2: Collider) {
        return c1.Collision(c2);
    }

    public static BoxBox(box1: BoxCollider, box2: BoxCollider): Vector2 {
        let smallestAxis = null;
        let overlap = 100000.0;
        // Obtain seperating axes1 from box1
        let axes1 = box1.GetSeperatingAxes();
        // Obtain seperating axes2 from box2
        let axes2 = box2.GetSeperatingAxes();

        // Loop over axes1
        for (let axis of axes1) {
            // // project both shapes onto the axis
            let p1 = box1.GetProjection(axis);
            let p2 = box2.GetProjection(axis);
            // // do the projections overlap?
            if (!this.Overlap(p1, p2)) {
                // // if no: then we can guarantee that the shapes do not overlap
                return null;
            } else {
                // // if yes: // get the overlap, check if it is the minimal overlap
                let o = this.GetOverlap(p1, p2);
                if (o < overlap) {
                    overlap = o;
                    smallestAxis = axis;
                }
            }
        }

        // Loop over axes2
        for (let axis of axes2) {
            // // project both shapes onto the axis
            let p1 = box1.GetProjection(axis);
            let p2 = box2.GetProjection(axis);
            // // do the projections overlap?
            if (!this.Overlap(p1, p2)) {
                // // if no: then we can guarantee that the shapes do not overlap
                return null;
            } else {
                // // if yes: // get the overlap, check if it is the minimal overlap
                let o = this.GetOverlap(p1, p2);
                if (o < overlap) {
                    overlap = o;
                    smallestAxis = axis;
                }
            }
        }

        return Vector2.Mul(smallestAxis, overlap);
    }

    public static CircleCircle(circle1: CircleCollider, circle2: CircleCollider): Vector2 {
        return null;
    }

    public static BoxCircle(box1: BoxCollider, circle2: CircleCollider): Vector2 {
        return null;
    }

    private static Overlap(p1: Vector2, p2: Vector2): boolean {
        return p1.x < p2.x && p1.y > p2.x || p2.x < p1.x && p2.y > p1.x;
    }

    private static GetOverlap(p1: Vector2, p2: Vector2): number {
        if (p1.x < p2.x && p1.y > p2.x) {
            return p1.y - p2.x;
        } else if (p2.x < p1.x && p2.y > p1.x) {
            return p2.y - p1.x;
        }
    }
}

export class BoxCollider extends Collider {
    FixedUpdate: () => void;
    OnEnable: () => void;
    Start: () => void;
    name: string = "BoxCollider2D";

    size: Vector2 = new Vector2(1, 1);
    offset: Vector2 = new Vector2(0, 0);

    Update = () => {
        let rb = this.attachedRigidbody;
        if (this.attachedRigidbody != null && !this.isTrigger) {
            this.attachedRigidbody.inertia = rb.mass * (this.size.x * this.size.x + this.size.y * this.size.y) / 12;
        }

    };

    Collision(other: Collider): Vector2 {
        let box = other as BoxCollider;
        if (box != null) {
            return Collider.BoxBox(this, box);
        }

        let circle = other as CircleCollider;
        if (circle != null) {
            return Collider.BoxCircle(this, circle);
        }

        // TODO: Box/Triangle, Box/Mesh Collision
        return undefined;
    }

    GetSeperatingAxes(): Array<Vector2> {
        let normals = new Array<Vector2>();
        // get 3 vertices
        let vertex1 =
            Vector2.Add(Vector2.FromPoint(this.gameObject.transform.position), new Vector2(this.size.x / 2, this.size.y / 2).Rotate(this.gameObject.transform.rotation));
        let vertex2 =
            Vector2.Add(Vector2.FromPoint(this.gameObject.transform.position), new Vector2(-this.size.x / 2, this.size.y / 2).Rotate(this.gameObject.transform.rotation));
        let vertex3 =
            Vector2.Add(Vector2.FromPoint(this.gameObject.transform.position), new Vector2(this.size.x / 2, -this.size.y / 2).Rotate(this.gameObject.transform.rotation));

        // take 2 edges from these vertices
        let edge1 = Vector2.Sub(vertex2, vertex1);
        let edge2 = Vector2.Sub(vertex3, vertex1);

        // flip coordinates and negate one to get normal
        normals.push(new Vector2(edge1.y, edge1.x).Normalized());
        normals.push(new Vector2(edge2.y, edge2.x).Normalized());
        return normals;
    }

    GetProjection(axis: Vector2): Vector2 {
        let vertices = new Array<Vector2>();
        vertices.push(Vector2.Add(Vector2.FromPoint(this.gameObject.transform.position), new Vector2(this.size.x / 2, this.size.y / 2).Rotate(this.gameObject.transform.rotation)));
        vertices.push(Vector2.Add(Vector2.FromPoint(this.gameObject.transform.position), new Vector2(-this.size.x / 2, this.size.y / 2).Rotate(this.gameObject.transform.rotation)));
        vertices.push(Vector2.Add(Vector2.FromPoint(this.gameObject.transform.position), new Vector2(this.size.x / 2, -this.size.y / 2).Rotate(this.gameObject.transform.rotation)));
        vertices.push(Vector2.Add(Vector2.FromPoint(this.gameObject.transform.position), new Vector2(-this.size.x / 2, -this.size.y / 2).Rotate(this.gameObject.transform.rotation)));
        let min = 100000.0, max = -100000.0;
        for (let v of vertices) {
            let p = Vector2.Dot(axis, v);
            if (p < min) {
                min = p;
            } else if (p > max) {
                max = p;
            }
        }
        return new Vector2(min, max);
    }

}

export class CircleCollider extends Collider {
    name: string = "CircleCollider2D";
    offset: Vector2 = new Vector2(0, 0);
    radius: number = 0.5;

    Update = () => {
        let rb = this.attachedRigidbody;
        if (this.attachedRigidbody != null && !this.isTrigger) {
            this.attachedRigidbody.inertia = rb.mass * this.radius * this.radius / 2;
        }
    };

    Collision(other: Collider): Vector2 {
        let box = other as BoxCollider;
        if (box != null) {
            return Collider.BoxCircle(box, this);
        }

        let circle = other as CircleCollider;
        if (circle != null) {
            return Collider.CircleCircle(this, circle);
        }

        // TODO: Circle/Triangle, Circle/Mesh Collision
        return undefined;
    }

    GetSeperatingAxes(): Array<Vector2> {
        return undefined;
    }

    GetProjection(axis: Vector2): Vector2 {
        return undefined;
    }
}

export class MeshCollider extends Collider {
    name: string = "MeshCollider2D";

    Collision(other: Collider): Vector2 {
        return undefined;
    }

    GetSeperatingAxes(): Array<Vector2> {
        return undefined;
    }

    GetProjection(axis: Vector2): Vector2 {
        return undefined;
    }

}
