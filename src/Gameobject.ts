import {Transform, Point} from "pixi.js";
import {IComponent} from "./IComponent";

export class Gameobject  {
    public transform: Transform
    public components: Array<IComponent> = [];

    private _enabled: boolean = false;

    constructor(transform: Transform) {
        this.transform = transform;
    }

    public UpdateAllComponents() {
        if (!this._enabled) return;

        for (let component of this.components) {
            component.Update();
        }
    }

    public EnableComponents() {
        if (this._enabled) return;

        for (let component of this.components) {
            component.OnEnable();
        }
    }
}
