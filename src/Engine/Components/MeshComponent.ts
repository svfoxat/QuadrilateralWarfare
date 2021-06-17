import {Component} from "./Component";
import {Vector2} from "../Math/Vector2";

export class MeshComponent extends Component {
    mesh: PIXI.mesh.Mesh;
    localVertices: Float32Array;
    realVertices: Float32Array;

    constructor(texture: PIXI.Texture, vertices?: Float32Array, uvs?: Float32Array, indices?: Uint16Array, drawMode?: number) {
        super();
        this.mesh = new PIXI.mesh.Mesh(texture, null, uvs, indices, drawMode);
        this.localVertices = vertices;
    }

    Enable = () => {
    }

    Update = () => {
        if (this.gameObject == null || this.localVertices == null) return;
        if (this.realVertices == null) this.realVertices = new Float32Array(this.localVertices.length);
        for (let i = 0; i < this.localVertices.length; i += 2) {
            let pos = this.gameObject.absoluteTransform.position;
            let scale = this.gameObject.absoluteTransform.scale;
            let rota = new Vector2(this.localVertices[i], this.localVertices[i + 1])
                .Rotate(this.gameObject.absoluteTransform.rotation);
            this.realVertices[i] = scale.x * rota.x + pos.x;
            this.realVertices[i + 1] = scale.y * rota.y + pos.y;
        }
        this.mesh.vertices = this.realVertices;
    }

    OnDestroy = () => {
        this.mesh.destroy();
    }
}
