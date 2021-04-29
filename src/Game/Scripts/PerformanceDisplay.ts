import {Component} from "../../Engine/Components/Component";
import {TextRenderer} from "../../Engine/Components/TextRenderer";

export default class PerformanceDisplay extends Component {
    text1: TextRenderer;
    text2: TextRenderer;

    Enable = () => {
        this.text1 = this.gameObject.AddComponent(TextRenderer) as TextRenderer;
        this.text2 = this.gameObject.AddComponent(TextRenderer) as TextRenderer;

        this.text1.text = "FPS";
        this.text2.text = "PHYSIX"

        console.log(this.text1)
    }

    Update = () => {

    }
}
