import {Vector2} from "../Math/Vector2";
import {Component} from "./Component";
import {Time} from "../Time";
import {Forcefield} from "../Forcefield";
import {ODESolver} from "../Math/ODESolver";
import {RungeKuttaSolver} from "../Math/RungeKuttaSolver";
import {EulerSolver} from "../Math/EulerSolver";
import {Scene} from "../Scene";
import {Gizmos} from "../Gizmos";

export class Particle {
    sprite: PIXI.Sprite;
    pos: Vector2 = Vector2.Zero();
    velocity: Vector2 = Vector2.Zero();
    color: number = 0x000000;
    life: number = 0;
    mass: number = 1;

    maxTrajectoryPoints: number = 10;
    trajectoryPoints: Array<PIXI.Graphics> = new Array<PIXI.Graphics>(this.maxTrajectoryPoints);
    trajectoryPointIndex: number = 0;

    AddTrajectoryPoint(scene: Scene) {
        scene.container.removeChild(this.trajectoryPoints[this.trajectoryPointIndex]);
        this.trajectoryPoints[this.trajectoryPointIndex] = Gizmos.DrawPoint(this.pos, 2, 0xFF00FF, 1, 0x00FF00);
        scene.container.addChild(this.trajectoryPoints[this.trajectoryPointIndex]);
        this.trajectoryPointIndex = (this.trajectoryPointIndex + 1) % this.maxTrajectoryPoints;
    }

    DeleteTrajectory(scene: Scene) {
        for (let point of this.trajectoryPoints) {
            scene.container.removeChild(point);
        }
    }

    solver: ODESolver;
}

export class ParticleSystem extends Component {
    name: string = "ParticleSystem"

    texture: PIXI.Texture;
    baseColor: number;
    amount: number;
    newParticles: number;
    ttl: number;
    initVelocity: Vector2;
    offset: Vector2;
    particles: Array<Particle>;
    lastUsedParticle: number = 0;
    stepSize: number = 1;
    rungeKutta: boolean = true;
    particleSize: Vector2;

    offsetPosFunc: () => Vector2;
    offsetVelocityFunc: () => Vector2;
    offsetMassFunc: () => number;

    colorOverLifetime: (baseColor: number, timeRatio: number) => number;
    sizeOverLifetime: (baseSize: Vector2, timeRatio: number) => Vector2;
    massOverLifetime: (baseMass: number, timeRatio: number) => number;

    loop: boolean;
    loopDelayMS: number;
    delayMSCounter: number;
    autoStart: boolean;
    started: boolean;
    private lastRealTime: number = 0;

    static drawTrajectories: boolean = false;

    constructor(texture?: PIXI.Texture, amount?: number, newParticles?: number, ttl?: number, color?: number,
                initVelocity?: Vector2, offset?: Vector2, loop?: boolean, loopDelayMS?: number, autoStart?: boolean,
                particleSize?: Vector2, offsetPosFunc?: () => Vector2, offsetVelocityFunc?: () => Vector2,
                offsetMassFunc?: () => number, colorOverLifetime?: (baseColor: number, timeRatio: number) => number,
                sizeOverLifetime?: (baseSize: Vector2, timeRatio: number) => Vector2,
                massOverLifetime?: (baseMass: number, timeRatio: number) => number) {
        super();
        this.particles = new Array<Particle>(amount);
        this.texture = texture;
        this.amount = amount;
        this.newParticles = newParticles;
        this.ttl = ttl;
        this.baseColor = color;
        this.initVelocity = initVelocity;
        this.offset = offset;
        this.loop = loop;
        this.loopDelayMS = loopDelayMS;
        this.delayMSCounter = loopDelayMS;
        this.autoStart = autoStart;
        this.started = this.autoStart;
        this.particleSize = particleSize;
        this.offsetPosFunc = offsetPosFunc;
        this.offsetVelocityFunc = offsetVelocityFunc;
        this.offsetMassFunc = offsetMassFunc;
        this.colorOverLifetime = colorOverLifetime;
        this.sizeOverLifetime = sizeOverLifetime;
        this.massOverLifetime = massOverLifetime;
    }

    Enable = () => {
        // Add particles to renderer
        for (let i = 0; i < this.amount; i++) {
            this.particles[i] = new Particle();
            this.particles[i].sprite = new PIXI.Sprite(this.texture);
            this.gameObject.scene?.container.addChild(this.particles[i].sprite);
        }
    }

    private FirstUnusedParticle(): number {
        for (let i = this.lastUsedParticle; i < this.amount; i++) {
            if (this.particles[i].life <= 0) {
                this.lastUsedParticle = i;
                return i;
            }
        }

        for (let i = 0; i < this.lastUsedParticle; i++) {
            if (this.particles[i].life <= 0) {
                this.lastUsedParticle = i;
                return i;
            }
        }
        return -1;
    }

    private RespawnParticle(particle: Particle) {
        this.gameObject.scene?.container.removeChild(particle.sprite);
        //particle.DeleteTrajectory(this.gameObject.scene);
        particle.pos = Vector2.FromPoint(this.gameObject.absoluteTransform.position).Add(this.offset);
        particle.color = this.baseColor;
        particle.life = this.ttl;
        particle.velocity = this.initVelocity;
        particle.mass = 1;

        if (this.offsetPosFunc) {
            particle.pos = particle.pos.Add(this.offsetPosFunc());
        }

        if (this.offsetVelocityFunc) {
            particle.velocity = particle.velocity.Add(this.offsetVelocityFunc());
        }

        if (this.offsetMassFunc) {
            particle.mass = this.offsetMassFunc();
        }

        if (this.rungeKutta) {
            particle.solver = new RungeKuttaSolver(particle.pos, particle.velocity,
                0, Time.fixedDeltaTime() / this.stepSize, this.dxdt, this.dvdt);
        } else {
            particle.solver = new EulerSolver(particle.pos, particle.velocity,
                0, Time.fixedDeltaTime() / this.stepSize, this.dxdt, this.dvdt)
        }

        if (this.particleSize) {
            particle.sprite.width = this.particleSize.x;
            particle.sprite.height = this.particleSize.y;
        }

        particle.sprite.position = particle.pos.AsPoint();
        particle.sprite.tint = particle.color;
        this.gameObject.scene?.container.addChild(particle.sprite);
    }

    dxdt(x1: Vector2, x2: Vector2, t: number, m: number): Vector2 {
        return x2;
    }

    dvdt(x1: Vector2, x2: Vector2, t: number, m: number): Vector2 {
        return Forcefield.GetForceAtPosition(x1, m).Div(m);
    }

    SetStarted() {
        for (let i = 0; i < this.newParticles; i++) {
            let p = this.FirstUnusedParticle();
            if (p != -1) {
                this.RespawnParticle(this.particles[p]);
            }
        }
        this.started = this.loop;
    }

    Update = () => {
        for (let i = 0; i < this.amount; i++) {
            if (ParticleSystem.drawTrajectories) {
                if (this.particles[i].life > 0) {
                    this.particles[i].AddTrajectoryPoint(this.gameObject.scene);
                }
            } else {
                this.particles[i].DeleteTrajectory(this.gameObject.scene);
            }
        }
    }

    FixedUpdate = () => {
        let msPassed = (Time.realTime - this.lastRealTime);

        if (this.started) {
            this.delayMSCounter -= msPassed;
            if (this.delayMSCounter <= 0) {
                // Respawn particles up to this.newAmount
                for (let i = 0; i < this.newParticles; i++) {
                    let p = this.FirstUnusedParticle();
                    if (p != -1) {
                        this.RespawnParticle(this.particles[p]);
                    }
                }
                this.delayMSCounter += this.loopDelayMS;
            }
            this.started = this.loop;
        }

        for (let i = 0; i < this.amount; i++) {
            // Update TTL of each particle
            this.particles[i].life -= msPassed / 1000;
            if (this.particles[i].life > 0) {
                // Do physics calculations for each alive particle (Runge Kutta)
                this.particles[i].solver.SolveForIterations(this.stepSize, this.particles[i].mass);
                this.particles[i].pos = this.particles[i].solver.x1;
                this.particles[i].velocity = this.particles[i].solver.x2;

                this.particles[i].sprite.position.x = this.particles[i].pos.x;
                this.particles[i].sprite.position.y = this.particles[i].pos.y;

                let ratio = this.particles[i].life / this.ttl;
                if (this.colorOverLifetime) {
                    this.particles[i].color = this.colorOverLifetime(this.baseColor, ratio);
                    this.particles[i].sprite.tint = this.particles[i].color;
                }

                if (this.sizeOverLifetime) {
                    this.particles[i].sprite.width = this.sizeOverLifetime(this.particleSize, ratio).x;
                    this.particles[i].sprite.height = this.sizeOverLifetime(this.particleSize, ratio).y;
                }

                if (this.massOverLifetime) {
                    this.particles[i].mass = this.massOverLifetime(1, ratio);
                }
            } else {
                // this.particles[i].DeleteTrajectory(this.gameObject.scene);
                this.gameObject.scene.container.removeChild(this.particles[i].sprite);
            }
        }
        this.lastRealTime = Time.realTime;
    }
}
