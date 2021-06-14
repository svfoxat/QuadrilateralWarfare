import * as PIXI from "pixi.js";
import {Point, Transform} from "pixi.js";
import {Component} from "./Components/Component";
import {Scene} from "./Scene";
import Application from "./Application";
import {Vector2} from "./Math/Vector2";
import {SpriteRenderer} from "./Components/SpriteRenderer";
import {BoxCollider} from "./Components/BoxCollider";
import {Rigidbody} from "./Components/Rigidbody";
import {Collider} from "./Components/Collider";
import { uuid } from 'uuidv4';
import Texture = PIXI.Texture;

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
    }

    public UpdateAllComponents() {
        if (!this._enabled) return;

        for (let component of this.components) {
            component.Update();
        }
    }

    public FixedUpdateAllComponents() {
        if (!this._enabled) return;

        for (let component of this.components) {
            if (component.FixedUpdate) {
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

            if (component.Enable) {
                component.enabled = true;
                component.Enable();
            }
        }
        return;
    }

    public GetComponent<T extends Component>(type: (new() => T)): Component {
        for (let component of this.components) {
            let ret = component as T;
            if (ret != null && ret instanceof type) {
                return ret;
            }
        }
        return null;
    }

    public AddComponent<T extends Component>(type: (new() => T)): Component {
        let component = new type();
        component.gameObject = this;
        this.components.push(component);
        this.EnableComponents();
        return component;
    }

    public AddExistingComponent<T extends Component>(component: T): T {
        component.gameObject = this;
        this.components.push(component);
        this.EnableComponents();
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

    public static CreateSprite(application: Application, scene: Scene, texture: Texture, pos: Vector2, size: Vector2, color: number): Gameobject {
        const sprite = new PIXI.Sprite(texture);
        sprite.tint = color;
        let go = new Gameobject(new Transform(), null);
        let spriteRenderer = go.AddComponent(SpriteRenderer) as SpriteRenderer;
        let boxCollider = go.AddComponent(BoxCollider) as BoxCollider;
        let rb = go.AddComponent(Rigidbody) as Rigidbody;
        rb.mass = 0;
        rb.elasticity = 1;
        go.transform.position = pos.AsPoint();
        go.transform.scale = size.AsPoint();
        boxCollider.size.x = sprite.width * go.transform.scale.x;
        boxCollider.size.y = sprite.height * go.transform.scale.y;
        boxCollider.attachedRigidbody = rb;
        boxCollider.application = application;
        spriteRenderer.sprite = sprite;
        application.pixi.stage.addChild(sprite);
        scene.Add(go);
        return go;
    }
}
