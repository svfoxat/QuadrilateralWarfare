import {Scene} from "../../Engine/Scene";
import Application from "../../Engine/Application";
import {Gameobject} from "../../Engine/Gameobject";
import {Point, Transform} from "pixi.js";
import {Vector2} from "../../Engine/Math/Vector2";
import {Rigidbody} from "../../Engine/Components/Rigidbody";
import {SpriteRenderer} from "../../Engine/Components/SpriteRenderer";
import {BoxCollider} from "../../Engine/Components/BoxCollider";
import ObjectMoveScript from "./ObjectMoveScript";
import {SpringJoint} from "../../Engine/Components/SpringJoint";

export class SceneScript {
    public static GetMainScene(application: Application): Scene {
        let scene = new Scene();
        scene.sceneRoot = new Gameobject(new Transform(), null);

        // let go = new Gameobject(new Transform(), scene.sceneRoot);
        // go.transform.position = new Point(500, 100);
        // let ps = new ParticleSystem(PIXI.Texture.WHITE, 300, 1, 3, 0xff00ff, new Vector2(0, 0), new Vector2(0, 0));
        // go.AddExistingComponent(ps);
        // scene.Add(go);

        // let gamecontroller = new Gameobject(new Transform(), scene.sceneRoot);
        // gamecontroller.AddComponent(GameController);
        //

        // let floor = Gameobject.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1000, 1100), new Vector2(200, 20), 0x00FF00);
        // let top = Gameobject.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1000, 0), new Vector2(200, 20), 0x00FF00);
        // let right = Gameobject.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1900, 200), new Vector2(20, 200), 0x00FF00);
        // let left = Gameobject.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(0, 200), new Vector2(20, 200), 0x00FF00);

        //
        // let redBox = Gameobject.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1000, 700), new Vector2(10, 10), 0xFF00FF);
        // redBox.parent = gamecontroller;
        // let rb = redBox.GetComponent(Rigidbody) as Rigidbody;
        // let es = redBox.AddComponent(EnemyScript) as EnemyScript;
        // rb.useGravity = true;
        // rb.mass = 1;
        //
        // let redBox1 = Gameobject.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1100, 800), new Vector2(80, 5), 0xFF0000);
        // let rb4 = redBox1.GetComponent(Rigidbody) as Rigidbody;
        // rb4.useGravity = true;
        // rb4.mass = 1;
        //
        // let redBox2 = Gameobject.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1400, 1000), new Vector2(5, 30), 0xFF0000);
        // let rb3 = redBox2.GetComponent(Rigidbody) as Rigidbody;
        // rb3.useGravity = true;
        // rb3.mass = 1;
        //
        // let redBox3 = Gameobject.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(800, 1000), new Vector2(5, 30), 0xFF0000);
        // let rb5 = redBox3.GetComponent(Rigidbody) as Rigidbody;
        // rb5.useGravity = true;
        // rb5.mass = 1;
        //
        // const sprite2 = new PIXI.Sprite(PIXI.Texture.WHITE);
        // let go2 = new Gameobject(new Transform(), null);
        // go2.name = "Player";
        // let spriteRenderer2 = go2.AddComponent(SpriteRenderer) as SpriteRenderer;
        // let boxCollider2 = go2.AddComponent(BoxCollider) as BoxCollider;
        // let rb2 = go2.AddComponent(Rigidbody) as Rigidbody;
        // let input = go2.AddComponent(ObjectMoveScript) as ObjectMoveScript;
        // rb2.angularVelocity = 0;
        // rb2.velocity = new Vector2(1, 0);//Vector2.Zero();
        // rb2.mass = 10;
        // sprite2.tint = 0x123456;
        // go2.transform.scale = new Vector2(5, 5).AsPoint();
        // go2.transform.position = new Point(400, 800);
        // boxCollider2.size.x = sprite2.width * go2.transform.scale.x;
        // boxCollider2.size.y = sprite2.height * go2.transform.scale.y;
        // boxCollider2.attachedRigidbody = rb2;
        // boxCollider2.application = application;
        // spriteRenderer2.sprite = sprite2;
        // sprite2.interactive = true;
        // sprite2.on("mousedown", e => {
        //     rb2.useGravity = true;
        // });
        // scene.Add(go2);
        // application.pixi.stage.addChild(sprite2);

        const sprite2 = new PIXI.Sprite(PIXI.Texture.WHITE);
        let go2 = new Gameobject(new Transform(), null);
        go2.name = "Player";
        let spriteRenderer2 = go2.AddComponent(SpriteRenderer) as SpriteRenderer;
        let boxCollider2 = go2.AddComponent(BoxCollider) as BoxCollider;
        let rb2 = go2.AddComponent(Rigidbody) as Rigidbody;
        let input = go2.AddComponent(ObjectMoveScript) as ObjectMoveScript;
        rb2.angularVelocity = 0;
        rb2.velocity = Vector2.Zero()
        sprite2.tint = 0x123456;
        go2.transform.scale = new Vector2(5, 5).AsPoint();
        boxCollider2.size.x = sprite2.width * go2.transform.scale.x;
        boxCollider2.size.y = sprite2.height * go2.transform.scale.y;
        boxCollider2.attachedRigidbody = rb2;
        boxCollider2.application = application;
        spriteRenderer2.sprite = sprite2;
        sprite2.interactive = true;
        sprite2.on("mousedown", e => {
            rb2.useGravity = true;
        });

        const spring_go = new Gameobject(new Transform(), scene.sceneRoot);
        spring_go.transform.position = new Point(960, 540);
        let spriteRenderer3 = spring_go.AddComponent(SpriteRenderer) as SpriteRenderer;
        spriteRenderer3.sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
        spring_go.transform.scale = new Point(3, 3)

        const sj = spring_go.AddComponent(SpringJoint) as SpringJoint;
        sj.AttachObject(go2);
        rb2.mass = 25;
        rb2.useGravity = false;
        rb2.verletVelocity = true;
        go2.transform.position = new Point(960, 300);

        scene.Add(go2);
        scene.Add(spring_go);
        application.pixi.stage.addChild(sprite2);
        return scene;
    }
}
