import {SceneManager} from "./SceneManager";
import {ResourceManager} from "./ResourceManager";
import {Time} from "./Time";
import {BoxCollider, Collider} from "./Components/Collider";

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
        this.appContainer = document.getElementById("app_container");
        this.appContainer.appendChild(this.pixi.view);

        this.init();
        this.start();
    }

    private init() {
        SceneManager.initialize(this);
        ResourceManager.initialize(this);

        document.title = this.name;
    }

    private start() {
        this.pixi.ticker.add((deltaTime => {
            document.title = `${SceneManager.getInstance().activeScene.name} - ${this.name}`;

            SceneManager.getInstance().activeScene.sceneRoot.Update();
        }));

        setInterval(() => {
            SceneManager.getInstance().activeScene.sceneRoot.FixedUpdate();

            let colliders = new Array<BoxCollider>();
            for (let go of SceneManager.getInstance().activeScene.sceneRoot.children) {
                let coll = go.GetComponent(BoxCollider) as BoxCollider;
                if (coll != null) {
                    colliders.push(coll);
                }
            }
            for (let i = 0; i < colliders.length; i++) {
                for (let j = 0; j < colliders.length; j++) {
                    if (i >= j) continue;
                    let collision = Collider.IsColliding(colliders[i], colliders[j]);
                    if (collision != null) {
                        console.log("Collision");
                        // Handle collision
                        // Get contact point
                        // From contact point, calculate and apply forces
                    }
                }
            }

        }, Time.t)
    }
}

export interface IApplicationProperties {
    name: string;
    width: number
    height: number;
    userScripts?: any;
}
