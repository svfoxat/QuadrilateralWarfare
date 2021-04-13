import * as PIXI from "pixi.js";
import {Point, Transform} from "pixi.js";
import {Component} from "./Components/Component";
import {Scene} from "./Scene";
import Application from "./Application";
import {Vector2} from "./Vector2";
import {SpriteRenderer} from "./Components/SpriteRenderer";
import {BoxCollider} from "./Components/Collider";
import {Rigidbody} from "./Components/Rigidbody";
import Texture = PIXI.Texture;

export class Gameobject  {
    public transform: Transform;
    public absoluteTransform: Transform = new Transform();
    public parent: Gameobject;
    public children: Array<Gameobject> = [];
    public components: Array<Component> = [];
    public scene: Scene;

    private _enabled: boolean = true;

    constructor(transform: Transform, parent: Gameobject = null) {
        this.transform = transform;
        this.parent = parent;
        parent?.children.push(this);
    }

    public Update() {
        this.UpdateTransform();
        this.UpdateAllComponents();

        for(let go of this.children) {
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
            component.FixedUpdate();
        }
    }

    public EnableComponents() {
        if (this._enabled) return;

        for (let component of this.components) {
            component.OnEnable();
        }
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
        return component;
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
        // this.UpdateTransform();
        this.FixedUpdateAllComponents();

        for (let go of this.children) {
            go.FixedUpdate();
        }
    }

    public static CreateSprite(application: Application, scene: Scene, texture: Texture, pos: Vector2, size: Vector2, color: number): Gameobject {
        const sprite = new PIXI.Sprite(texture);
        sprite.tint = color;
        let go = new Gameobject(new Transform(), null);
        let spriteRenderer = go.AddComponent(SpriteRenderer) as SpriteRenderer;
        let boxCollider = go.AddComponent(BoxCollider) as BoxCollider;
        let rb = go.AddComponent(Rigidbody) as Rigidbody;
        rb.useGravity = false;
        rb.mass = 0;
        rb.inertia = 0;
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
