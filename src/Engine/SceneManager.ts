import Application from "./Application";
import {Scene} from "./Scene";

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
}
