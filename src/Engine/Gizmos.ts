import {Vector2} from "./Vector2";

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
        let normal = Vector2.Sub(to, from).LeftNormal().Normalized();
        arrow
            .lineStyle(width, color)
            .moveTo(from.x, from.y)
            .lineTo(to.x, to.y)
            .lineStyle(width, color, 1, .5)
            .beginFill(color)
            .lineTo(to.x + normal.x * 10, to.y + normal.y * 10)
            .lineTo(to.x - normal.x * 10, to.y - normal.y * 10)
            .lineTo(to.x, to.y)
            .endFill();
        return arrow;
    }
}
