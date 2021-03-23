import {Gameobject} from "../Gameobject";
import {Transform} from "pixi.js";

export class Scene {
    app: PIXI.Application;
    container: PIXI.Container;
    gameObjects: Array<Gameobject> = [];
    sceneRoot: Gameobject;

    constructor(app: PIXI.Application) {
        this.app = app;
        this.container = new PIXI.Container();
        this.sceneRoot = new Gameobject(new Transform(), null);
    }

    public Add(g: Gameobject) {
        if (!g.parent) {
            g.parent = this.sceneRoot;
            this.sceneRoot.children.push(g)
        }

        this.gameObjects.push(g);
        g.scene = this;
    }

    public Update() {

    }

    public SetActive(cb: (deltaTime: number) => void) {
        this.app.renderer.render(this.container);
        this.app.stage = this.container;

        this.app.ticker.add((delta) => {
            cb(delta);
            this.sceneRoot.Update();
        })
    }
}
