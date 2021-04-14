import {SceneManager} from "./SceneManager";
import {ResourceManager} from "./ResourceManager";
import {InputManager} from "./InputManager";

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
        InputManager.initialize(this.pixi.renderer);

        document.title = this.name;
    }

    private start() {
        this.pixi.ticker.add((deltaTime => {
            document.title = `${SceneManager.getInstance().activeScene.name} - ${this.name}`;
            SceneManager.getInstance().activeScene.sceneRoot.Update();
        }))

        const intervall = setInterval(() => {}, 100);
        clearInterval(intervall);
    }
}

export interface IApplicationProperties {
    name: string;
    width: number
    height: number;
    userScripts?: any;
}
