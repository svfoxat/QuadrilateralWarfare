import {IComponent} from "./IComponent";
import {Gameobject} from "./Gameobject";
import {Vector3} from "./Vector3";
import {Time} from "./Time";

export class Rigidbody implements IComponent
{
    gameObject: Gameobject;
    name: string = "Rigidbody";
    mass: number = 1;
    velocity: Vector3 = new Vector3(0,0,0);
    angularVelocity: Vector3 = new Vector3(0,0,0);
    useGravity: boolean = true;

    OnEnable(): void {
    }

    Start(): void {
    }

    Update(): void {

    }
}
