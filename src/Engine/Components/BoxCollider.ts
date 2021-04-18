import {Vector2} from "../Vector2";
import {Edge} from "../Geometry";
import {CircleCollider, Collider} from "./Collider";
import {Gizmos} from "../Gizmos";

export class BoxCollider extends Collider {
    OnEnable: () => void;
    Start: () => void;
    _name: string = "BoxCollider2D";

    size: Vector2 = new Vector2(1, 1);
    offset: Vector2 = new Vector2(0, 0);
    vertices: Array<Vector2>;
    verticesPoints: Array<PIXI.Graphics> = new Array<PIXI.Graphics>();
    axis: Array<PIXI.Graphics> = new Array<PIXI.Graphics>();

    Update = (): void => {
        if (this.vertices != null) {
            // this.DrawVertices();
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
        let edge2 = Vector2.Sub(this.vertices[0], this.vertices[3]);


        // flip coordinates and negate one to get normal
        normals.push(edge1.LeftNormal().Normalized());
        normals.push(edge2.LeftNormal().Normalized());
        normals.push(edge1.LeftNormal().Inverse().Normalized());
        normals.push(edge2.LeftNormal().Inverse().Normalized());
        // this.axis.forEach(e => {
        //     e.clear();
        // });
        // this.axis = new Array<PIXI.Graphics>();
        // this.axis.push(Gizmos.DrawArrow(this.vertices[0].Add(edge1.Div(2)), this.vertices[0].Add(edge1.Div(2)).Add(edge1.LeftNormal().Normalized().Inverse().Mul(10)), 8, 0xFF0000));
        // this.axis.push(Gizmos.DrawArrow(this.vertices[2].Add(edge1.Div(-2)), this.vertices[2].Add(edge1.Div(-2)).Add(edge1.LeftNormal().Normalized().Mul(10)), 4, 0xFF0000));
        // this.axis.push(Gizmos.DrawArrow(this.vertices[1].Add(edge2.Div(-2)), this.vertices[1].Add(edge2.Div(-2)).Add(edge2.LeftNormal().Normalized().Mul(10)), 4, 0x0000FF));
        // this.axis.push(Gizmos.DrawArrow(this.vertices[3].Add(edge2.Div(2)), this.vertices[3].Add(edge2.Div(2)).Add(edge2.LeftNormal().Normalized().Inverse().Mul(10)), 8, 0x0000FF));
        // // this.axis.push(Gizmos.DrawArrow(this.vertices[1].Add(edge2.Div(2)), edge2.LeftNormal().Normalized().Add(this.vertices[1].Add(edge2.Div(2))), 5, 0x00FF00));
        // // this.axis.push(Gizmos.DrawArrow(this.vertices[2].Add(edge1.Div(-2)), edge1.LeftNormal().Normalized().Inverse().Add(this.vertices[2].Add(edge1.Div(2))), 5, 0x0000FF));
        // // this.axis.push(Gizmos.DrawArrow(this.vertices[3].Add(edge2.Div(-2)), edge2.LeftNormal().Normalized().Inverse().Add(this.vertices[3].Add(edge2.Div(2))), 5, 0xFFFF00));
        // this.axis.forEach(e => {
        //     this.application.pixi.stage.addChild(e);
        // });

        return normals;
    }

    GetProjection(axis: Vector2): Vector2 {
        this.SetVertices();
        let min = 100000000.0, max = -100000000.0;
        for (let v of this.vertices) {
            let p = Vector2.Dot(axis, v);
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
        this.vertices.push(Vector2.Add(Vector2.FromPoint(this.gameObject.absoluteTransform.position), new Vector2(this.size.x / 2, this.size.y / 2).Rotate(this.gameObject.absoluteTransform.rotation)));
        this.vertices.push(Vector2.Add(Vector2.FromPoint(this.gameObject.absoluteTransform.position), new Vector2(-this.size.x / 2, this.size.y / 2).Rotate(this.gameObject.absoluteTransform.rotation)));
        this.vertices.push(Vector2.Add(Vector2.FromPoint(this.gameObject.absoluteTransform.position), new Vector2(-this.size.x / 2, -this.size.y / 2).Rotate(this.gameObject.absoluteTransform.rotation)));
        this.vertices.push(Vector2.Add(Vector2.FromPoint(this.gameObject.absoluteTransform.position), new Vector2(this.size.x / 2, -this.size.y / 2).Rotate(this.gameObject.absoluteTransform.rotation)));
    }

    public ComputeBestEdge(mtv: Vector2): Edge {
        let max = -100000;
        let index = 0;
        for (let i = 0; i < 4; i++) {
            let proj = Vector2.Dot(mtv.Normalized(), this.vertices[i]);
            if (proj > max) {
                max = proj;
                index = i;
            }
        }

        let l = Vector2.Sub(this.vertices[index], this.vertices[(index + 5) % 4]).Normalized();
        let r = Vector2.Sub(this.vertices[index], this.vertices[(index + 3) % 4]).Normalized();
        if (Vector2.Dot(r, mtv.Normalized()) <= Vector2.Dot(l, mtv.Normalized())) {
            return new Edge(this.vertices[index], this.vertices[(index + 3) % 4], this.vertices[index]);
        } else {
            return new Edge(this.vertices[index], this.vertices[index], this.vertices[(index + 5) % 4]);
        }
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
