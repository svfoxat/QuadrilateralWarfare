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
import {Forcefield} from "../../Engine/Forcefield";

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
        scene.Add(spring_go);

        let vertA = new Vector2(0, 10 * Math.sqrt(3) / 3);
        let vertB = new Vector2(-5, 10 * -Math.sqrt(3) / 6);
        let vertC = new Vector2(5, 10 * -Math.sqrt(3) / 6);

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
        rb2.mass = 25;
        rb6.verletVelocity = true;
        rb2.verletVelocity = true;
        go2.transform.position = new Point(960, 300);

        let go = new Gameobject(new Transform(), spring_go);
        go.transform.position = new Point(0, 0);
        let ps = new ParticleSystem(PIXI.Texture.WHITE, 100, 5, 1, 0xffffff,
            new Vector2(0, 0), new Vector2(0, 0), false, 10, false, new Vector2(10, 10),
            null, () => {
                return Random.OnUnitCircle().Mul(10);
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
        application.pixi.stage.addChild(sprite2);
        Forcefield.DrawForceField(scene);
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
}
