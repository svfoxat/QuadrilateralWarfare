import {Component} from "../../Engine/Components/Component";
import {TextRenderer} from "../../Engine/Components/TextRenderer";
import {Time} from "../../Engine/Time";

export default class PerformanceDisplay extends Component {
    name: string = "PerformanceDisplay"
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

        let animFrameTime = Time.animationElapsedMS;
        let animFPS = Math.ceil(1000 / animFrameTime);

        this.text1.text = `Renderloop:  ${Math.ceil(frameTime)}ms, ${fps}fps\n` +
                          `Physicsloop: ${Math.ceil(animFrameTime)}ms, ${animFPS}it/s`
    }
}
