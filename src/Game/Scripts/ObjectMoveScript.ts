import {IComponent} from "../../Engine/Components/IComponent";
import {Gameobject} from "../../Engine/Gameobject";

export default class ObjectMoveScript implements IComponent {
    gameObject: Gameobject;
    name: string = "ObjectMoveScript"

    private _counter = 0;

    OnEnable(): void {
    }

    Start(): void {
    }

    Update(): void {
        this.gameObject.transform.rotation += 0.01;
        this.gameObject.transform.position.x += 1;
    }
}
