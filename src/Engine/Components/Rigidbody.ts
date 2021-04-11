import {Component} from "./Component";
import {Gameobject} from "../Gameobject";
import {Vector3} from "../Vector3";
import {Time} from "../Time";

export enum ForceMode {
    Force,
    Impulse,
    VelocityChange,
    Acceleration,
}

export class Rigidbody extends Component
{
    gameObject: Gameobject;
    _name: string = "Rigidbody";
    mass: number = 0;
    velocity: Vector3 = new Vector3(0,0,0);
    angularVelocity: number = 0;
    inertia: number = 1;
    torque: number = 0;
    useGravity: boolean = true;
    force: Vector3 = new Vector3(0, 0, 0);
    acceleration: Vector3 = new Vector3(0, 0, 0);
    angularAcceleration = 0;
    isColliding: boolean = false;

    Update = (): void => {
    };

    FixedUpdate = (): void => {
        if (this.mass > 0) {
            if (this.useGravity && this.acceleration.y == 0) this.acceleration.y = .981;
            this.velocity = Vector3.Add(this.velocity, Vector3.Mult(Vector3.Add(this.acceleration, Vector3.Div(this.force, this.mass)), Time.fixedDeltaTime()));

            this.angularVelocity += (this.angularAcceleration + this.torque / this.inertia) * Time.fixedDeltaTime();

            this.gameObject.transform.position.x += this.velocity.x * Time.fixedDeltaTime();
            this.gameObject.transform.position.y += this.velocity.y * Time.fixedDeltaTime();
            this.gameObject.transform.rotation += this.angularVelocity * Time.fixedDeltaTime();
        } else {
            this.velocity = Vector3.Zero();
            this.angularVelocity = 0;
        }
    };

    AddForce(force: Vector3, mode: ForceMode) {
        if (this.mass > 0) {
            switch (mode) {
                case ForceMode.Force:
                    this.force = Vector3.Add(this.force, force);
                    break;
                case ForceMode.Impulse:
                    this.velocity = Vector3.Add(this.velocity, Vector3.Div(force, this.mass));
                    break;
                case ForceMode.VelocityChange:
                    this.velocity = Vector3.Add(this.velocity, force);
                    break;
                case ForceMode.Acceleration:
                    this.acceleration = Vector3.Add(this.acceleration, force);
                    break;
            }
        }
    }

    AddTorque(torque: number, mode: ForceMode) {
        if (this.mass > 0) {
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

    AddForceAtPosition(force: Vector3, position: Vector3, mode: ForceMode) {
        if (this.mass > 0) {
            switch (mode) {
                case ForceMode.Force:
                    break;
                case ForceMode.Impulse:
                    this.velocity = Vector3.Add(this.velocity, Vector3.Div(force, this.mass));
                    this.angularVelocity += Vector3.Cross(force, position).Mag() / this.inertia;
                    break;
                case ForceMode.VelocityChange:
                    break;
                case ForceMode.Acceleration:
                    break;
            }
        }
    }
}
