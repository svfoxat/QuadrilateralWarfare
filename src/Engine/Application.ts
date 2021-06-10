import {SceneManager} from "./SceneManager";
import {ResourceManager} from "./ResourceManager";
import {Time} from "./Time";
import {Collider} from "./Components/Collider";
import {Vector2} from "./Math/Vector2";
import {InputManager} from "./InputManager";
import {Scene} from "./Scene";

export default class Application {
    name: string;
    pixi: PIXI.Application;
    userScripts: any;
    appContainer: HTMLElement;
    activeScene: Scene = null;

    public desiredFPS: number = 30;
    private renderTicker: PIXI.ticker.Ticker;
    private renderInterval: NodeJS.Timeout;

    private animationTicker: PIXI.ticker.Ticker;
    private animationInterval: NodeJS.Timeout;
    public desiredT: number = 1;

    constructor({ width, height, name, userScripts }: IApplicationProperties) {
        // @ts-ignore
        window.app = this;

        PIXI.settings.RESOLUTION = window.devicePixelRatio;
        PIXI.settings.RENDER_OPTIONS.antialias = true;

        this.name = name;
        this.userScripts = userScripts;

        this.pixi = new PIXI.Application({
            width, height,
            antialias: true,
        });
        this.pixi.renderer.view.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        this.appContainer = document.getElementById("app_container");
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

    contactPoint = new PIXI.Graphics();
    private DrawContactPoint(contactPoint: Vector2): void {
        this.contactPoint.clear();
        this.contactPoint.lineStyle(2, 0xFF0000);
        this.contactPoint.beginFill(0xFFFF00);
        this.contactPoint.drawCircle(contactPoint.x, contactPoint.y, 5);
        this.contactPoint.endFill();
        this.pixi.stage.addChild(this.contactPoint);
    }

    private start() {
        this.renderInterval && clearInterval(this.renderInterval);
        this.animationInterval && clearInterval(this.animationInterval);

        this.renderInterval = this.startRenderLoop(this.desiredFPS);
        this.animationInterval = this.startAnimationLoop(this.desiredT);
    }

    public SetMaxFPS(fps: number) {
        this.desiredFPS = fps;
        this.start();
    }

    public SetAnimationT(t: number) {
        this.desiredT = t;
        this.start();
    }

    private startRenderLoop(desiredFPS: number) {
        if (!this.renderTicker) {
            this.renderTicker = new PIXI.ticker.Ticker()
            this.renderTicker.autoStart = false;
            this.renderTicker.start();
        }

        return setInterval(() => {
            this.renderTicker.update(performance.now());
            Time.delta = this.renderTicker.deltaTime;
            Time.elapsedMS = this.renderTicker.elapsedMS;
            SceneManager.getInstance().activeScene?.sceneRoot.Update();
            this.pixi.renderer.render(this.pixi.stage);
        }, 1000 / desiredFPS)
    }

    private startAnimationLoop(t: number) {
        if (!this.animationTicker) {
            this.animationTicker = new PIXI.ticker.Ticker()
            this.animationTicker.autoStart = false;
            this.animationTicker.start();
        }

        Time.t = t;
        return setInterval(() => {
            this.animationTicker.update(performance.now());

            Time.animationDelta = this.animationTicker.deltaTime;
            Time.animationElapsedMS = this.animationTicker.elapsedMS;

            SceneManager.getInstance().activeScene.sceneRoot.FixedUpdate();
            Collider.CollisionCheck();

        }, t)
    }
}

export interface IApplicationProperties {
    name: string;
    width: number
    height: number;
    userScripts?: any;
}
