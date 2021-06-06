import {Component} from "./Component";
import {Collider} from "./Collider";
import {Gameobject} from "../Gameobject";
import {Vector2} from "../Math/Vector2";
import {ForceMode, Rigidbody} from "./Rigidbody";
import {Time} from "../Time";
import {Gizmos} from "../Gizmos";

export class SpringJoint extends Component {
    gameObject: Gameobject;
    private _restingPos: PIXI.Transform = null;


    public attachedObject: Gameobject;
    public Spring: number = 5;
    public Damper: number = 0;
    public MinDistance: number = 100;
    public MaxDistance: number = 500;
    public Tolerance: number = 0;
    public BreakForce: number = Infinity;
    public BreakTorque: number = Infinity;
    public EnableCollision: boolean = false;


    Enable = (): void => {
        this._restingPos = this.gameObject.absoluteTransform;
    }

    Start = (): void => {}
    OnCollision = (other: Collider): void => {}
    OnDestroy = (): void => {}

    Update = (): void => {}

    FixedUpdate = (): void => {

        // this
        const {position} = this.gameObject.transform;
        const pos = new Vector2(position.x, position.y);

        // attached
        const attached_pos = new Vector2(this.attachedObject.absoluteTransform.position.x,
            this.attachedObject.absoluteTransform.position.y)

        const rb = this.attachedObject.GetComponent(Rigidbody) as Rigidbody;
        if (rb) {
            let distance = pos.Sub(attached_pos);
            const dist_num = Math.sqrt(
                Math.pow(pos.x - attached_pos.x,2) +
                Math.pow(pos.y - attached_pos.y,2)
            )

            const springForce = new Vector2(
                this.Spring * distance.x,
                this.Spring * distance.y,
            );
            const dampingForce = new Vector2(rb.velocity.x * this.Damper, rb.velocity.y * this.Damper);

            const force = new Vector2(
                springForce.x - dampingForce.x,
                springForce.y + rb.mass * 10 - dampingForce.y
            );

            const acceleration = new Vector2(force.x / rb.mass, force.y / rb.mass);

            let velocity = new Vector2(
                rb.velocity.x + acceleration.x * Time.fixedDeltaTime(),
                rb.velocity.y + acceleration.y * Time.fixedDeltaTime()
            );

          console.log(acceleration)
          rb.acceleration = acceleration;
        }
    }
}
