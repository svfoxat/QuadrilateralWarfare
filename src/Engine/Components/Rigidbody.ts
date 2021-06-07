import {Component} from "./Component";
import {Gameobject} from "../Gameobject";
import {Time} from "../Time";
import {Vector2} from "../Math/Vector2";
import {SpringJoint} from "./SpringJoint";
import {Forcefield} from "../Forcefield";

export enum ForceMode {
    Force,
    Impulse,
    VelocityChange,
    Acceleration,
}

export class Rigidbody extends Component {
    gameObject: Gameobject;
    name: string = "Rigidbody";
    mass: number = 1;
    velocity: Vector2 = new Vector2(0, 0);
    angularVelocity: number = 0;
    inertia: number = 0;
    torque: number = 0;
    useGravity: boolean = true;
    globalForce: Vector2 = Vector2.Zero();
    localForce: Vector2 = Vector2.Zero();
    acceleration: Vector2 = Vector2.Zero();
    angularAcceleration = 0;
    elasticity: number = 0;
    isStatic: boolean = false;
    isAsleep: boolean = false;

    attachedSpring: SpringJoint = null;

    verletVelocity: boolean;

    FixedUpdate = (): void => {
        if (this.verletVelocity) {
            if (this.attachedSpring) {
                this.velocity_verlet(Vector2.FromPoint(this.gameObject.absoluteTransform.position), this.acceleration, Time.fixedDeltaTime());
            }
        }

        if (!this.verletVelocity && !this.isStatic && this.mass > 0 && !this.isAsleep) {
            if (this.useGravity && this.acceleration.y == 0) this.acceleration.y = 9.81;
            this.velocity = this.velocity.Add(this.acceleration.Add(this.globalForce.Div(this.mass)).Mul(Time.fixedDeltaTime()));
            this.angularVelocity += (this.angularAcceleration + this.torque / this.inertia) * Time.fixedDeltaTime();

            this.gameObject.transform.position.x += this.velocity.x * Time.fixedDeltaTime();
            this.gameObject.transform.position.y += this.velocity.y * Time.fixedDeltaTime();
            this.gameObject.transform.rotation += this.angularVelocity * Time.fixedDeltaTime();
        }
    };

    GetSumForcesAt(pos: Vector2): Vector2 {
        return this.GetGlobalForce(pos).Add(this.GetLocalForce(pos));
    }

    GetGlobalForce(pos: Vector2): Vector2 {
        return Forcefield.GetForceAtPosition(pos);
    }

    GetLocalForce(pos: Vector2): Vector2 {
        let springForce = Vector2.Zero();
        if (this.attachedSpring) {
            springForce = this.attachedSpring.GetForce(pos);
        }

        return springForce;
    }

    Update = () => {
    }

    SetAsleep() {
        this.isAsleep = true;
        this.velocity = Vector2.Zero();
        this.angularVelocity = 0;
    }

    AddForce(force: Vector2, mode: ForceMode) {
        if (!this.isStatic && this.mass > 0) {
            switch (mode) {
                case ForceMode.Force:
                    this.globalForce = this.globalForce.Add(force);
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

    private velocity_verlet(pos: Vector2, acceleration: Vector2, timestep: number) {
        let time: number = 0.0;
        let newVel = this.velocity;
        let newPos = pos;
        let newAcc = Vector2.Zero();

        for (let i = 0; i < 1; i++) {
            newPos.x += this.velocity.x * timestep + 0.5 * acceleration.x * timestep * timestep;
            newPos.y += this.velocity.y * timestep + 0.5 * acceleration.y * timestep * timestep;

            newAcc = this.GetSumForcesAt(pos);

            newVel.x += acceleration.x * timestep;
            newVel.y += acceleration.y * timestep;

            time += timestep;

            this.acceleration = newAcc;
            this.gameObject.transform.position = newPos.AsPoint();
            this.velocity = newVel;
        }
    }
}
