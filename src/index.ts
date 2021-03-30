import * as PIXI from "pixi.js";
import * as gsap from "gsap";
import {Gameobject} from "./Gameobject";
import {ForceMode, Rigidbody} from "./Rigidbody";
import {SpriteRenderer} from "./SpriteRenderer";
import {Vector3} from "./Vector3";
import {BoxCollider, Collider} from "./Collider";

const {TweenMax} = gsap;

import Transform = PIXI.Transform;
import Point = PIXI.Point;

const width = 1920;
const height = 1080;

const app = new PIXI.Application({
    width: width,
    height: height,
    antialias: true,
});

const appContainer = document.getElementById("app_container")
appContainer.appendChild(app.view);

function loadAssets() {
    PIXI.loader
        .add("assets/fox.jpg")
        .load(run);
}

function run() {

    const texture = PIXI.loader.resources["assets/fox.jpg"].texture;
    texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    const sprite1 = new PIXI.Sprite(texture);
    const sprite2 = new PIXI.Sprite(texture);

    let sceneRoot = new Gameobject(new Transform(), null);
    let go = new Gameobject(new Transform(), sceneRoot);
    let spriteRenderer = go.AddComponent(SpriteRenderer) as SpriteRenderer;
    let boxCollider = go.AddComponent(BoxCollider) as BoxCollider;
    let rb = go.AddComponent(Rigidbody) as Rigidbody;
    boxCollider.size.x = sprite1.width;
    boxCollider.size.y = sprite1.height;
    boxCollider.attachedRigidbody = rb;
    spriteRenderer.sprite = sprite1;

    let go2 = new Gameobject(new Transform(), sceneRoot);
    let spriteRenderer2 = go2.AddComponent(SpriteRenderer) as SpriteRenderer;
    let boxCollider2 = go2.AddComponent(BoxCollider) as BoxCollider;
    rb.useGravity = false;


    boxCollider2.size.x = sprite2.width;
    boxCollider2.size.y = sprite2.height;
    spriteRenderer2.sprite = sprite2;

    go2.transform.position = new Point(1000, 500);
    let rb2 = go2.AddComponent(Rigidbody) as Rigidbody;
    boxCollider2.attachedRigidbody = rb2;
    rb2.useGravity = false;
    rb2.mass = .5;
    rb.AddForce(new Vector3(5, 5, 0), ForceMode.VelocityChange);
    rb2.AddForce(new Vector3(-5, 0, 0), ForceMode.VelocityChange);

    //go2.transform.rotation = Math.PI / 180 * 30;
    //go.transform.rotation = Math.PI / 180 * -90;
    rb.AddTorque(-.05, ForceMode.VelocityChange);
    rb2.AddTorque(-.05, ForceMode.VelocityChange);



    // sprite.pivot.set(sprite.width / 2, sprite.height / 2);
    // sprite.position.set(width / 2, height / 2);
    // sprite.scale.set(2);
    // Listen for animate update
    app.ticker.add((delta) => {
        // delta is 1 if running at 100% performance
        // creates frame-independent transformation
        // go.transform.rotation += 0.01 * delta;
        // go.transform.position.x += 0.5 * delta;
        // go.transform.position.y += 0.5 * delta;
        // sceneRoot.transform.position.x += delta;
        //Time.t = delta / 5;
        let collision = Collider.IsColliding(boxCollider, boxCollider2);
        if (collision != null) {
            let inverseCollision = collision.Inverse();
            rb.AddForce(new Vector3(collision.x, collision.y, 0), ForceMode.Impulse);
            rb2.AddForce(new Vector3(inverseCollision.x, inverseCollision.y, 0), ForceMode.Impulse);
        }
        sceneRoot.Update();
    });

    app.stage.addChild(sprite1);
    app.stage.addChild(sprite2);


}

loadAssets();

