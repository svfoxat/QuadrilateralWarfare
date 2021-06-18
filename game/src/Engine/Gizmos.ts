import {Vector2} from "./Math/Vector2";

export class Gizmos {
    public static DrawPoint(pos: Vector2, radius: number, color: number, lineWidth: number, lineColor: number): PIXI.Graphics {
        let point = new PIXI.Graphics();
        point.lineStyle(lineWidth, lineColor);
        point.beginFill(color);
        point.drawCircle(pos.x, pos.y, radius);
        point.endFill();
        return point;
    }

    public static DrawArrow(from: Vector2, to: Vector2, width: number, color: number): PIXI.Graphics {
        let arrow = new PIXI.Graphics();
        let normal = Vector2.Sub(to, from).LeftNormal().Normalized().Mul(2 * width);
        let arrowStart = from.Add(to.Sub(from).Sub(to.Sub(from).Normalized().Mul(4 * width)));
        arrow
            .lineStyle(width, color)
            .moveTo(from.x, from.y)
            .lineTo(to.x, to.y)
            .lineStyle(width, color, 1, .5)
            .beginFill(color)
            .moveTo(arrowStart.x, arrowStart.y)
            .lineTo(arrowStart.x + normal.x, arrowStart.y + normal.y)
            .lineTo(to.x, to.y)
            .moveTo(arrowStart.x, arrowStart.y)
            .lineTo(arrowStart.x - normal.x, arrowStart.y - normal.y)
            .lineTo(to.x, to.y)
            .endFill();
        return arrow;
    }

    public static DrawLine(from: Vector2, to: Vector2, width: number, color: number): PIXI.Graphics {
        let line = new PIXI.Graphics();
        line
            .lineStyle(width, color)
            .moveTo(from.x, from.y)
            .lineTo(to.x, to.y);
        return line;
    }
}
