import * as PIXI from "pixi.js";
import Application from "../Engine/Application";
import {SceneManager} from "../Engine/SceneManager";
import {Scripts} from "./Scripts/Scripts";
import {Scene} from "../Engine/Scene";
import {Gameobject} from "../Engine/Gameobject";
import {SpriteRenderer} from "../Engine/Components/SpriteRenderer";
import {BoxCollider} from "../Engine/Components/BoxCollider";
import {Rigidbody} from "../Engine/Components/Rigidbody";
import {Vector2} from "../Engine/Vector2";
import {Time} from "../Engine/Time";
import ObjectMoveScript from "./Scripts/ObjectMoveScript";
import Transform = PIXI.Transform;
import Point = PIXI.Point;

class Main {
    constructor() {
        PIXI.loader
            .add("assets/fox.jpg")
            .add("assets/fox2.jpg")
            .load(this.run);
    }

    run() {
        const texture = PIXI.loader.resources["assets/fox.jpg"].texture;
        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        const application = new Application({
            width: 1920,
            height: 1080,
            name: "Quadrilateral Warfare",
            userScripts: Scripts,
        });

        const scene1: string = require("./Scenes/scene1.json");
        const scene2: string = require("./Scenes/scene2.json");
        // SceneManager.getInstance().LoadScene(scene2);

        let scene = new Scene();
        scene.sceneRoot = new Gameobject(new Transform(), null);

        let greenBox = Gameobject.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1000, 1100), new Vector2(200, 20), 0x00FF00);
        let blueBox = Gameobject.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1000, 0), new Vector2(200, 20), 0x0000FF);
        let greenBox1 = Gameobject.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1900, 200), new Vector2(20, 200), 0xFF0000);
        let blueBox1 = Gameobject.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(0, 200), new Vector2(20, 200), 0xFF0000);

        blueBox.transform.rotation = 0.15;
        greenBox.transform.rotation = 0.15 + 180 * Math.PI;

        //let redBox = Gameobject.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1000, 800), new Vector2(10, 10), 0xFF0000);
        const sprite2 = new PIXI.Sprite(PIXI.Texture.WHITE);
        sprite2.interactive = true;
        sprite2.on("mousedown", e => {
            Time.t = 1;
        });

        let go2 = new Gameobject(new Transform(), null);
        let spriteRenderer2 = go2.AddComponent(SpriteRenderer) as SpriteRenderer;
        let boxCollider2 = go2.AddComponent(BoxCollider) as BoxCollider;
        let rb2 = go2.AddComponent(Rigidbody) as Rigidbody;
        let input = go2.AddComponent(ObjectMoveScript) as ObjectMoveScript;
        rb2.useGravity = false;
        rb2.angularVelocity = 0;
        rb2.velocity = Vector2.Zero();
        rb2.velocity.y = 10;
        rb2.mass = 1;
        rb2.inertia = 1;
        sprite2.tint = 0x123456;
        go2.transform.scale = new Vector2(10, 10).AsPoint();
        go2.transform.position = new Point(1000, 500);
        boxCollider2.size.x = sprite2.width * go2.transform.scale.x;
        boxCollider2.size.y = sprite2.height * go2.transform.scale.y;
        boxCollider2.attachedRigidbody = rb2;
        boxCollider2.application = application;
        spriteRenderer2.sprite = sprite2;

        scene.Add(go2);
        application.pixi.stage.addChild(sprite2);

        SceneManager.getInstance().activeScene = scene;
        application.pixi.renderer.render(scene.container);
        application.pixi.stage = scene.container;
    }
}

new Main();
