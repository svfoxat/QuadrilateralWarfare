import {Component} from "./Component";
import {Gameobject} from "../Gameobject";
import {Time} from "../Time";
import {Vector2} from "../Math/Vector2";
import {SpringJoint} from "./SpringJoint";
import {Forcefield} from "../Forcefield";
import {BoxCollider, TriangleCollider} from "./Collider";
import {Gizmos} from "../Gizmos";

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

    linearVector: PIXI.Graphics = new PIXI.Graphics();
    angularVector: PIXI.Graphics = new PIXI.Graphics();
    velocityDrawThreshold: number = 0.5;
    angularVelocityDrawThreshold: number = 0.05;
    static drawMomentum: boolean = false;

    forceThreshold = 0.5;
    forceVector: PIXI.Graphics = new PIXI.Graphics();
    static drawForce: boolean = false;

    springForceThreshold = 0.5;
    springForceVector: PIXI.Graphics = new PIXI.Graphics();
    static springDrawForce: boolean = false;

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

    OnDestroy = (): void => {
        this.gameObject.scene.container.removeChild(this.linearVector);
        this.gameObject.scene.container.removeChild(this.angularVector);
        this.gameObject.scene.container.removeChild(this.forceVector);

    }

    Update = (): void => {
        this.gameObject.scene.container.removeChild(this.linearVector);
        this.gameObject.scene.container.removeChild(this.angularVector);
        this.gameObject.scene.container.removeChild(this.forceVector);
        this.gameObject.scene.container.removeChild(this.springForceVector);

        if (this.enabled && !this.isAsleep) {
            let pos = Vector2.FromPoint(this.gameObject.absoluteTransform.position);
            if (Rigidbody.drawMomentum) {
                if (this.velocity.Mag() > this.velocityDrawThreshold) {
                    this.linearVector = Gizmos.DrawArrow(pos, pos.Add(this.velocity), 3, 0x00FF00);
                    this.gameObject.scene.container.addChild(this.linearVector);
                }
                if (this.angularVelocity > this.angularVelocityDrawThreshold) {
                    this.angularVector = Gizmos.DrawArrow(pos.Add(this.velocity),
                        pos.Add(this.velocity).Add(this.velocity.LeftNormal().Normalized().Mul(this.angularVelocity / (2 * Math.PI) * 200)), 3, 0x0000FF);
                    this.gameObject.scene.container.addChild(this.angularVector);
                }
            }

            if (Rigidbody.drawForce) {
                let force = this.GetSumForcesAt(pos)[0];
                if (force.Mag() > this.forceThreshold) {
                    this.forceVector = Gizmos.DrawArrow(pos, pos.Add(force), 3, 0xFF0000);
                    this.gameObject.scene.container.addChild(this.forceVector);
                }
            }

            if (Rigidbody.springDrawForce) {
                let force = this.GetLocalForce(pos)[0];
                if (force.Mag() > this.springForceThreshold) {
                    this.springForceVector = Gizmos.DrawArrow(pos, pos.Add(force), 3, 0xFF0000);
                    this.gameObject.scene.container.addChild(this.springForceVector);
                }
            }
        }
    }

    FixedUpdate = (): void => {
        if (this.inertia > 0 && !this.isStatic && this.mass > 0 && !this.isAsleep) {
            if (this.verletVelocity) {
                this.velocity_verlet(Time.fixedDeltaTime());
            }

            if (!this.verletVelocity) {
                let forces = this.GetSumForcesAt(Vector2.FromPoint(this.gameObject.absoluteTransform.position));
                this.velocity = this.velocity.Add(this.acceleration.Add(forces[0]).Mul(Time.fixedDeltaTime()));
                this.angularVelocity += (this.angularAcceleration + forces[1]) * Time.fixedDeltaTime();

                this.gameObject.transform.position.x += this.velocity.x * Time.fixedDeltaTime();
                this.gameObject.transform.position.y += this.velocity.y * Time.fixedDeltaTime();
                this.gameObject.transform.rotation += this.angularVelocity * Time.fixedDeltaTime();
            }
        }
    };

    GetSumForcesAt(pos: Vector2): [Vector2, number] {
        return [this.globalForce.Add(this.GetGlobalForce(pos).Add(this.GetLocalForce(pos)[0])).Div(this.mass), this.GetLocalForce(pos)[1] / this.inertia];
    }

    GetGlobalForce(pos: Vector2): Vector2 {
        return Forcefield.GetForceAtPosition(pos, this.mass);
    }

    GetLocalForce(pos: Vector2): [Vector2, number] {
        let springLinForce = Vector2.Zero();
        let springAngForce = 0;
        if (this.attachedSprings.length > 0) {
            for (const spring of this.attachedSprings) {
                let springF = spring.GetForce(this.gameObject, pos, this.velocity);
                let f = springF[0];
                let r = springF[1];

                if (r.Mag() > 0) {
                    springLinForce = springLinForce.Add(f);
                    springAngForce -= f.Cross(r);
                } else {
                    springLinForce = springLinForce.Add(f);
                }
            }
        }
        return [springLinForce, springAngForce];
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

        let newRot = this.gameObject.transform.rotation;
        let newAngVel = this.angularVelocity;
        let newAngAcc = 0;

        for (let i = 0; i < 1; i++) {
            newPos.x += this.velocity.x * timestep + 0.5 * this.acceleration.x * timestep * timestep;
            newPos.y += this.velocity.y * timestep + 0.5 * this.acceleration.y * timestep * timestep;
            newRot += this.angularVelocity * timestep + 0.5 * this.angularAcceleration * timestep * timestep;

            let sum = this.GetSumForcesAt(Vector2.FromPoint(newPos));
            newAcc = sum[0];
            newAngAcc = sum[1];

            newVel.x += 0.5 * (newAcc.x + this.acceleration.x) * timestep;
            newVel.y += 0.5 * (newAcc.y + this.acceleration.y) * timestep;
            newAngVel += 0.5 * (newAngAcc + this.angularAcceleration) * timestep;

            this.acceleration = newAcc;
            this.gameObject.transform.position = newPos;
            this.velocity = newVel;

            this.angularAcceleration = newAngAcc;
            this.angularVelocity = newAngVel;
            this.gameObject.transform.rotation = newRot;

            // this.angularVelocity += (this.angularAcceleration + this.torque / this.inertia) * timestep;
            // this.gameObject.transform.rotation += this.angularVelocity * timestep;
        }
    }
}
