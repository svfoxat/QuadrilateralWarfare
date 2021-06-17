import {Component} from "../../Engine/Components/Component";
import {GameController} from "./GameController";
import {Collider, TriangleCollider} from "../../Engine/Components/Collider";
import {TriangleRenderer} from "../../Engine/Components/TriangleRenderer";

export class EnemyScript extends Component {
    name: string = "EnemyScript";
    game: GameController;
    private ticks: number = 0;
    private maxTicks: number = 10;

    Start = (): void => {
    }

    Update = (): void => {
    }

    OnCollision = (other: Collider): void => {
        if (this.game) {
            if (other.gameObject.name === "Player") {
                this.game.KillEnemy();
                (this.gameObject.GetComponent(TriangleRenderer) as TriangleRenderer).mesh.destroy();
                (this.gameObject.GetComponent(TriangleCollider) as TriangleCollider).SetEnabled(false);
                //Gameobject.Destroy(this.gameObject);
            } else if (other.gameObject.name === "Ground") {
                if (++this.ticks === this.maxTicks) {
                    // this.gameObject.Destroy();
                    // this.gameObject = null;
                }
            }
        }
    }
}
