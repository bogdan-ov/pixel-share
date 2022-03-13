import { ToolType } from "..";
import State, { state } from "../../../states/State";
import { vec, Vector2 } from "../../../utils/math";
import Keyboard from "../../managers/Keyboard";
import Mouse from "../../managers/Mouse";
import { Renderer } from "../../renderer/Renderer";
import Tool from "../Tool";

export default class ShapeTool extends Tool {
    from: Vector2
    start: Vector2
    end: Vector2
    shapeWidth: number
    shapeHeight: number

    drawFromCenter: boolean
    aspectRatio: boolean
    
    constructor(type: ToolType) {
        super(type);

        this.from = vec();
        this.start = vec();
        this.end = vec();
        this.shapeWidth = 0;
        this.shapeHeight = 0;

        this.drawFromCenter = false;
        this.aspectRatio = false;
    }

    onStartDraw(renderer: Renderer): void {
        super.onStartDraw(renderer);
    }
    onDraw(renderer: Renderer): void {
        super.onDraw(renderer);

        this.drawFromCenter = Keyboard.isCtrl;
        this.aspectRatio = Keyboard.isShift;
        
        this.from.copy(Mouse.startPos);

        if (this.aspectRatio) {
            // Save aspect ratio
            const x = Mouse.pos.x - Mouse.startPos.x;
            const y = Mouse.pos.y - Mouse.startPos.y;
            const dir = vec(
                Mouse.pos.x > Mouse.startPos.x ? 1 : -1,
                Mouse.pos.y > Mouse.startPos.y ? 1 : -1
            );
            const max = Math.max(
                Math.abs(x),
                Math.abs(y)
            );

            this.end.copy(vec(max * dir.x, max * dir.y).add(Mouse.startPos));
        } else
            // Not
            this.end.copy(Mouse.pos);

        if (this.drawFromCenter) {
            // Draw from center
            this.start.copy(this.from.add(this.from.sub(this.end)));
        } else
            // Normal draw
            this.start.copy(this.from);

        const width = (this.end.x - this.start.x)
        const height = (this.end.y - this.start.y);
        this.shapeWidth = width;
        this.shapeHeight = height;
    }
    onEndDraw(renderer: Renderer): void {
        super.onEndDraw(renderer);

        this.aspectRatio = false;
        this.drawFromCenter = false;
    }
}