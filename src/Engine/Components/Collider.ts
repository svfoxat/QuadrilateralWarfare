import {Component} from "./Component";
import {Vector2} from "../Vector2";
import {Rigidbody} from "./Rigidbody";
import Application from "../Application";

export abstract class Collider extends Component {
    isTrigger: boolean = false;
    attachedRigidbody: Rigidbody;
    application: Application;

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
    OnEnable: () => void;
    Start: () => void;
    _name: string = "BoxCollider2D";

    size: Vector2 = new Vector2(1, 1);
    offset: Vector2 = new Vector2(0, 0);
    vertices: Array<Vector2>;
    verticesPoints: Array<PIXI.Graphics> = new Array<PIXI.Graphics>();

    Update = (): void => {
        if (this.vertices != null) {
            this.DrawVertices();
        }
    };

    FixedUpdate = () => {
        this.SetVertices();
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
        this.SetVertices();

        // take 2 edges from these vertices
        let edge1 = Vector2.Sub(this.vertices[1], this.vertices[0]);
        let edge2 = Vector2.Sub(this.vertices[0], this.vertices[2]);


        // flip coordinates and negate one to get normal
        normals.push(edge1.LeftNormal().Normalized());
        normals.push(edge2.LeftNormal().Normalized());
        normals.push(edge1.LeftNormal().Normalized().Inverse());
        normals.push(edge2.LeftNormal().Normalized().Inverse());
        return normals;
    }

    GetProjection(axis: Vector2): Vector2 {
        this.SetVertices();
        let min = 100000.0, max = -100000.0;
        for (let v of this.vertices) {
            let p = Vector2.Dot(axis, v);
            if (p < min) {
                min = p;
            } else if (p > max) {
                max = p;
            }
        }
        return new Vector2(min, max);
    }

    private SetVertices(): void {
        this.vertices = new Array<Vector2>();
        this.vertices.push(Vector2.Add(Vector2.FromPoint(this.gameObject.absoluteTransform.position), new Vector2(this.size.x / 2, this.size.y / 2).Rotate(this.gameObject.absoluteTransform.rotation)));
        this.vertices.push(Vector2.Add(Vector2.FromPoint(this.gameObject.absoluteTransform.position), new Vector2(-this.size.x / 2, this.size.y / 2).Rotate(this.gameObject.absoluteTransform.rotation)));
        this.vertices.push(Vector2.Add(Vector2.FromPoint(this.gameObject.absoluteTransform.position), new Vector2(this.size.x / 2, -this.size.y / 2).Rotate(this.gameObject.absoluteTransform.rotation)));
        this.vertices.push(Vector2.Add(Vector2.FromPoint(this.gameObject.absoluteTransform.position), new Vector2(-this.size.x / 2, -this.size.y / 2).Rotate(this.gameObject.absoluteTransform.rotation)));
    }

    public DrawVertices(): void {
        if (this.verticesPoints.length != 0) {
            this.verticesPoints.forEach(point => {
                point.clear();
            })
        }

        this.vertices.forEach(element => {
            let point = new PIXI.Graphics();
            point.lineStyle(2, 0xFF0000);
            point.beginFill(0xFFFF00);
            point.drawCircle(element.x, element.y, 5);
            point.endFill();
            this.application.pixi.stage.addChild(point);
            this.verticesPoints.push(point);
        })
    }
}

export class CircleCollider extends Collider {
    _name: string = "CircleCollider2D";
    offset: Vector2 = new Vector2(0, 0);
    radius: number = 0.5;

    Update = (): void => {
    };

    FixedUpdate = () => {
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
    _name: string = "MeshCollider2D";

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
