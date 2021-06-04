import {Component} from "../../Engine/Components/Component";
import {GameController} from "./GameController";
import {Collider} from "../../Engine/Components/Collider";
import {Gameobject} from "../../Engine/Gameobject";

export class EnemyScript extends Component {
    private game: GameController;
    private ticks: number = 0;
    private maxTicks: number = 10;

    Start = (): void => {
        this.game = this.gameObject.parent.GetComponent(GameController) as GameController;
    }

    Update = (): void => {
    }

    OnCollision = (other: Collider): void => {
        if (this.game === undefined) {
            this.game = this.gameObject.parent.GetComponent(GameController) as GameController;
        }
        if (other.gameObject.name === "Player") {
            this.game.KillEnemy();
            Gameobject.Destroy(this.gameObject);
        } else if (other.gameObject.name === "Ground") {
            if (++this.ticks === this.maxTicks) {
                // this.gameObject.Destroy();
                // this.gameObject = null;
            }
        }
    }
}
