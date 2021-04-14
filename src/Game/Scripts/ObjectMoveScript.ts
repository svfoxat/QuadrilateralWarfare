import {Component} from "../../Engine/Components/Component";
import {Gameobject} from "../../Engine/Gameobject";
import {InputManager} from "../../Engine/InputManager";
import InteractionEvent = PIXI.interaction.InteractionEvent;

export default class ObjectMoveScript extends Component {
    gameObject: Gameobject;
    name: string = "ObjectMoveScript";

    private inputManager: InputManager;
    private moveSpeed = 1.0;
    private drag: boolean = false;

    Start = (): void => {
        this.inputManager = InputManager.getInstance();
    }

    OnMouseDown = (): void => {
        if (this.inputManager.Mouse.leftClick) {
            this.drag = true;
        }
    }

    OnMouseUp = (): void => {
       this.drag = false;
    }

    Update = (): void => {
        let modifier;

        if (this.inputManager.Keyboard.shift) {
            modifier = 2.0;
        } else {
            modifier = 1.0;
        }

        if (this.inputManager.Keyboard.A) {
            this.gameObject.transform.position.x -= this.moveSpeed * modifier;
        }
        if (this.inputManager.Keyboard.D) {
            this.gameObject.transform.position.x += this.moveSpeed * modifier;
        }
        if (this.inputManager.Keyboard.W) {
            this.gameObject.transform.position.y -= this.moveSpeed * modifier;
        }
        if (this.inputManager.Keyboard.S) {
            this.gameObject.transform.position.y += this.moveSpeed * modifier;
        }

        if (this.inputManager.Keyboard.Q) {
            this.gameObject.transform.rotation -= (this.moveSpeed / 360) * modifier;
        }
        if (this.inputManager.Keyboard.E) {
            this.gameObject.transform.rotation += (this.moveSpeed / 360) * modifier;
        }

        let { mouseWheel } = this.inputManager.Mouse;
        if (mouseWheel && mouseWheel.deltaY) {
            const dir = mouseWheel.deltaY > 0 ? -1: 1;
            let currX, currY;
            currX = this.gameObject.transform.scale.x;
            currY = this.gameObject.transform.scale.y;

            this.gameObject.transform.scale.set(currX + dir * 0.01, currY + dir * 0.01);

            // reset the wheel
            this.inputManager.Mouse.mouseWheel = null;
        }

        if (this.drag) {
            const {x, y } = this.inputManager.currPos;
            this.gameObject.transform.position.set(x, y);
        }
    };
}
