import {Component} from "./Component";
import {Collider} from "./Collider";
import {Gameobject} from "../Gameobject";
import {Vector2} from "../Math/Vector2";
import {Rigidbody} from "./Rigidbody";

export class SpringJoint extends Component {
    gameObject: Gameobject;

    public attachedObject: Gameobject;
    public Spring: number = 1;
    public Damper: number = .1;
    public Frequency: number = 1;
    public Distance: number = 100;
    public BreakForce: number = Infinity;
    public EnableCollision: boolean = false;

    Enable = (): void => {
    }

    Start = (): void => {
    }
    OnCollision = (other: Collider): void => {
    }
    OnDestroy = (): void => {
    }
    Update = (): void => {
    }

    FixedUpdate = (): void => {
        const rb = this.attachedObject.GetComponent(Rigidbody) as Rigidbody;
        if (rb) {
            if (rb.attachedSpring == null)
                rb.attachedSpring = this;
        }
    }

    GetForce(pos: Vector2, velo: Vector2): Vector2 {
        const attached_pos = Vector2.FromPoint(this.gameObject.absoluteTransform.position);
        let dist = attached_pos.Sub(pos).Mag();
        let dir = attached_pos.Sub(pos).Normalized();

        return dir.Mul(this.Spring * (dist - this.Distance)).Sub(velo.Mul(this.Damper));
    }
}
