import {Component} from "./Component";
import {Gameobject} from "../Gameobject";

export class TextRenderer extends Component {
    gameObject: Gameobject
    _text: PIXI.Text;

    public text: string = "";
    public style: PIXI.TextStyleOptions = { fontFamily : 'Arial', fontSize: 100, fill : 0xff1010, align : 'center'}
    public position: PIXI.Point;

    Enable = () => {
        this._text = new PIXI.Text(this.text, this.style);
        this.position = new PIXI.Point(0,0);
        this._text.
    }

    Start = () => {
        this._text["textRenderer"] = this;
        this.gameObject.scene?.container.addChild(this._text);
    }

    Update = () => {
        if (!this._text) return;

        // update text and style
        this._text.text = this.text;
        Object.keys(this.style).forEach((k => this._text.style[k] = this.style[k]));

        // pivot, (position, rotation, scale) from transform
        let transform = this.gameObject.absoluteTransform;
        this._text.position.set(transform.position.x + this.position.x, transform.position.y + this.position.y);
        this._text.pivot.set((this._text.width / transform.scale.x) / 2, (this._text.height / transform.scale.y) / 2);
        this._text.rotation = transform.rotation;
    }
}
