import * as PIXI from "pixi.js";
import Application from "../Engine/Application";
import {SceneManager} from "../Engine/SceneManager";
import {Scripts} from "./Scripts/Scripts";

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
        SceneManager.getInstance().LoadScene(scene2);
    }
}

new Main();
