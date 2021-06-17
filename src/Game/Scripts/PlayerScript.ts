import {Component} from "../../Engine/Components/Component";
import {Gameobject} from "../../Engine/Gameobject";
import {SpringJoint} from "../../Engine/Components/SpringJoint";
import {Point} from "pixi.js";
import {Rigidbody} from "../../Engine/Components/Rigidbody";
import {Vector2} from "../../Engine/Math/Vector2";

export class PlayerScript extends Component {
    public catapult: Gameobject;
    public spring: SpringJoint;
    public rigidbody: Rigidbody;
    public springForce: number = 10;
    public deadZone: number = 50;
    public pressed: boolean = false;
    public triggered: boolean;
    public reset: boolean = false;

    FixedUpdate = () => {
        if (this.catapult && !this.pressed && this.catapult.absoluteTransform && this.gameObject.absoluteTransform.position.x > this.catapult.absoluteTransform.position.x + this.deadZone) {
            if (this.spring) {
                this.spring.BreakForce = this.springForce;
                this.triggered = true;
            }
        }
    }

    OnMouseDown = () => {
        this.pressed = true;
        if (this.triggered) {
            this.reset = true;
        }
    }

    OnMouseUp = () => {
        this.pressed = false;
        if (this.reset) {
            this.Reset();
        }
    }

    private Reset() {
        this.gameObject.transform.position = new Point(400, 800);
        if (this.rigidbody) {
            this.rigidbody.velocity = Vector2.Zero();
            this.rigidbody.angularVelocity = 0;
        }

        if (this.spring) {
            this.spring.BreakForce = Infinity;
            this.spring._broken = false;
        }
        this.triggered = false;
        this.reset = false;
    }
}
