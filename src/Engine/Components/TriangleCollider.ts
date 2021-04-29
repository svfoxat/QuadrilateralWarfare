import {Vector2} from "../Vector2";
import {Edge} from "../Geometry";
import {Collider} from "./Collider";
import {Gizmos} from "../Gizmos";

export class TriangleCollider extends Collider {
    Start: () => void;
    name: string = "TriangleCollider2D";

    vertexA: Vector2 = new Vector2(0, 0);
    vertexB: Vector2 = new Vector2(0, 0);
    vertexC: Vector2 = new Vector2(0, 0);
    offset: Vector2 = new Vector2(0, 0);
    vertices: Array<Vector2>;
    a: PIXI.Graphics;
    b: PIXI.Graphics;
    c: PIXI.Graphics;

    Update = (): void => {
        this.a?.clear();
        this.b?.clear();
        this.c?.clear();
        if (this.vertices?.length >= 3) {
            this.a = Gizmos.DrawPoint(this.vertices[0], 5, 0x321314, 1, 0x131245);
            this.b = Gizmos.DrawPoint(this.vertices[1], 5, 0x321314, 1, 0x131245);
            this.c = Gizmos.DrawPoint(this.vertices[2], 5, 0x321314, 1, 0x131245);
        }
        this.application.pixi.stage.addChild(this.a);
        this.application.pixi.stage.addChild(this.b);
        this.application.pixi.stage.addChild(this.c);
    };

    FixedUpdate = () => {
        this.SetVertices();
        let rb = this.attachedRigidbody;
        if (this.attachedRigidbody != null && !this.isTrigger) {
            let pos = Vector2.FromPoint(this.gameObject.absoluteTransform.position).Add(this.offset);
            this.attachedRigidbody.inertia = rb.mass * (Math.pow(this.vertexA.Sub(pos).Mag(), 2) +
                Math.pow(this.vertexB.Sub(pos).Mag(), 2) +
                Math.pow(this.vertexC.Sub(pos).Mag(), 2)) / 3;
        }
    };

    GetSeperatingAxes(): Array<Vector2> {
        let normals = new Array<Vector2>();
        this.SetVertices();

        let edge1 = this.vertices[1].Sub(this.vertices[0]);
        let edge2 = this.vertices[0].Sub(this.vertices[2]);
        let edge3 = this.vertices[2].Sub(this.vertices[1]);

        normals.push(edge1.LeftNormal().Normalized());
        normals.push(edge2.LeftNormal().Normalized());
        normals.push(edge3.LeftNormal().Normalized());

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
        this.vertices.push(Vector2.FromPoint(this.gameObject.absoluteTransform.position).Add(this.offset).Add(this.vertexA).Rotate(this.gameObject.absoluteTransform.rotation));
        this.vertices.push(Vector2.FromPoint(this.gameObject.absoluteTransform.position).Add(this.offset).Add(this.vertexB).Rotate(this.gameObject.absoluteTransform.rotation));
        this.vertices.push(Vector2.FromPoint(this.gameObject.absoluteTransform.position).Add(this.offset).Add(this.vertexC).Rotate(this.gameObject.absoluteTransform.rotation));
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
        console.log("BLUB");

        let l = this.vertices[index].Sub(this.vertices[(index + 5) % 4]).Normalized();
        let r = this.vertices[index].Sub(this.vertices[(index + 3) % 4]).Normalized();
        if (r.Dot(mtv.Normalized()) <= l.Dot(mtv.Normalized())) {
            return new Edge(this.vertices[index], this.vertices[(index + 3) % 4], this.vertices[index]);
        } else {
            return new Edge(this.vertices[index], this.vertices[index], this.vertices[(index + 5) % 4]);
        }
    }
}
