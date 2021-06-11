import {Component} from "./Component";
import {Gameobject} from "../Gameobject";
import {Vector2} from "../Math/Vector2";
import {Rigidbody} from "./Rigidbody";
import {Gizmos} from "../Gizmos";

export class SpringJoint extends Component {
    gameObject: Gameobject;

    public attachedObject: Gameobject;
    public Spring: number = 1;
    public Damper: number = .1;
    public Frequency: number = 1;
    public Distance: number = 100;
    public BreakForce: number = Infinity;
    public EnableCollision: boolean = false;

    private _lineGizmos: PIXI.Graphics = new PIXI.Graphics();
    private _lineColor: number = 0xFFFFFF;
    public showSpringStrain: boolean = false;

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
        this._lineGizmos = Gizmos.DrawLine(Vector2.FromPoint(this.gameObject.absoluteTransform.position),
            Vector2.FromPoint(this.attachedObject.absoluteTransform.position), 5, this._lineColor);
        this.gameObject.scene.container.addChild(this._lineGizmos);
    }

    GetForce(go: Gameobject, pos: Vector2, velo: Vector2): Vector2 {
        let dir, dist;
        const attached_pos = (go === this.gameObject) ? Vector2.FromPoint(this.attachedObject.absoluteTransform.position) : Vector2.FromPoint(this.gameObject.absoluteTransform.position);
        dist = pos.Sub(attached_pos).Mag();
        dir = pos.Sub(attached_pos).Normalized();

        let force = dir.Mul(-this.Spring * (dist - this.Distance)).Sub(velo.Mul(this.Damper));
        if (this.showSpringStrain) {
            this._lineColor = Math.round(force.Mag() / 100 * 256) * 256 * 256 + (256 - Math.round(force.Mag() / 100 * 256));
        } else {
            this._lineColor = 0xFFFFFF;
        }

        return force;
    }

    AttachObject(go: Gameobject) {
        this.attachedObject = go;
        this.SetEnabled(true);
    }
}
