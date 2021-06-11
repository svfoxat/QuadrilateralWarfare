import {Component} from "./Component";
import {Gameobject} from "../Gameobject";
import {Time} from "../Time";
import {Vector2} from "../Math/Vector2";
import {SpringJoint} from "./SpringJoint";
import {Forcefield} from "../Forcefield";
import {BoxCollider, TriangleCollider} from "./Collider";

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
    inertia: number = 1;
    torque: number = 0;
    useGravity: boolean = false;
    globalForce: Vector2 = Vector2.Zero();
    localForce: Vector2 = Vector2.Zero();
    acceleration: Vector2 = Vector2.Zero();
    angularAcceleration = 0;
    elasticity: number = 0;
    isStatic: boolean = false;
    isAsleep: boolean = false;

    attachedSprings: Array<SpringJoint> = new Array<SpringJoint>();

    verletVelocity: boolean;

    Enable = () => {
        let tri = this.gameObject?.GetComponent(TriangleCollider) as TriangleCollider;
        if (tri) {
            tri.attachedRigidbody = this;
            tri.SetEnabled(true);
        }

        let box = this.gameObject?.GetComponent(BoxCollider) as BoxCollider;
        if (box) {
            box.attachedRigidbody = this;
            box.SetEnabled(true);
        }
    }

    FixedUpdate = (): void => {
        if (this.inertia > 0 && !this.isStatic && this.mass > 0 && !this.isAsleep) {
            if (this.verletVelocity) {
                this.velocity_verlet(Time.fixedDeltaTime());
            }

            if (!this.verletVelocity) {
                this.velocity = this.velocity.Add(this.acceleration.Add(this.GetSumForcesAt(Vector2.FromPoint(this.gameObject.absoluteTransform.position)).Div(this.mass)).Mul(Time.fixedDeltaTime()));
                this.angularVelocity += (this.angularAcceleration + this.torque / this.inertia) * Time.fixedDeltaTime();

                this.gameObject.transform.position.x += this.velocity.x * Time.fixedDeltaTime();
                this.gameObject.transform.position.y += this.velocity.y * Time.fixedDeltaTime();
                this.gameObject.transform.rotation += this.angularVelocity * Time.fixedDeltaTime();
            }
        }
    };

    GetSumForcesAt(pos: Vector2): Vector2 {
        return this.globalForce.Add(this.GetGlobalForce(pos).Add(this.GetLocalForce(pos)));
    }

    GetGlobalForce(pos: Vector2): Vector2 {
        return Forcefield.GetForceAtPosition(pos);
    }

    GetLocalForce(pos: Vector2): Vector2 {
        let springForce = Vector2.Zero();
        if (this.attachedSprings.length > 0) {
            for (const spring of this.attachedSprings) {
                springForce = springForce.Add(spring.GetForce(this.gameObject, pos, this.velocity));
            }
        }
        return springForce;
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

    private velocity_verlet(timestep: number) {
        let newVel = this.velocity;
        let newPos = this.gameObject.transform.position;
        let newAcc = Vector2.Zero();

        for (let i = 0; i < 1; i++) {
            newPos.x += this.velocity.x * timestep + 0.5 * this.acceleration.x * timestep * timestep;
            newPos.y += this.velocity.y * timestep + 0.5 * this.acceleration.y * timestep * timestep;

            newAcc = this.GetSumForcesAt(Vector2.FromPoint(newPos));

            newVel.x += 0.5 * (newAcc.x + this.acceleration.x) * timestep;
            newVel.y += 0.5 * (newAcc.y + this.acceleration.y) * timestep;

            this.acceleration = newAcc;
            this.gameObject.transform.position = newPos;
            this.velocity = newVel;

            this.angularVelocity += (this.angularAcceleration + this.torque / this.inertia) * timestep;
            this.gameObject.transform.rotation += this.angularVelocity * timestep;
        }
    }
}
