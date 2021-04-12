import {Gameobject} from "./Gameobject";
import {Transform} from "pixi.js";

export class Scene {
    name: string = "Scene";
    container: PIXI.Container;
    gameObjects: Array<Gameobject> = [];
    sceneRoot: Gameobject;

    constructor() {
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
}