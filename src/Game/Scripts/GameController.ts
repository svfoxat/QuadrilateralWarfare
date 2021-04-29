import {Component} from "../../Engine/Components/Component";


export class GameController extends Component {
    public points: number;
    public enemiesAlive: number = 1;

    Update = (): void => {
    }

    public KillEnemy(): void {
        this.points++;
        if (--this.enemiesAlive === 0) {
            this.WinGame();
        }
    }

    private WinGame(): void {
        console.log("WIN");
    }
}
