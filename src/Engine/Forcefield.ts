import {Vector2} from "./Math/Vector2";
import {Scene} from "./Scene";
import {Gizmos} from "./Gizmos";

export class Forcefield {
    static rows: number = 10;
    static columns: number = 20;
    static visualizationVectors: Array<PIXI.Graphics> = new Array<PIXI.Graphics>(Forcefield.rows * Forcefield.columns);

    static DrawForceField(scene: Scene) {
        let pos = new Vector2(0, 0);
        let i = 0;
        for (let vector of this.visualizationVectors) {
            scene.container.removeChild(vector);
            vector = Gizmos.DrawArrow(pos, pos.Add(this.GetForceAtPosition(pos, 1).Mul(2)), 3, 0xFFFFFF);
            pos.x = (1920 / this.columns * i) % 1920;
            pos.y = (Math.floor((1920 / this.columns * i) / 1920) * 1080 / this.rows);
            i++;
            scene.container.addChild(vector);
        }
    }

    static UndrawForceField(scene: Scene) {
        for (let vector of this.visualizationVectors) {
            scene.container.removeChild(vector);
        }
    }

    static GetForceAtPosition(pos: Vector2, mass: number): Vector2 {
        return this.GetGenericGravity(mass);//.Add(this.GetDynamicWind(pos));
    }

    static GetGenericGravity(mass: number): Vector2 {
        return new Vector2(0, 10 * mass);
    }

    static GetDynamicWind(pos: Vector2): Vector2 {
        let y = pos.y;
        let maxY = 1080;
        let windConstant = 10;
        return new Vector2((maxY - 2 * y) * windConstant / maxY, 0);
    }
}
