import {Component} from "./Component";
import {Vector3} from "../Vector3";
import {Gameobject} from "../Gameobject";

export class Transform extends Component {
    public position: Vector3;
    public rotation: Vector3;
    public scale: Vector3;

    _name: string = "Transform";
    gameObject: Gameobject;

    OnEnable = (): void => {
    };

    Start = (): void => {
    };

    Update = (): void => {
    };

    FixedUpdate = (): void => {
    };

}
