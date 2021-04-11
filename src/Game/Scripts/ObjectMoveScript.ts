import {Component} from "../../Engine/Components/Component";
import {Gameobject} from "../../Engine/Gameobject";
import {InputManager} from "../../Engine/InputManager";
import InteractionEvent = PIXI.interaction.InteractionEvent;
import {Sprite, Transform} from "pixi.js";
import {SpriteRenderer} from "../../Engine/Components/SpriteRenderer";

export default class ObjectMoveScript extends Component {
    gameObject: Gameobject;
    name: string = "ObjectMoveScript";

    private inputManager: InputManager;

    OnEnable = (): void => {
        console.log("OnEnable")
    };

    Start = (): void => {
        this.inputManager = InputManager.getInstance();
        this.inputManager.Mouse.on("mousedown", this.onClick);
    }

    onClick = (e: InteractionEvent) => {
        const g = new Gameobject(new Transform(), this.gameObject.scene.sceneRoot);
        g.transform.position.x = this.inputManager.currPos.x;
        g.transform.position.y = this.inputManager.currPos.y;
        const sr = g.AddComponent(SpriteRenderer) as SpriteRenderer;
        sr.gameObject = g;
        sr.sprite.texture = PIXI.loader.resources["assets/fox.jpg"].texture;
        this.gameObject.scene.Add(g);
    }

    Update = (): void => {
        const {x, y} = this.inputManager.currPos || {x: 0, y: 0}
        this.gameObject.transform.position.x = x;
        this.gameObject.transform.position.y = y;
    };
}
