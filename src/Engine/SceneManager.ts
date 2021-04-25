import Application from "./Application";
import {Scene} from "./Scene";
import * as PIXI from "pixi.js";
import {Transform} from "pixi.js";
import {Gameobject} from "./Gameobject";
import {SpriteRenderer} from "./Components/SpriteRenderer";

export class SceneManager {
    private static instance: SceneManager;
    public static initialize(app: Application) {
        this.instance = new this(app);
    }
    public static getInstance(): SceneManager {
        if (!this.instance)
            throw new Error("Initialize me first!");
        else
            return this.instance;
    }

    private app: Application;
    public activeScene: Scene;
    private constructor(app: Application) {
        this.app = app;
    }

    public LoadScene(s: any) {
        const scene = new Scene();
        scene.name = s.name;

        for (const g of s.gameObjects) {
            const go = new Gameobject(null, scene.sceneRoot);
            go.transform = new Transform();
            go.transform.rotation = g.transform.rotation;
            go.transform.position.set(g.transform.position.x, g.transform.position.y);
            go.transform.scale.set(g.transform.scale.x, g.transform.scale.y);
            go.scene = scene;

            for (const c of g.components) {
                switch (c.name) {
                    case "SpriteRenderer":
                        const sr = go.AddComponent(SpriteRenderer) as SpriteRenderer;
                        sr.gameObject = go;
                        sr.sprite.texture = PIXI.loader.resources[c.texture].texture;
                }

                const scripts = this.app.userScripts.filter((s) => s.name === c.name);
                if (scripts.length === 1) {
                    go.AddComponent(scripts[0].type);
                }
            }

            scene.gameObjects.push(go);
            //return scene;
        }

        this.activeScene = scene;
        this.app.pixi.renderer.render(scene.container);
        this.app.pixi.stage = scene.container;
    }
}
