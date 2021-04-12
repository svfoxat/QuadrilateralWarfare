import {SceneManager} from "./SceneManager";
import {ResourceManager} from "./ResourceManager";
import {Time} from "./Time";
import {BoxCollider, Collider} from "./Components/Collider";
import {Vector2} from "./Vector2";

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
        this.pixi.ticker.add((deltaTime => {
            document.title = `${SceneManager.getInstance().activeScene.name} - ${this.name}`;
            Time.delta = deltaTime;
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
                    if (i >= j || (colliders[i].attachedRigidbody?.mass == 0 && colliders[j].attachedRigidbody?.mass == 0)) continue;
                    let collision = Collider.IsColliding(colliders[i], colliders[j]);
                    if (collision != null) {
                        console.log("Collision");
                        // Handle collision (move faster body out of collision)
                        Collider.HandleCollision(colliders[i], colliders[j], collision);
                        let collisionPoint = Collider.GetContactPoint(colliders[i], colliders[j], collision);
                        this.DrawContactPoint(collisionPoint);
                        Collider.ComputeAndApplyForces(colliders[i], colliders[j], collision, collisionPoint);


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
