import {Component} from "../../Engine/Components/Component";
import {ParticleSystem} from "../../Engine/Components/ParticleSystem";
import {Collider} from "../../Engine/Components/Collider";

export class ParticleTriggerOnCollision extends Component {
    name: string = "ParticleTriggerOnCollision"
    ps: ParticleSystem;

    Enable = () => {
        this.ps = this.gameObject.GetComponent(ParticleSystem) as ParticleSystem;
    }

    OnCollision = (other: Collider) => {
        if (this.ps && other.gameObject.name === "Player") {
            this.ps.SetStarted();
        }
    }
}
