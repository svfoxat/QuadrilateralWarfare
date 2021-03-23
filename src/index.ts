import * as PIXI from "pixi.js";
import * as gsap from "gsap";

const { TweenMax } = gsap;

import { SampleFilter } from "./Filters/Sample/SampleFilter";
import {Gameobject} from "./Gameobject";
import Transform = PIXI.Transform;
import {Rigidbody} from "./Rigidbody";
import {SpriteRenderer} from "./SpriteRenderer";
import Point = PIXI.Point;
import {Scene} from "./Scene/Scene";

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

    // Scene 1
    let scene = new Scene(app);
    let go = new Gameobject(new Transform());
    let spriteRenderer = go.AddComponent(SpriteRenderer) as SpriteRenderer;
    spriteRenderer.sprite.texture = texture;
    spriteRenderer.sprite.interactive = true;
    spriteRenderer.sprite.buttonMode = true;
    scene.Add(go);

    // Scene 2
    let scene2 = new Scene(app);
    let go2 = new Gameobject(new Transform());
    let spriteRenderer2 = go2.AddComponent(SpriteRenderer) as SpriteRenderer;
    spriteRenderer2.sprite.texture = texture;
    spriteRenderer2.sprite.interactive = true;
    spriteRenderer2.sprite.buttonMode = true;
    go2.transform.position = new Point(1000, 500);
    scene2.Add(go2);

    // Set Scene 1 active at first
    scene.SetActive(scene1Fnc);

    // Click handlers of sprites
    spriteRenderer.sprite.on("click", () => {
        scene2.SetActive(console.log)
    })

    spriteRenderer2.sprite.on("click", () => {
        scene.SetActive(scene1Fnc);
    })
    function scene1Fnc(delta: number) {
        go.transform.rotation += 0.01 * delta;
        go.transform.position.x += 0.5 * delta;
        go.transform.position.y += 0.5 * delta;
        scene.sceneRoot.transform.position.x += delta;
        scene.sceneRoot.Update();
    }
}

loadAssets();

