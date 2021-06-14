import {MeshComponent} from "./MeshComponent";
import {Vector2} from "../Math/Vector2";

export class TriangleRenderer extends MeshComponent {
    constructor(texture: PIXI.Texture, vertexA: Vector2, vertexB: Vector2, vertexC: Vector2) {
        super(texture, new Float32Array([vertexA.x, vertexA.y, vertexB.x, vertexB.y, vertexC.x, vertexC.y]),
            null, new Uint16Array([0, 1, 2]));
    }
}
