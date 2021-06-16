import {Scene} from "../../Engine/Scene";
import Application from "../../Engine/Application";
import {Gameobject} from "../../Engine/Gameobject";
import {Point, Texture, Transform} from "pixi.js";
import {Vector2} from "../../Engine/Math/Vector2";
import {Rigidbody} from "../../Engine/Components/Rigidbody";
import {SpriteRenderer} from "../../Engine/Components/SpriteRenderer";
import {BoxCollider, TriangleCollider} from "../../Engine/Components/Collider";
import ObjectMoveScript from "./ObjectMoveScript";
import {ParticleSystem} from "../../Engine/Components/ParticleSystem";
import {TriangleRenderer} from "../../Engine/Components/TriangleRenderer";
import {EnemyScript} from "./EnemyScript";
import {GameController} from "./GameController";
import {SpringJoint} from "../../Engine/Components/SpringJoint";
import {ParticleTriggerOnCollision} from "./ParticleTriggerOnCollision";
import {Random} from "../../Engine/Math/Random";

export class SceneScript {
    public static GetMainScene(application: Application): Scene {
        let scene = new Scene();
        scene.sceneRoot = new Gameobject(new Transform(), null);

        let gamecontroller = new Gameobject(new Transform(), scene.sceneRoot);
        gamecontroller.AddComponent(GameController);

        let floor = this.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1000, 1100), new Vector2(200, 20), 0x00FF00);
        let top = this.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1000, 0), new Vector2(200, 20), 0x00FF00);
        let right = this.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1900, 200), new Vector2(20, 200), 0x00FF00);
        let left = this.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(0, 200), new Vector2(20, 200), 0x00FF00);

        let redBox = this.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1000, 700), new Vector2(10, 10), 0xFF00FF);
        redBox.parent = gamecontroller;
        let rb = redBox.GetComponent(Rigidbody) as Rigidbody;
        let es = redBox.AddComponent(EnemyScript) as EnemyScript;
        rb.isStatic = false;

        let redBox1 = this.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1100, 800), new Vector2(80, 5), 0xFF0000);
        let rb4 = redBox1.GetComponent(Rigidbody) as Rigidbody;
        rb4.isStatic = false;

        let redBox2 = this.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1400, 1000), new Vector2(5, 30), 0xFF0000);
        let rb3 = redBox2.GetComponent(Rigidbody) as Rigidbody;
        rb3.isStatic = false;

        let redBox3 = this.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(800, 1000), new Vector2(5, 30), 0xFF0000);
        let rb5 = redBox3.GetComponent(Rigidbody) as Rigidbody;
        rb5.isStatic = false;

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
        go2.transform.scale = new Vector2(20, 5).AsPoint();
        boxCollider2.size.x = sprite2.width * go2.transform.scale.x;
        boxCollider2.size.y = sprite2.height * go2.transform.scale.y;
        boxCollider2.attachedRigidbody = rb2;
        boxCollider2.application = application;
        spriteRenderer2.sprite = sprite2;
        sprite2.interactive = true;
        sprite2.on("mousedown", e => {
        });
        application.pixi.stage.addChild(sprite2);


        let vertA = new Vector2(0, 10 * Math.sqrt(3) / 3);
        let vertB = new Vector2(-5, 10 * -Math.sqrt(3) / 6);
        let vertC = new Vector2(5, 10 * -Math.sqrt(3) / 6);

        const spring_go = new Gameobject(new Transform(), scene.sceneRoot);
        scene.Add(spring_go);
        spring_go.name = "Spring";
        spring_go.transform.position = new Point(960, 540);
        let mesh = new TriangleRenderer(PIXI.Texture.WHITE, vertA, vertB, vertC);
        spring_go.AddExistingComponent(mesh);
        mesh.gameObject = spring_go;
        spring_go.transform.scale = new Point(5, 5);
        let sj = spring_go.AddComponent(SpringJoint) as SpringJoint;
        let rb6 = spring_go.AddComponent(Rigidbody) as Rigidbody;
        let tri = spring_go.AddComponent(TriangleCollider) as TriangleCollider;
        tri.attachedRigidbody = rb6;
        tri.vertexA = vertA;
        tri.vertexB = vertB;
        tri.vertexC = vertC;
        sj.AttachObject(go2);
        sj.offsetEnd.x = 80;
        rb6.verletVelocity = true;

        const spring_go1 = new Gameobject(new Transform(), scene.sceneRoot);
        scene.Add(spring_go1);
        spring_go1.name = "Spring";
        spring_go1.transform.position = new Point(960, 540);
        let mesh1 = new TriangleRenderer(PIXI.Texture.WHITE, vertA, vertB, vertC);
        spring_go1.AddExistingComponent(mesh1);
        mesh1.gameObject = spring_go1;
        spring_go1.transform.scale = new Point(5, 5);
        let sj1 = spring_go1.AddComponent(SpringJoint) as SpringJoint;
        let rb7 = spring_go1.AddComponent(Rigidbody) as Rigidbody;
        let tri1 = spring_go1.AddComponent(TriangleCollider) as TriangleCollider;
        tri1.attachedRigidbody = rb7;
        tri1.vertexA = vertA;
        tri1.vertexB = vertB;
        tri1.vertexC = vertC;
        sj1.AttachObject(go2);
        sj1.offsetEnd.x = -80;
        rb7.verletVelocity = true;

        rb2.mass = 5;
        rb2.verletVelocity = true;
        go2.transform.position = new Point(960, 300);

        let go = new Gameobject(new Transform(), spring_go);
        go.transform.position = new Point(0, 0);
        let ps = new ParticleSystem(PIXI.Texture.WHITE, 100, 5, 1, 0xffffff,
            new Vector2(0, 0), new Vector2(0, 0), false, 0, false, new Vector2(10, 10),
            null, () => {
                return Random.OnUnitCircle().Mul(20);
            }, null,
            (baseColor, timeRatio): number => {
                let colorRatio = Math.floor(256 * timeRatio);
                return (colorRatio * 256 * 256 + colorRatio * 256 + colorRatio);
            },
            (baseSize, timeRatio): Vector2 => {
                return baseSize.SimpleMult(new Vector2(timeRatio, timeRatio));
            }, null);
        go.AddExistingComponent(ps);
        go.AddComponent(ParticleTriggerOnCollision);

        scene.Add(go);
        scene.Add(go2);
        //Forcefield.DrawForceField(scene);
        return scene;
    }

    public static GetFirstLevel(application: Application, viewport: Vector2): Scene {
        let scene = new Scene();
        scene.sceneRoot = new Gameobject(new Transform(), null);

        let floor = this.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1000, 1150), new Vector2(200, 20), 0x333322);
        let top = this.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1000, -70), new Vector2(200, 20), 0x333322);
        let right = this.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1990, 200), new Vector2(20, 200), 0x333322);
        let left = this.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(-70, 200), new Vector2(20, 200), 0x333322);

        let redBox1 = this.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1650, 835), new Vector2(33, 3), 0xFFF0F0);
        let rb1 = redBox1.GetComponent(Rigidbody) as Rigidbody;
        rb1.isStatic = false;
        rb1.mass = 10;

        let redBox2 = this.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1500, 950), new Vector2(3, 20), 0xFFF000);
        let rb2 = redBox2.GetComponent(Rigidbody) as Rigidbody;
        rb2.isStatic = false;
        rb2.mass = 10;

        let redBox3 = this.CreateSprite(application, scene, PIXI.Texture.WHITE, new Vector2(1800, 950), new Vector2(3, 20), 0xFF00F0);
        let rb3 = redBox3.GetComponent(Rigidbody) as Rigidbody;
        rb3.isStatic = false;
        rb3.mass = 10;

        let sj1 = redBox1.AddComponent(SpringJoint) as SpringJoint;
        let sj2 = redBox1.AddComponent(SpringJoint) as SpringJoint;
        sj1.offsetStart.x = -150;
        sj1.offsetEnd.y = -90;
        sj1.Distance = 20;
        sj1.BreakForce = 100;
        sj1.AttachObject(redBox2);

        sj2.offsetStart.x = 150;
        sj2.offsetEnd.y = -90;
        sj2.Distance = 20;
        sj2.BreakForce = 100;
        sj2.AttachObject(redBox3);

        scene.Add(this.CreatePlayer(application));

        return scene;
    }

    public static CreateSprite(application: Application, scene: Scene, texture: Texture, pos: Vector2, size: Vector2, color: number): Gameobject {
        const sprite = new PIXI.Sprite(texture);
        sprite.tint = color;
        let go = new Gameobject(new Transform(), null);
        let spriteRenderer = go.AddComponent(SpriteRenderer) as SpriteRenderer;
        let boxCollider = go.AddComponent(BoxCollider) as BoxCollider;
        let rb = go.AddComponent(Rigidbody) as Rigidbody;
        rb.isStatic = true;
        rb.elasticity = 1;
        go.transform.position = pos.AsPoint();
        go.transform.scale = size.AsPoint();
        boxCollider.size.x = sprite.width * go.transform.scale.x;
        boxCollider.size.y = sprite.height * go.transform.scale.y;
        boxCollider.attachedRigidbody = rb;
        boxCollider.application = application;
        spriteRenderer.sprite = sprite;
        application.pixi.stage.addChild(sprite);
        scene.Add(go);
        return go;
    }

    public static CreatePlayer(application: Application): Gameobject {
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
        });
        application.pixi.stage.addChild(sprite2);
        return go2;
    }
}
