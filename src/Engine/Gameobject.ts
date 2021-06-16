import {Point, Transform} from "pixi.js";
import {Component} from "./Components/Component";
import {Scene} from "./Scene";
import {Collider} from "./Components/Collider";
import { uuid } from 'uuidv4';
import Texture = PIXI.Texture;
import {Gizmos} from "./Gizmos";
import {Vector2} from "./Math/Vector2";

export class Gameobject {
    get enabled(): boolean {
        return this._enabled;
    }

    public name: string = "Gameobject";
    public transform: Transform;
    public absoluteTransform: Transform = new Transform();
    public parent: Gameobject;
    public children: Array<Gameobject> = [];
    public components: Array<Component> = [];
    public scene: Scene;
    public id: string;

    public selected: boolean = false;
    private _highlightGizmo: PIXI.Graphics = new PIXI.Graphics();
    private _yGizmo: PIXI.Graphics = new PIXI.Graphics();
    private _xGizmo: PIXI.Graphics = new PIXI.Graphics();

    private _enabled: boolean = false;

    constructor(transform: Transform, parent: Gameobject = null) {
        this.id = uuid();
        this.transform = transform;
        this.parent = parent;
        parent?.children.push(this);

        this.EnableComponents().then(async () => {
            await this.StartComponents();
        });
    }

    public Update() {
        this.UpdateAllComponents();

        for (let go of this.children) {
            go.Update();
        }

        if (this.scene) {
            this.scene.container.removeChild(this._highlightGizmo);
            this.scene.container.removeChild(this._xGizmo);
            this.scene.container.removeChild(this._yGizmo);

            if (this.selected) {
                const {x, y} = this.absoluteTransform.position;
                const pos: Vector2 = new Vector2(x, y);
                this._highlightGizmo = Gizmos.DrawPoint(pos, 2, 0xFFFFFF, 10, 0xFFFFFF);

                this._xGizmo = Gizmos.DrawArrow(pos, new Vector2(x + 50, y), 2, 0xFF0000)
                this._yGizmo = Gizmos.DrawArrow(pos, new Vector2(x, y - 50), 2, 0x0000FF)

                this.scene.container.addChild(this._xGizmo);
                this.scene.container.addChild(this._yGizmo);
                this.scene.container.addChild(this._highlightGizmo);
            }
        }
    }

    public UpdateAllComponents() {
        if (!this._enabled) return;

        for (let component of this.components) {
            if (component.Update && component.enabled) {
                component.Update();
            }
        }
    }

    public FixedUpdateAllComponents() {
        if (!this._enabled) return;

        for (let component of this.components) {
            if (component.FixedUpdate && component.enabled) {
                component.FixedUpdate();
            }
        }
    }

    public async StartComponents() {
        if (!this._enabled) return;

        for (let component of this.components) {
            if (!component.enabled) continue;

            if (component.Start) {
                component.Start();
            }
        }
        return;
    }

    public async EnableComponents() {
        this._enabled = true;

        for (let component of this.components) {
            if (component.enabled) continue;
            component.SetEnabled(true);
        }
        return;
    }

    public GetComponent<T extends Component>(type: (new() => T)): Component {
        for (let component of this.components) {
            let ret = component as T;
            if (ret !== null && ret instanceof type) {
                return ret;
            }
        }
        return null;
    }

    public HasComponent<T extends Component>(type: (new() => T)): boolean {
        for (let comp of this.components) {
            let c = comp as T;
            if (c !== null && c instanceof type) {
                return true;
            }
        }
        return false;
    }

    public AddComponent<T extends Component>(type: (new() => T)): Component {
        let exists = this.GetComponent(type);
        if (exists) {
            return exists;
        }

        let component = new type();
        component.gameObject = this;
        this.components.push(component);
        component.SetEnabled(true);
        return component;
    }

    public AddExistingComponent<T extends Component>(component: T): T {
        component.gameObject = this;
        this.components.push(component);
        component.SetEnabled(true);
        return component;
    }

    public OnMouseDown() {
        if (!this._enabled) return;

        for (let component of this.components) {
            if (component.OnMouseDown) {
                component.OnMouseDown();
            }
        }
    }

    public OnMouseUp() {
        if (!this._enabled) return;

        for (let component of this.components) {
            if (component.OnMouseUp) {
                component.OnMouseUp();
            }
        }
    }

    public OnCollision(other: Collider) {
        if (!this._enabled) return;
        for (let component of this.components) {
            if (component.OnCollision) {
                component.OnCollision(other);
            }
        }
        this.children?.forEach(e => e.OnCollision(other));
    }

    private UpdateTransform() {
        if (!this.parent) {
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

    public FixedUpdate() {
        this.UpdateTransform();
        this.FixedUpdateAllComponents();

        for (let go of this.children) {
            go.FixedUpdate();
        }
    }

    public static Destroy(g: Gameobject) {
        g.components.forEach(i => i.OnDestroy && i.OnDestroy());
        g.components = [];

        g.scene.removeGameObjectById(g.id);
        g.children.forEach(c => Gameobject.Destroy(c));

        g = null;
    }
}
