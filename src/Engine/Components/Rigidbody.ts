import {Component} from "./Component";
import {Gameobject} from "../Gameobject";
import {Time} from "../Time";
import {Vector2} from "../Vector2";

export enum ForceMode {
    Force,
    Impulse,
    VelocityChange,
    Acceleration,
}

export class Rigidbody extends Component
{
    gameObject: Gameobject;
    name: string = "Rigidbody";
    mass: number = 0;
    velocity: Vector2 = new Vector2(0, 0);
    angularVelocity: number = 0;
    inertia: number = 0;
    torque: number = 0;
    useGravity: boolean = true;
    force: Vector2 = new Vector2(0, 0);
    acceleration: Vector2 = new Vector2(0, 0);
    angularAcceleration = 0;
    elasticity: number = 0;
    isStatic: boolean = false;
    isAsleep: boolean = false;

    FixedUpdate = (): void => {
        if (!this.isStatic && this.mass > 0 && !this.isAsleep) {
            if (this.useGravity && this.acceleration.y == 0) this.acceleration.y = 9.81;
            this.velocity = this.velocity.Add(this.acceleration.Add(this.force.Div(this.mass)).Mul(Time.fixedDeltaTime()));
            this.angularVelocity += (this.angularAcceleration + this.torque / this.inertia) * Time.fixedDeltaTime();
        }
    };

    Update = (): void => {
        if (!this.isStatic && this.mass > 0 && !this.isAsleep) {
            this.gameObject.transform.position.x += this.velocity.x * Time.deltaTime();
            this.gameObject.transform.position.y += this.velocity.y * Time.deltaTime();
            this.gameObject.transform.rotation += this.angularVelocity * Time.deltaTime();
        }
    };

    SetAsleep() {
        this.isAsleep = true;
        this.velocity = Vector2.Zero();
        this.angularVelocity = 0;
    }

    AddForce(force: Vector2, mode: ForceMode) {
        if (!this.isStatic && this.mass > 0) {
            switch (mode) {
                case ForceMode.Force:
                    this.force = this.force.Add(force);
                    break;
                case ForceMode.Impulse:
                    this.velocity = this.velocity.Add(Vector2.Div(force, this.mass));
                    break;
                case ForceMode.VelocityChange:
                    this.velocity = this.velocity.Add(force);
                    break;
                case ForceMode.Acceleration:
                    this.acceleration = this.acceleration.Add(force);
                    break;
            }
        }
    }

    AddTorque(torque: number, mode: ForceMode) {
        if (!this.isStatic && this.inertia > 0) {
            switch (mode) {
                case ForceMode.Force:
                    this.torque += torque;
                    break;
                case ForceMode.Impulse:
                    this.angularVelocity += torque / this.inertia;
                    break;
                case ForceMode.VelocityChange:
                    this.angularVelocity += torque;
                    break;
                case ForceMode.Acceleration:
                    this.angularAcceleration += torque;
                    break;
            }
        }
    }
}
