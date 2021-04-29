import {Component} from "./Component";
import {Vector2} from "../Vector2";
import {ForceMode, Rigidbody} from "./Rigidbody";
import Application from "../Application";
import {ClippingPlane, Geometry} from "../Geometry";
import {BoxCollider} from "./BoxCollider";

export abstract class Collider extends Component {
    isTrigger: boolean = false;
    attachedRigidbody: Rigidbody;
    application: Application;

    static bounciness: number = .7;

    abstract Collision(other: Collider): Vector2;

    abstract GetSeperatingAxes(): Array<Vector2>;

    abstract GetProjection(axis: Vector2): Vector2;

    private static MovableRigidbody(c: Collider): boolean {
        return !(c?.attachedRigidbody == null || c.attachedRigidbody.isStatic || c.attachedRigidbody.mass === 0);
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
        if (c1 instanceof BoxCollider && c2 instanceof BoxCollider) {
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
        if (c1 instanceof BoxCollider && c2 instanceof BoxCollider) {
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

    public Enable = (): void => {

    };
}

//TODO: Export
export class CircleCollider extends Collider {
    name: string = "CircleCollider2D";
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
