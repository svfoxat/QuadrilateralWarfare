import * as PIXI from "pixi.js";
import * as gsap from "gsap";

const { TweenMax } = gsap;

import { SampleFilter } from "./Filters/Sample/SampleFilter";

const width = 900;
const height = 600;

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

    const sprite = new PIXI.Sprite(texture);

    const filter = new SampleFilter()
    filter.enabled = true;
    sprite.filters = [ filter ];

    sprite.pivot.set(sprite.width / 2, sprite.height / 2);
    sprite.position.set(width / 2, height / 2);
    sprite.scale.set(2);

    // Listen for animate update
    app.ticker.add((delta) => {
        // delta is 1 if running at 100% performance
        // creates frame-independent transformation
        sprite.rotation += 0.010 * delta;
    });

    app.stage.addChild(sprite);
}

loadAssets();

