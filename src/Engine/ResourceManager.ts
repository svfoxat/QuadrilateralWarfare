import Application from "./Application";
import * as PIXI from "pixi.js";

export class ResourceManager {
    private static instance: ResourceManager;
    public static initialize(app: Application) {
        this.instance = new this(app);
    }
    public static getInstance(): ResourceManager {
        if (!this.instance)
            throw new Error("Initialize me first!");
        else
            return this.instance;
    }

    private app: Application;
    private constructor(app: Application) {
        this.app = app;
        this.loadResources();
    }

    private loadResources() {

    }
}
