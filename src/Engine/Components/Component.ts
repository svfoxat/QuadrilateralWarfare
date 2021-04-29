import {Gameobject} from "../Gameobject";
import {Collider} from "./Collider";

export class Component {
    name: string;
    gameObject: Gameobject;
    enabled: boolean;

    Enable: () => void;
    Start: () => void;
    Update: () => void;
    FixedUpdate: () => void;

    OnCollision: (other: Collider) => void;
    OnTriggerEnter: () => void;
    OnTriggerExit: () => void;
    OnTriggerStay: () => void;

    OnMouseDown: () => void;
    OnMouseUp: () => void;
}
