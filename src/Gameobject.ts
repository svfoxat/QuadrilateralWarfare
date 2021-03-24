import {Point, Transform} from "pixi.js";
import {Component} from "./Component";

export class Gameobject  {
    public transform: Transform;
    public absoluteTransform: Transform = new Transform();
    public parent: Gameobject;
    public children: Array<Gameobject> = [];
    public components: Array<Component> = [];

    private _enabled: boolean = true;

    constructor(transform: Transform, parent: Gameobject) {
        this.transform = transform;
        this.parent = parent;
        parent?.children.push(this);
    }

    public Update()
    {
        this.UpdateTransform();
        this.UpdateAllComponents();

        for(let go of this.children)
        {
            go.Update();
        }
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

    public AddComponent<T extends Component>(type: (new() => T)): Component
    {
        let component = new type();
        component.gameObject = this;
        this.components.push(component);
        return component;
    }

    private UpdateTransform() {
        if (!this.parent)
        {
            this.absoluteTransform = this.transform;
            return;
        }

        this.absoluteTransform.position =
            new Point(this.transform.position.x + this.parent.absoluteTransform.position.x,
                      this.transform.position.y + this.parent.absoluteTransform.position.y);
        this.absoluteTransform.scale =
            new Point(this.transform.scale.x * this.parent.absoluteTransform.scale.x,
                      this.transform.scale.y * this.parent.absoluteTransform.scale.y);
        this.absoluteTransform.rotation = this.transform.rotation + this.parent.absoluteTransform.rotation;
    }
}
