import {SceneManager} from "./SceneManager";
import {ResourceManager} from "./ResourceManager";

export default class Application {
    name: string;
    pixi: PIXI.Application;
    userScripts: any;
    appContainer: HTMLElement;

    constructor({ width, height, name, userScripts }: IApplicationProperties) {
        this.name = name;
        this.userScripts = userScripts;

        this.pixi = new PIXI.Application({
            width, height,
            antialias: true,
        });
        this.appContainer = document.getElementById("app_container")
        this.appContainer.appendChild(this.pixi.view);

        this.init();
        this.start();
    }

    private init() {
        SceneManager.initialize(this);
        ResourceManager.initialize(this);
    }

    private start() {
        this.pixi.ticker.add((deltaTime => {
            SceneManager.getInstance().activeScene.sceneRoot.Update();
        }))
    }
}

export interface IApplicationProperties {
    name: string;
    width: number
    height: number;
    userScripts?: any;
}
