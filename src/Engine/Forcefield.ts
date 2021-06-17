import {Vector2} from "./Math/Vector2";
import {Scene} from "./Scene";
import {Gizmos} from "./Gizmos";
import {Time} from "./Time";
import {Debug} from "./Debug";

export class Forcefield {
    static rows: number = 10;
    static columns: number = 20;
    static visualizationVectors: Array<PIXI.Graphics> = new Array<PIXI.Graphics>(Forcefield.rows * Forcefield.columns);
    static added: Array<boolean> = new Array<boolean>(Forcefield.rows * Forcefield.columns);

    static DrawForceField(scene: Scene) {
        let pos = new Vector2(0, 0);
        let i = 0;
        for (let idx = 0; idx < Forcefield.rows * Forcefield.columns; idx++) {
            scene.container.removeChild(this.visualizationVectors[idx]);

            if (Debug.forceFields) {
                this.visualizationVectors[idx] = (Gizmos.DrawArrow(pos, pos.Add(this.GetForceAtPosition(pos, 1).Mul(2)), 3, 0xFFFFFF));
                pos.x = 50 + (1920 / this.columns * i) % 1920;
                pos.y = 20 + (Math.floor((1920 / this.columns * i) / 1920) * 1080 / this.rows);
                i++;
                scene.container.addChild(this.visualizationVectors[idx]);
            }
        }
    }

    static GetForceAtPosition(pos: Vector2, mass: number): Vector2 {
        let force = Vector2.Zero();
        if (Debug.vectorField) force = this.GetDynamicWind(pos);
        if (Debug.timeVariant) force = force.SimpleMult(new Vector2(Math.cos(Time.realTime / 5000), Math.sin(Time.realTime / 5000)));
        force = force.Add(this.GetGenericGravity(mass));
        return force;
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
        if (Debug.invertVectorField) {
            return new Vector2(-((maxY - 2 * y) * windConstant / maxY / 2), -((maxX - 2 * x) * windConstant / maxX / 2));
        } else {
            return new Vector2(((maxY - 2 * y) * windConstant / maxY / 2), ((maxX - 2 * x) * windConstant / maxX / 2));
        }
    }
}
