import {SceneManager} from "./SceneManager";
import {ResourceManager} from "./ResourceManager";
import {Time} from "./Time";
import {Collider} from "./Components/Collider";
import {Vector2} from "./Vector2";
import {ClippingPlane} from "./Geometry";
import {InputManager} from "./InputManager";
import {BoxCollider} from "./Components/BoxCollider";

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
        this.pixi.ticker.add((deltaTime => {
            document.title = `${SceneManager.getInstance().activeScene.name} - ${this.name}`;
            Time.delta = deltaTime;
            SceneManager.getInstance().activeScene.sceneRoot.Update();
        }));

        let normalArrow: PIXI.Graphics = null;

        setInterval(() => {
            SceneManager.getInstance().activeScene.sceneRoot.FixedUpdate();
            let colliders = new Array<BoxCollider>();
            for (let go of SceneManager.getInstance().activeScene.sceneRoot.children) {
                let coll = go.GetComponent(BoxCollider) as BoxCollider;
                if (coll != null && coll.enabled) {
                    colliders.push(coll);
                }
            }
            for (let i = 0; i < colliders.length; i++) {
                for (let j = 0; j < colliders.length; j++) {
                    if (i >= j || (colliders[i].attachedRigidbody?.mass == 0 && colliders[j].attachedRigidbody?.mass == 0)) continue;
                    let collision = Collider.IsColliding(colliders[i], colliders[j]);
                    if (collision != null) {
                        if (!(collision.Dot(Vector2.FromPoint(colliders[i].gameObject.transform.position).Sub(Vector2.FromPoint(colliders[j].gameObject.transform.position))) < 0.0)) {
                            collision = collision.Inverse();
                        }
                        Collider.HandleCollision(colliders[i], colliders[j], collision);
                        let cp = new ClippingPlane(null, null, null);
                        let collisionPoint = Collider.GetContactPoint(colliders[i], colliders[j], collision, cp);
                        let normal = !cp.flip ? cp.ref.vector().LeftNormal().Inverse() : cp.ref.vector().LeftNormal();
                        let currCP = collisionPoint.filter(e => e != undefined)[collisionPoint.filter(e => e != undefined).length - 1];

                        Collider.ComputeAndApplyForces(colliders[i], colliders[j], collision, currCP, normal.Normalized());
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
