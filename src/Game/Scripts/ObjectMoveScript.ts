import {Component} from "../../Engine/Components/Component";
import {Gameobject} from "../../Engine/Gameobject";

export default class ObjectMoveScript extends Component {
    gameObject: Gameobject;
    _name: string = "ObjectMoveScript";

    private _counter = 0;

    OnEnable = (): void => {
    };

    Start = (): void => {
    };

    Update = (): void => {
        this.gameObject.transform.rotation += 0.01;
        this.gameObject.transform.position.x += 1;
    };
}
