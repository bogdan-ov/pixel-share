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
    to: Vector2
    dir: Vector2
    shapeWidth: number
    shapeHeight: number

    drawFromCenter: boolean
    aspectRatio: boolean

    allowNormalize: boolean
    
    constructor(type: ToolType) {
        super(type);

        this.from = vec();
        this.to = vec();
        this.start = vec();
        this.dir = vec();
        this.shapeWidth = 0;
        this.shapeHeight = 0;

        this.drawFromCenter = false;
        this.aspectRatio = false;

        this.allowNormalize = true;
    }

    onStartDraw(renderer: Renderer): void {
        super.onStartDraw(renderer);
    }
    onDraw(renderer: Renderer): void {
        super.onDraw(renderer);

        this.drawFromCenter = Keyboard.isCtrl;
        this.aspectRatio = Keyboard.isShift;
        
        this.start = Mouse.startPos.expand();

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

            this.to.copy(vec(max * dir.x, max * dir.y).add(Mouse.startPos));
        } else
            // Not
            this.to.copy(Mouse.pos);

        if (this.drawFromCenter) {
            // Draw from center
            this.from.copy(this.start.sub(this.to.sub(this.start)));
        } else
            // Normal draw
            this.from.copy(this.start);

        // Normalize
        if (this.allowNormalize)
            this.normalize();
        
        const width = (this.to.x - this.from.x)
        const height = (this.to.y - this.from.y);
        this.shapeWidth = width;
        this.shapeHeight = height;
    }
    onEndDraw(renderer: Renderer): void {
        super.onEndDraw(renderer);

        this.aspectRatio = false;
        this.drawFromCenter = false;
    }

    private normalize() {
        this.dir = vec(
            this.from.x < this.to.x ? 1 : -1,
            this.from.y < this.to.y ? 1 : -1
        );
            
        if (this.dir.x < 0) {
            const f = this.from.x
            this.from.x = this.to.x;
            this.to.x = f;
        } else {
            this.from.x = this.from.x;
            this.to.x = this.to.x;
        }
        if (this.dir.y < 0) {
            const f = this.from.y
            this.from.y = this.to.y;
            this.to.y = f;
        } else {
            this.from.y = this.from.y;
            this.to.y = this.to.y;
        }
    }
}