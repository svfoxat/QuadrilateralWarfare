import {Vector2} from "./Math/Vector2";
import {Scene} from "./Scene";
import {Gizmos} from "./Gizmos";
import {Random} from "./Math/Random";

export class Forcefield {
    static rows: number = 10;
    static columns: number = 20;
    static visualizationVectors: Array<PIXI.Graphics> = new Array<PIXI.Graphics>();

    static DrawForceField(scene: Scene) {
        let pos = new Vector2(0, 0);
        let i = 0;
        for (let idx = 0; idx < Forcefield.rows * Forcefield.columns; idx++) {
            this.visualizationVectors.push(Gizmos.DrawArrow(pos, pos.Add(this.GetForceAtPosition(pos, 1).Mul(2)), 3, 0xFFFFFF));
            pos.x = (1920 / this.columns * i) % 1920;
            pos.y = (Math.floor((1920 / this.columns * i) / 1920) * 1080 / this.rows);
            i++;
            scene.container.addChild(this.visualizationVectors[idx]);
        }
    }

    static UndrawForceField(scene: Scene) {
        for (let vector of this.visualizationVectors) {
            scene.container.removeChild(vector);
        }
        this.visualizationVectors = [];
    }

    static GetForceAtPosition(pos: Vector2, mass: number): Vector2 {
        return this.GetGenericGravity(mass).Add(this.GetDynamicWind(pos));
    }

    static GetGenericGravity(mass: number): Vector2 {
        return new Vector2(0, 10 * mass);
    }

    static GetDynamicWind(pos: Vector2): Vector2 {
        let y = pos.y + 500;
        let maxY = 1080 / 2;
        let x = pos.x - 1000;
        let maxX = 1920 / 2;
        let windConstant = 10;
        return new Vector2(((maxY - 2 * y) * windConstant / maxY) / 2, (maxX - 2 * x) * windConstant / maxX);
    }
}
