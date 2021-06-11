import {Component} from "./Component";
import {Vector2} from "../Math/Vector2";
import {ForceMode, Rigidbody} from "./Rigidbody";
import Application from "../Application";
import {AABB, ClippingPlane, Edge, Geometry} from "../Math/Geometry";
import {SceneManager} from "../SceneManager";
import {Gizmos} from "../Gizmos";

export abstract class Collider extends Component {
    isTrigger: boolean = false;
    attachedRigidbody: Rigidbody;
    application: Application;
    maxSleep: number = 1000;
    sleepCount: number = 0;
    lastPos: Vector2 = Vector2.Zero();
    lastRot: number = 0;

    static bounciness: number = .7;

    abstract GetSeparatingAxes(): Array<Vector2>;

    abstract GetAABB(): AABB;

    private static MovableRigidbody(c: Collider): boolean {
        return !(c?.attachedRigidbody == null || c.attachedRigidbody.isStatic || c.attachedRigidbody.mass === 0);
    }

    public SleepTick(): void {
        if (this.attachedRigidbody.velocity.Mag() < 0.5 && this.attachedRigidbody.angularVelocity < 0.5) {
            if (++this.sleepCount >= this.maxSleep) {
                this.attachedRigidbody.isAsleep = true;
            }
        } else {
            this.sleepCount = 0;
            this.attachedRigidbody.isAsleep = false;
        }
        this.lastPos = Vector2.FromPoint(this.gameObject.absoluteTransform.position);
        this.lastRot = this.gameObject.absoluteTransform.rotation;
    }

    public static HandleCollision(c1: Collider, c2: Collider, mtv: Vector2): void {
        if (!this.MovableRigidbody(c1) && !this.MovableRigidbody(c2)) return;
        if (!this.MovableRigidbody(c1)) {
            c2.gameObject.transform.position = Vector2.Add(Vector2.FromPoint(c2.gameObject.transform.position), mtv).AsPoint();
        } else if (!this.MovableRigidbody(c2)) {
            c1.gameObject.transform.position = Vector2.FromPoint(c1.gameObject.transform.position).Add(mtv).AsPoint();
        } else {
            if (c1.attachedRigidbody.velocity.Mag() > 0 && c2.attachedRigidbody.velocity.Mag() > 0) {
                c1.gameObject.transform.position = Vector2.FromPoint(c1.gameObject.transform.position).Add(mtv.Mul(-.5)).AsPoint();
                c2.gameObject.transform.position = Vector2.FromPoint(c2.gameObject.transform.position).Add(mtv.Mul(.5)).AsPoint();
            }
        }
    }

    public static GetClippingPlanes(c1: Collider, c2: Collider, mtv: Vector2): ClippingPlane {
        if ((c1 instanceof BoxCollider || c1 instanceof TriangleCollider) &&
            (c2 instanceof BoxCollider || c2 instanceof TriangleCollider)) {
            let edge1 = c1.ComputeBestEdge(mtv);
            let edge2 = c2.ComputeBestEdge(mtv.Inverse());

            if (Math.abs(edge1.vector().Dot(mtv)) <= Math.abs(edge2.vector().Dot(mtv))) {
                return new ClippingPlane(edge1, edge2, false);
            } else {
                return new ClippingPlane(edge2, edge1, true);
            }
        }
    }

    public static GetContactPoint(c1: Collider, c2: Collider, mtv: Vector2, pl: ClippingPlane = null): Array<Vector2> {
        if ((c1 instanceof BoxCollider || c1 instanceof TriangleCollider) &&
            (c2 instanceof BoxCollider || c2 instanceof TriangleCollider)) {
            let plane = this.GetClippingPlanes(c1, c2, mtv);
            let ref = plane.ref, inc = plane.inc, flip = plane.flip;
            if (pl != null) {
                pl.ref = ref;
                pl.inc = inc;
                pl.flip = flip;
            }

            let refv = ref.vector().Normalized();
            let o1 = Vector2.Dot(refv, ref.from);
            let cp = Geometry.clip(inc.from, inc.to, refv, o1);
            if (cp.length < 2) return null;

            let o2 = Vector2.Dot(refv, ref.to);
            cp = Geometry.clip(cp[0], cp[1], refv.Inverse(), -o2);
            if (cp.length < 2) return null;
            let refNorm = ref.vector().LeftNormal();
            if (flip) refNorm.Inverse();
            let max = Vector2.Dot(refNorm, ref.maxProj);
            if (Vector2.Dot(refNorm, cp[0]) - max < 0.0) {
                delete cp[0];
            }
            if (Vector2.Dot(refNorm, cp[1]) - max < 0.0) {
                delete cp[1];
            }
            return cp;
        } else {
            return null;
        }
    }

    public static ComputeAndApplyForces(c1: Collider, c2: Collider, mtv: Vector2, contactPoint: Vector2, normal: Vector2, flip: boolean): void {
        if (contactPoint != undefined) {
            let rAP, rBP, wA1, wB1, vA1, vB1, vAP1, vBP1, n, j;
            rAP = Vector2.Sub(contactPoint, Vector2.FromPoint(c1.gameObject.transform.position));
            rBP = Vector2.Sub(contactPoint, Vector2.FromPoint(c2.gameObject.transform.position));
            wA1 = c1.attachedRigidbody.angularVelocity;
            wB1 = c2.attachedRigidbody.angularVelocity;
            vA1 = c1.attachedRigidbody.velocity;
            vB1 = c2.attachedRigidbody.velocity;
            vAP1 = Vector2.Add(vA1, Vector2.CrossVec(rAP, wA1));
            vBP1 = Vector2.Add(vB1, Vector2.CrossVec(rBP, wB1));
            n = normal;
            j = this.CalculateImpulse(this.bounciness, c1.attachedRigidbody.mass, c2.attachedRigidbody.mass, c1.attachedRigidbody.inertia, c2.attachedRigidbody.inertia,
                rAP, rBP, vAP1, vBP1, n);

            c1.attachedRigidbody.AddForce(Vector2.Mul(n, j), ForceMode.Impulse);
            c2.attachedRigidbody.AddForce(Vector2.Mul(n, -j), ForceMode.Impulse);
            c1.attachedRigidbody.AddTorque(Vector2.Cross(rAP, Vector2.Mul(n, j)), ForceMode.Impulse);
            c2.attachedRigidbody.AddTorque(-Vector2.Cross(rBP, Vector2.Mul(n, j)), ForceMode.Impulse);
        }
    }

    private static CalculateImpulse(e: number, mA: number, mB: number, iA: number, iB: number,
                                    rAP: Vector2, rBP: Vector2, vAP1: Vector2, vBP1: Vector2, n: Vector2): number {
        if (mA == 0 && iA == 0 && mB == 0 && iB == 0) {
            return 0;
        } else if (mA == 0 && iA == 0) {
            return this.ImpulseSimple(e, mB, iB, rBP, Vector2.Sub(vAP1, vBP1), n);
        } else if (mB == 0 && iB == 0) {
            return this.ImpulseSimple(e, mA, iA, rAP, Vector2.Sub(vAP1, vBP1), n);
        } else {
            let rAPN = Vector2.Cross(rAP, n);
            let rBPN = Vector2.Cross(rBP, n);
            return -(1 + e) * Vector2.Dot(Vector2.Sub(vAP1, vBP1), n) / (1 / mA + 1 / mB + rAPN * rAPN / iA + rBPN * rBPN / iB);
        }
    }

    private static ImpulseSimple(e: number, m: number, i: number, rAP: Vector2, vAP1: Vector2, n: Vector2): number {
        let rAPN = Vector2.Cross(rAP, n);
        return -(1 + e) * Vector2.Dot(vAP1, n) / (1 / m + rAPN * rAPN / i);
    }

    public static IsColliding(c1: Collider, c2: Collider): Vector2 {
        if (c1 instanceof BoxCollider) {
            return this.BoxCollision(c1, c2);
        }

        if (c1 instanceof TriangleCollider) {
            return this.TriangleCollision(c1, c2);
        }

        return undefined;
    }

    public static BoxBox(box1: BoxCollider, box2: BoxCollider): Vector2 {
        let smallestAxis = null;
        let overlap = 100000.0;
        let axes1 = box1.GetSeparatingAxes();
        let axes2 = box2.GetSeparatingAxes();

        for (let axis of axes1) {
            let p1 = Geometry.GetProjection(axis, box1.vertices);
            let p2 = Geometry.GetProjection(axis, box2.vertices);
            if (!Geometry.Overlap(p1, p2)) {
                return null;
            } else {
                let o = Geometry.GetOverlap(p1, p2);
                if (o < overlap) {
                    overlap = o;
                    smallestAxis = axis;
                }
            }
        }
        for (let axis of axes2) {
            let p1 = Geometry.GetProjection(axis, box1.vertices);
            let p2 = Geometry.GetProjection(axis, box2.vertices);
            if (!Geometry.Overlap(p1, p2)) {
                return null;
            } else {
                let o = Geometry.GetOverlap(p1, p2);
                if (o < overlap) {
                    overlap = o;
                    smallestAxis = axis;
                }
            }
        }

        return Vector2.Mul(smallestAxis, overlap);
    }

    public static CollisionCheck() {
        let colliders = new Array<Collider>();
        for (let go of SceneManager.getInstance().activeScene.sceneRoot.children) {
            let box = go.GetComponent(BoxCollider) as BoxCollider;
            if (box != null && box.enabled && go.enabled) {
                colliders.push(box);
                continue;
            }
            let tri = go.GetComponent(TriangleCollider) as TriangleCollider;
            if (tri != null && tri.enabled && go.enabled) {
                colliders.push(tri);
            }
        }
        for (let i = 0; i < colliders.length; i++) {
            for (let j = 0; j < colliders.length; j++) {
                if (i >= j || (colliders[i].attachedRigidbody?.mass === 0 && colliders[j].attachedRigidbody?.mass === 0) || (colliders[i].attachedRigidbody?.isAsleep && colliders[j].attachedRigidbody?.isAsleep)) continue;
                if (this.BroadCollisionCheck(colliders[i], colliders[j])) {
                    let collision = Collider.IsColliding(colliders[i], colliders[j]);
                    if (collision != null) {
                        if (!(collision.Dot(Vector2.FromPoint(colliders[i].gameObject.transform.position).Sub(Vector2.FromPoint(colliders[j].gameObject.transform.position))) < 0.0)) {
                            collision = collision.Inverse();
                        }
                        Collider.HandleCollision(colliders[i], colliders[j], collision);
                        let cp = new ClippingPlane(null, null, null);
                        let collisionPoint = Collider.GetContactPoint(colliders[i], colliders[j], collision, cp);
                        let normal = !cp.flip ? cp.ref.vector().LeftNormal().Inverse() : cp.ref.vector().LeftNormal();
                        let currCP = collisionPoint.filter(e => e != undefined)[collisionPoint.filter(e => e != undefined).length - 1];
                        Collider.ComputeAndApplyForces(colliders[i], colliders[j], collision, currCP, normal.Normalized(), cp.flip);
                        colliders[i].SleepTick();
                        colliders[j].SleepTick();
                        colliders[i].gameObject.OnCollision(colliders[j]);
                        colliders[j].gameObject.OnCollision(colliders[i]);
                    }
                }
            }
        }
    }

    public static BoxTriangle(tri: TriangleCollider, box: BoxCollider) {
        let smallestAxis = null;
        let overlap = 100000.0;
        let axes1 = tri.GetSeparatingAxes();
        let axes2 = box.GetSeparatingAxes();

        for (let axis of axes1) {
            let p1 = Geometry.GetProjection(axis, tri.vertices);
            let p2 = Geometry.GetProjection(axis, box.vertices);
            if (!Geometry.Overlap(p1, p2)) {
                return null;
            } else {
                let o = Geometry.GetOverlap(p1, p2);
                if (o < overlap) {
                    overlap = o;
                    smallestAxis = axis;
                }
            }
        }
        for (let axis of axes2) {
            let p1 = Geometry.GetProjection(axis, tri.vertices);
            let p2 = Geometry.GetProjection(axis, box.vertices);
            if (!Geometry.Overlap(p1, p2)) {
                return null;
            } else {
                let o = Geometry.GetOverlap(p1, p2);
                if (o < overlap) {
                    overlap = o;
                    smallestAxis = axis;
                }
            }
        }

        return Vector2.Mul(smallestAxis, overlap);
    }

    public static BoxCollision(box: BoxCollider, other: Collider): Vector2 {
        let b = other as BoxCollider;
        if (b != null) {
            return Collider.BoxBox(box, b);
        }

        let tri = other as TriangleCollider;
        if (tri != null) {
            return Collider.BoxTriangle(tri, box);
        }

        return undefined;
    }

    public static TriangleCollision(triangle: TriangleCollider, other: Collider): Vector2 {
        let box = other as BoxCollider;
        if (box != null) {
            return Collider.BoxTriangle(triangle, box);
        }

        let tri = other as TriangleCollider;
        if (tri != null) {
            return Collider.TriangleTriangle(triangle, tri);
        }

        return undefined;
    }

    public static TriangleTriangle(tri1: TriangleCollider, tri2: TriangleCollider) {
        let smallestAxis = null;
        let overlap = 100000.0;
        let axes1 = tri1.GetSeparatingAxes();
        let axes2 = tri2.GetSeparatingAxes();

        for (let axis of axes1) {
            let p1 = Geometry.GetProjection(axis, tri1.vertices);
            let p2 = Geometry.GetProjection(axis, tri2.vertices);
            if (!Geometry.Overlap(p1, p2)) {
                return null;
            } else {
                let o = Geometry.GetOverlap(p1, p2);
                if (o < overlap) {
                    overlap = o;
                    smallestAxis = axis;
                }
            }
        }
        for (let axis of axes2) {
            let p1 = Geometry.GetProjection(axis, tri1.vertices);
            let p2 = Geometry.GetProjection(axis, tri2.vertices);
            if (!Geometry.Overlap(p1, p2)) {
                return null;
            } else {
                let o = Geometry.GetOverlap(p1, p2);
                if (o < overlap) {
                    overlap = o;
                    smallestAxis = axis;
                }
            }
        }

        return Vector2.Mul(smallestAxis, overlap);
    }

    private static BroadCollisionCheck(collider: Collider, collider2: Collider): boolean {
        let aabb1 = collider.GetAABB();
        let aabb2 = collider2.GetAABB();
        return Geometry.AABBOverlap(aabb1, aabb2);
    }
}

export class TriangleCollider extends Collider {
    Start: () => void;
    name: string = "TriangleCollider2D";

    offset: Vector2 = new Vector2(0, 0);
    vertexA: Vector2 = new Vector2(0, 0);
    vertexB: Vector2 = new Vector2(0, 0);
    vertexC: Vector2 = new Vector2(0, 0);
    vertices: Array<Vector2> = new Array<Vector2>(3);

    drawCorners: boolean = false;
    vertexGizmos: Array<PIXI.Graphics>;

    Enable = () => {
        this.vertexGizmos = new Array<PIXI.Graphics>(3);
        for (let giz of this.vertexGizmos) {
            giz = new PIXI.Graphics;
        }

        let rb = this.gameObject?.GetComponent(Rigidbody) as Rigidbody;
        if (rb) {
            this.attachedRigidbody = rb;
        } else {
            this.SetEnabled(false);
        }
    }

    Update = (): void => {
        if (this.drawCorners) {
            for (let i = 0; i < this.vertices.length; i++) {
                this.gameObject.scene.container.removeChild(this.vertexGizmos[i]);
                this.vertexGizmos[i] = Gizmos.DrawPoint(this.vertices[i], 3, 0x22ff00, 1, 0x336699);
                this.gameObject.scene.container.addChild(this.vertexGizmos[i]);
            }
        }
    };

    FixedUpdate = () => {
        this.SetVertices();
        let rb = this.attachedRigidbody;

        if (this.attachedRigidbody != null && !this.isTrigger) {
            // I = (bh^3) / 36
            this.attachedRigidbody.inertia = rb.mass *
                (Math.pow(this.vertexA.Sub(this.vertexC.Sub(this.vertexB).Div(2)).Mag(), 3) * this.vertexC.Sub(this.vertexB).Div(2).Mag()) / 36;
        }
    };

    GetAABB(): AABB {
        this.SetVertices();
        return Geometry.GetAABB(this.vertices);
    }

    GetSeparatingAxes(): Array<Vector2> {
        let normals = new Array<Vector2>();
        this.SetVertices();

        let edge1 = this.vertices[1].Sub(this.vertices[0]);
        let edge2 = this.vertices[2].Sub(this.vertices[1]);
        let edge3 = this.vertices[0].Sub(this.vertices[2]);

        normals.push(edge1.LeftNormal().Normalized());
        normals.push(edge2.LeftNormal().Normalized());
        normals.push(edge3.LeftNormal().Normalized());

        return normals;
    }

    private SetVertices(): void {
        this.vertices[0] = (Vector2.FromPoint(this.gameObject.absoluteTransform.position).Add(this.offset).Add(this.vertexA.SimpleMult(Vector2.FromPoint(this.gameObject.absoluteTransform.scale)).Rotate(this.gameObject.absoluteTransform.rotation)));
        this.vertices[1] = (Vector2.FromPoint(this.gameObject.absoluteTransform.position).Add(this.offset).Add(this.vertexB.SimpleMult(Vector2.FromPoint(this.gameObject.absoluteTransform.scale)).Rotate(this.gameObject.absoluteTransform.rotation)));
        this.vertices[2] = (Vector2.FromPoint(this.gameObject.absoluteTransform.position).Add(this.offset).Add(this.vertexC.SimpleMult(Vector2.FromPoint(this.gameObject.absoluteTransform.scale)).Rotate(this.gameObject.absoluteTransform.rotation)));
    }

    public ComputeBestEdge(mtv: Vector2): Edge {
        let max = -100000;
        let index = 0;
        for (let i = 0; i < 3; i++) {
            let proj = mtv.Normalized().Dot(this.vertices[i]);
            if (proj > max) {
                max = proj;
                index = i;
            }
        }

        let l = this.vertices[index].Sub(this.vertices[(index + 4) % 3]).Normalized();
        let r = this.vertices[index].Sub(this.vertices[(index + 2) % 3]).Normalized();
        if (r.Dot(mtv.Normalized()) <= l.Dot(mtv.Normalized())) {
            return new Edge(this.vertices[index], this.vertices[(index + 2) % 3], this.vertices[index]);
        } else {
            return new Edge(this.vertices[index], this.vertices[index], this.vertices[(index + 4) % 3]);
        }
    }
}

export class BoxCollider extends Collider {
    Start: () => void;
    name: string = "BoxCollider2D";

    size: Vector2 = new Vector2(1, 1);
    offset: Vector2 = new Vector2(0, 0);
    vertices: Array<Vector2>;

    drawCorners: boolean = false;
    vertexGizmos: Array<PIXI.Graphics>;

    Enable = () => {
        this.vertexGizmos = new Array<PIXI.Graphics>(4);
        for (let giz of this.vertexGizmos) {
            giz = new PIXI.Graphics;
        }

        let rb = this.gameObject?.GetComponent(Rigidbody) as Rigidbody;
        if (rb) {
            this.attachedRigidbody = rb;
        } else {
            this.SetEnabled(false);
        }
    }

    Update = (): void => {
        if (this.drawCorners) {
            for (let i = 0; i < this.vertices.length; i++) {
                this.gameObject.scene.container.removeChild(this.vertexGizmos[i]);
                this.vertexGizmos[i] = Gizmos.DrawPoint(this.vertices[i], 3, 0x22ff00, 1, 0x336699);
                this.gameObject.scene.container.addChild(this.vertexGizmos[i]);
            }
        }
    };

    FixedUpdate = () => {
        this.SetVertices();
        let rb = this.attachedRigidbody;
        if (this.attachedRigidbody != null && !this.isTrigger) {
            // I = (x^2 y^2) / 12
            this.attachedRigidbody.inertia = rb.mass * (this.size.x * this.size.x + this.size.y * this.size.y) / 12;
        }
    };

    GetAABB(): AABB {
        this.SetVertices();
        return Geometry.GetAABB(this.vertices);
    }

    GetSeparatingAxes(): Array<Vector2> {
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
