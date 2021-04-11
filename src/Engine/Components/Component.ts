import {Gameobject} from "../Gameobject";

export class Component {
    _name: string;
    gameObject: Gameobject;

    OnEnable: () => void;
    Start: () => void;
    Update: () => void;
    FixedUpdate: () => void;

    OnTriggerEnter: () => void;
    OnTriggerExit: () => void;
    OnTriggerStay: () => void;
}
