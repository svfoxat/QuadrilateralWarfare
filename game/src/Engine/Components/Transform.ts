import {Component} from "./Component";
import {Vector3} from "../Math/Vector3";
import {Gameobject} from "../Gameobject";

export class Transform extends Component {
    public position: Vector3;
    public rotation: Vector3;
    public scale: Vector3;

    name: string = "Transform";
    gameObject: Gameobject;
}
