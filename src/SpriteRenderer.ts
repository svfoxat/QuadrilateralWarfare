import {Component} from "./Component";
import {Gameobject} from "./Gameobject";


export class SpriteRenderer extends Component
{
    gameObject: Gameobject;
    name: string;
    sprite: PIXI.Sprite;

    OnEnable = (): void => {

    };

    Start = (): void => {

    };

    Update = (): void => {
        if (!this.sprite) return;

        // pivot, (position, rotation, scale) from transform
        let transform = this.gameObject.absoluteTransform;
        this.sprite.position.set(transform.position.x, transform.position.y);
        this.sprite.scale.set(transform.scale.x, transform.scale.y);
        this.sprite.pivot.set(this.sprite.width / 2, this.sprite.height / 2);
        this.sprite.rotation = transform.rotation;


    };
}
