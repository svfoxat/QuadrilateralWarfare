import {Point, Transform} from "pixi.js";
import {Component} from "./Components/Component";
import {Scene} from "./Scene";

export class Gameobject  {
    public transform: Transform;
    public absoluteTransform: Transform = new Transform();
    public parent: Gameobject;
    public children: Array<Gameobject> = [];
    public components: Array<Component> = [];
    public scene: Scene;

    private _enabled: boolean = false;

    constructor(transform: Transform, parent: Gameobject = null) {
        this.transform = transform;
        this.parent = parent;
        parent?.children.push(this);

        this.EnableComponents().then(async () => {
            await this.StartComponents();
        });
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

    public async StartComponents() {
        if (!this._enabled) return;

        console.log(`Start ${this.components.length} Component(s)`)
        for (let component of this.components) {
            component.Start();
        }
        return;
    }

    public async EnableComponents() {
        if (this._enabled) return;
        this._enabled = true;
        console.log(`Enable ${this.components.length} Component(s)`)

        for (let component of this.components) {
            component.OnEnable();
        }
        return;
    }

    public GetComponent<T extends Component>(type: (new() => T)): Component {
        for (let component of this.components) {
            let ret = component as T;
            if (ret != null) {
                return ret;
            }
        }
        return null;
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
