import {Gameobject} from "./Gameobject";

export interface IComponent {
    name: string;
    gameObject: Gameobject;

    OnEnable: () => void;
    Start: () => void;
    Update: () => void;
}
