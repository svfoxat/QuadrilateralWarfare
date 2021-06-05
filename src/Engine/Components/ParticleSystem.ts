import {Vector2} from "../Math/Vector2";
import {Component} from "./Component";
import {Time} from "../Time";
import {RungeKuttaSolver} from "../Math/RungeKuttaSolver";
import {Forcefield} from "../Forcefield";

export class Particle {
    sprite: PIXI.Sprite;
    pos: Vector2 = Vector2.Zero();
    velocity: Vector2 = Vector2.Zero();
    color: number = 0x000000;
    life: number = 0;
    mass: number = 1;

    solver: RungeKuttaSolver;

    public ToString() {
        return "x: " + this.pos.x + ", y: " + this.pos.y;
    }

    f1(x1: Vector2, x2: Vector2, t: number, m: number): Vector2 {
        return x2;
    }

    f2(x1: Vector2, x2: Vector2, t: number, m: number): Vector2 {
        return Forcefield.GetForceAtPosition(x1).Div(m);
    }
}

export class ParticleSystem extends Component {
    texture: PIXI.Texture;
    baseColor: number;
    amount: number;
    newParticles: number;
    ttl: number;
    initVelocity: Vector2;
    offset: Vector2;
    particles: Array<Particle>;
    lastUsedParticle: number = 0;

    constructor(texture: PIXI.Texture, amount: number, newParticles: number, ttl: number, color: number, initVelocity: Vector2, offset: Vector2) {
        super();
        this.particles = new Array<Particle>(amount);
        this.texture = texture;
        this.amount = amount;
        this.newParticles = newParticles;
        this.ttl = ttl;
        this.baseColor = color;
        this.initVelocity = initVelocity;
        this.offset = offset;
    }

    Enable = () => {
        // Add particles to renderer
        for (let i = 0; i < this.amount; i++) {
            this.particles[i] = new Particle();
            this.particles[i].sprite = new PIXI.Sprite(this.texture);
            this.particles[i].sprite.tint = this.baseColor;
            this.particles[i].sprite.x = this.gameObject.absoluteTransform.position.x + this.offset.x;
            this.particles[i].sprite.y = this.gameObject.absoluteTransform.position.y + this.offset.y;
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
        particle.pos = Vector2.FromPoint(this.gameObject.absoluteTransform.position).Add(this.offset);
        particle.pos.x += Math.random() * 1000;
        particle.sprite.position = particle.pos.AsPoint();
        particle.color = this.baseColor;
        particle.life = this.ttl;
        particle.velocity = this.initVelocity;
        particle.velocity.x = 10 - (Math.random() * 20);
        particle.mass = Math.random() + 0.5;
        particle.solver = new RungeKuttaSolver(particle.pos, particle.velocity,
            0, Time.fixedDeltaTime(), particle.f1, particle.f2)
        this.gameObject.scene?.container.addChild(particle.sprite);
    }

    Update = () => {

    }

    FixedUpdate = () => {
        // Respawn particles up to this.newAmount
        for (let i = 0; i < this.newParticles; i++) {
            let p = this.FirstUnusedParticle();
            if (p != -1) {
                this.RespawnParticle(this.particles[p]);
            }
        }

        for (let i = 0; i < this.amount; i++) {
            // Update TTL of each particle
            this.particles[i].life -= Time.fixedDeltaTime();

            if (this.particles[i].life > 0) {
                // Do physic calculations for each alive particle (Runge Kutta)
                this.particles[i].solver.SolveForIterations(1, this.particles[i].mass);
                this.particles[i].pos = this.particles[i].solver.x1;
                this.particles[i].velocity = this.particles[i].solver.x2;

                this.particles[i].sprite.position.x = this.particles[i].pos.x;
                this.particles[i].sprite.position.y = this.particles[i].pos.y;
            }
        }
    }
}
