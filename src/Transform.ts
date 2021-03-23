import {IComponent} from "./IComponent";
import {Vector3} from "./Vector3";
import {Gameobject} from "./Gameobject";

export class Transform implements IComponent {
    public position: Vector3;
    public rotation: Vector3;
    public scale: Vector3;

    name: string = "Transform";
    gameObject: Gameobject;

    OnEnable(): void {
    }

    Start(): void {
    }

    Update(): void {
    }
}
