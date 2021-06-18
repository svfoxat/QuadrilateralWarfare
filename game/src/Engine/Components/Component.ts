import {Gameobject} from "../Gameobject";
import {Collider} from "./Collider";

export class Component {
    name: string;
    gameObject: Gameobject;
    enabled: boolean;

    Enable: () => void = (): void => {
    };
    Start: () => void;
    Update: () => void;
    FixedUpdate: () => void;

    OnDestroy: () => void;
    OnCollision: (other: Collider) => void;
    OnTriggerEnter: () => void;
    OnTriggerExit: () => void;
    OnTriggerStay: () => void;

    OnMouseDown: () => void;
    OnMouseUp: () => void;

    SetEnabled(enabled: boolean) {
        if (enabled) {
            this.enabled = true;
            this.Enable();
        } else {
            this.enabled = false;
        }
    }
}
