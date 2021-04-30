import {Component} from "../../Engine/Components/Component";
import {TextRenderer} from "../../Engine/Components/TextRenderer";
import {Time} from "../../Engine/Time";

export default class PerformanceDisplay extends Component {
    text1: TextRenderer;

    Enable = () => {
        this.text1 = this.gameObject.AddComponent(TextRenderer) as TextRenderer;

        this.text1.text = "";
        this.text1.style.fontSize = 25;
        this.text1.position.set(300, 150);
    }

    Update = () => {
        let frameTime = Time.elapsedMS;
        let fps = Math.ceil(1000/frameTime)

        this.text1.text = `Renderloop:  ${Math.ceil(frameTime)}ms, ${fps}fps\n` +
                          `Physicsloop: ${Time.t}ms, ${Math.ceil(1000 / Time.t)}it/s`
    }
}
