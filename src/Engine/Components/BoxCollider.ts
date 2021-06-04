import {Vector2} from "../Math/Vector2";
import {Edge} from "../Math/Geometry";
import {CircleCollider, Collider} from "./Collider";

export class BoxCollider extends Collider {
    Start: () => void;
    name: string = "BoxCollider2D";

    size: Vector2 = new Vector2(1, 1);
    offset: Vector2 = new Vector2(0, 0);
    vertices: Array<Vector2>;

    Update = (): void => {
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
        this.SetVertices();

        let edge1 = this.vertices[1].Sub(this.vertices[0]);
        let edge2 = this.vertices[0].Sub(this.vertices[3]);

        normals.push(edge1.LeftNormal().Normalized());
        normals.push(edge2.LeftNormal().Normalized());
        normals.push(edge1.LeftNormal().Inverse().Normalized());
        normals.push(edge2.LeftNormal().Inverse().Normalized());

        return normals;
    }

    GetProjection(axis: Vector2): Vector2 {
        this.SetVertices();
        let min = 100000000.0, max = -100000000.0;
        for (let v of this.vertices) {
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

    private SetVertices(): void {
        this.vertices = new Array<Vector2>();
        this.vertices.push(Vector2.FromPoint(this.gameObject.absoluteTransform.position).Add(this.offset).Add(new Vector2(this.size.x / 2, this.size.y / 2).Rotate(this.gameObject.absoluteTransform.rotation)));
        this.vertices.push(Vector2.FromPoint(this.gameObject.absoluteTransform.position).Add(this.offset).Add(new Vector2(-this.size.x / 2, this.size.y / 2).Rotate(this.gameObject.absoluteTransform.rotation)));
        this.vertices.push(Vector2.FromPoint(this.gameObject.absoluteTransform.position).Add(this.offset).Add(new Vector2(-this.size.x / 2, -this.size.y / 2).Rotate(this.gameObject.absoluteTransform.rotation)));
        this.vertices.push(Vector2.FromPoint(this.gameObject.absoluteTransform.position).Add(this.offset).Add(new Vector2(this.size.x / 2, -this.size.y / 2).Rotate(this.gameObject.absoluteTransform.rotation)));
    }

    public ComputeBestEdge(mtv: Vector2): Edge {
        let max = -100000;
        let index = 0;
        for (let i = 0; i < 4; i++) {
            let proj = mtv.Normalized().Dot(this.vertices[i]);
            if (proj > max) {
                max = proj;
                index = i;
            }
        }

        let l = this.vertices[index].Sub(this.vertices[(index + 5) % 4]).Normalized();
        let r = this.vertices[index].Sub(this.vertices[(index + 3) % 4]).Normalized();
        if (r.Dot(mtv.Normalized()) <= l.Dot(mtv.Normalized())) {
            return new Edge(this.vertices[index], this.vertices[(index + 3) % 4], this.vertices[index]);
        } else {
            return new Edge(this.vertices[index], this.vertices[index], this.vertices[(index + 5) % 4]);
        }
    }
}
