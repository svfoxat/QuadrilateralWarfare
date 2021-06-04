import {Vector2} from "../Vector2";
import {Component} from "./Component";
import {Time} from "../Time";

export interface Particle {
    pos: Vector2;
    velocity: Vector2;
    color: number;
    life: number;
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

    constructor(texture: PIXI.Texture, amount: number, newParticles: number, ttl: number, color: number, initVelocity: Vector2, offset: Vector2) {
        super();
        this.particles = new Array<Particle>(amount);
        this.texture = texture;
        this.amount = amount;
        this.newParticles = newParticles;
        this.ttl = ttl;
        this.baseColor = color;
        this.offset = offset;

        // Add particles to renderer
    }


    FirstUnusedParticle(): number {
        for (let i = 0; i < this.amount; i++) {
            if (this.particles[i].life <= 0) return i;
        }
        return -1;
    }

    RespawnParticle(particle: Particle) {
        particle.pos = Vector2.FromPoint(this.gameObject.absoluteTransform.position).Add(this.offset);
        particle.color = this.baseColor;
        particle.life = this.ttl;
        particle.velocity = this.initVelocity;
    }

    FixedUpdate = () => {
        // Respawn particles up to this.newAmount
        for (let i = 0; i < this.newParticles; i++) {
            let p = this.FirstUnusedParticle();
            if (p != -1) {
                this.RespawnParticle(this.particles[i]);
            }
        }

        for (let i = 0; i < this.amount; i++) {
            let particle = this.particles[i];
            // Update TTL of each particle
            particle.life -= Time.fixedDeltaTime();

            if (particle.life > 0) {
                // Do physic calculations for each particle (Runge Kutta)

            }
        }
    }
}
