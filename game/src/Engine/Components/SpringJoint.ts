import {Component} from "./Component";
import {Gameobject} from "../Gameobject";
import {Vector2} from "../Math/Vector2";
import {Rigidbody} from "./Rigidbody";
import {Gizmos} from "../Gizmos";
import {Debug} from "../Debug";

export class SpringJoint extends Component {
    name: string = "SpringJoint"
    gameObject: Gameobject;

    public attachedObject: Gameobject;
    public Spring: number = 1;
    public Damper: number = 1;
    public Frequency: number = 1;
    public Distance: number = 100;
    public BreakForce: number = Infinity;
    public EnableCollision: boolean = false;

    public _broken = false;

    private _lineGizmos: PIXI.Graphics = new PIXI.Graphics();
    private _lineColor: number = 0xFFFFFF;
    public showSpringStrain: boolean = false;

    public offsetStart: Vector2 = Vector2.Zero();
    public offsetEnd: Vector2 = Vector2.Zero();

    public maxForce: number = 1000;

    Enable = (): void => {
        let rb1 = this.gameObject?.GetComponent(Rigidbody) as Rigidbody;
        let rb2 = this.attachedObject?.GetComponent(Rigidbody) as Rigidbody;
        if (rb1 && rb2) {
            rb1.attachedSprings.push(this);
            rb2.attachedSprings.push(this);
        } else {
            this.SetEnabled(false);
        }
    }

    Update = (): void => {
        this.gameObject.scene.container.removeChild(this._lineGizmos);
        if (!this._broken) {
            this._lineGizmos = Gizmos.DrawLine(Vector2.FromPoint(this.gameObject.absoluteTransform.position).Add(this.offsetStart.Rotate(this.gameObject.transform.rotation)),
                Vector2.FromPoint(this.attachedObject.absoluteTransform.position).Add(this.offsetEnd.Rotate(this.attachedObject.transform.rotation)), 5, this._lineColor);
            this.gameObject.scene.container.addChild(this._lineGizmos);
        }
    }

    GetForce(go: Gameobject, pos: Vector2, velo: Vector2): [Vector2, Vector2] {
        if (!this._broken && this.enabled) {
            let dir, dist;
            let attachedPos, thisPos;
            if (go === this.gameObject) {
                attachedPos = Vector2.FromPoint(this.attachedObject.transform.position).Add(this.offsetEnd.Rotate(this.attachedObject.transform.rotation));
                thisPos = pos.Add(this.offsetStart.Rotate(this.gameObject.transform.rotation));
            } else {
                attachedPos = Vector2.FromPoint(this.gameObject.transform.position).Add(this.offsetStart.Rotate(this.gameObject.transform.rotation));
                thisPos = pos.Add(this.offsetEnd.Rotate(this.attachedObject.transform.rotation));
            }

            dist = thisPos.Sub(attachedPos).Mag();
            dir = thisPos.Sub(attachedPos).Normalized();

            let force = dir.Mul(-this.Spring * (dist - this.Distance)).Sub(velo.Mul(this.Damper));
            if (force.Mag() > this.maxForce) this.maxForce = force.Mag();
            if (Debug.drawForceColor && this.BreakForce !== Infinity) {
                this._lineColor = Math.round(force.Mag() / this.BreakForce * 256) * 256 * 256 + (0x0000FF - Math.round(force.Mag() / this.BreakForce * 256));
            } else if (Debug.drawForceColor) {
                this._lineColor = Math.round(force.Mag() / this.maxForce * 256) * 256 * 256 + (0x0000FF - Math.round(force.Mag() / this.maxForce * 256));
            } else {
                this._lineColor = 0xFFFFFF;
            }

            if (force.Mag() > this.BreakForce) {
                this._broken = true;
                return [Vector2.Zero(), Vector2.Zero()];
            }

            return [force, (go !== this.gameObject) ? this.offsetEnd.Rotate(this.attachedObject.transform.rotation) : this.offsetStart.Rotate(this.gameObject.transform.rotation)];
        } else {
            return [Vector2.Zero(), Vector2.Zero()];
        }
    }

    AttachObject(go: Gameobject) {
        this.attachedObject = go;
        this.SetEnabled(true);
    }
}
