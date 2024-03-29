import {Component} from "./Component";
import {Gameobject} from "../Gameobject";


export class SpriteRenderer extends Component {
    name: string = "SpriteRenderer"
    gameObject: Gameobject;
    sprite: PIXI.Sprite = new PIXI.Sprite();

    Start = () => {
        this.sprite.interactive = true;
        this.sprite["spriteRenderer"] = this;
        this.gameObject.scene?.container.addChild(this.sprite);
    }

    Enable = () => {
        this.gameObject.scene?.container.addChild(this.sprite);
    }

    Update = (): void => {
        if (!this.sprite) return;

        // pivot, (position, rotation, scale) from transform
        let transform = this.gameObject.absoluteTransform;
        this.sprite.position.set(transform.position.x, transform.position.y);
        this.sprite.scale.set(transform.scale.x, transform.scale.y);
        this.sprite.pivot.set((this.sprite.width / transform.scale.x) / 2, (this.sprite.height / transform.scale.y) / 2);
        this.sprite.rotation = transform.rotation;
    };

    OnDestroy = () => {
        this.sprite.destroy();
    }
}
