import { ToolType } from "..";
import { EditorStates } from "../../../states/editor-states";
import State, { state } from "../../../states/State";
import { vec } from "../../../utils/math";
import App from "../../App";
import { Renderer } from "../../renderer/Renderer";
import LayersWorker from "../../workers/LayersWorker";
import PaletteWorker from "../../workers/PaletteWorker";
import ShapeTool from "../parent/ShapeTool";

export default class RectangleTool extends ShapeTool {
    RoundedCorners: State<boolean>

    constructor() {
        super(ToolType.RECTANGLE);

        this.resizable = true;
        this.RoundedCorners = state<boolean>(false, "rectangle-tool-rounded-corners");
    }

    onDraw(renderer: Renderer): void {
        super.onDraw(renderer);
        if (!LayersWorker.currentLayer?.editable || !this.allowUse) return;
        
        const dir = vec(
            this.shapeWidth == 0 ? 0 : (this.shapeWidth > 0 ? 1 : -1),
            this.shapeHeight == 0 ? 0 : (this.shapeHeight > 0 ? 1 : -1)
        );

        const rounded = this.RoundedCorners.value;
        const color = PaletteWorker.currentPaletteColor.hexColor;
        const line: Partial<Parameters<Renderer["drawLine"]>[0]> = {
            color,
            allowPreview: true,
            size: App.ToolsSize.value,
            allowDrawBehindSelection: this.allowUseBehindSelection,
        }

        // Top
        renderer.drawLine({
            ...line as Required<typeof line>,
            points: [
                vec(this.start.x + +rounded*dir.x, this.start.y),
                vec(this.end.x - +rounded*dir.x, this.start.y),
            ],
            clearPreview: true
        })
        // Right
        renderer.drawLine({
            ...line as Required<typeof line>,
            points: [
                vec(this.end.x, this.start.y + +rounded*dir.y),
                vec(this.end.x, this.end.y - +rounded*dir.y),
            ],
        })
        // Bottom
        renderer.drawLine({
            ...line as Required<typeof line>,
            points: [
                vec(this.start.x + +rounded*dir.x, this.end.y),
                vec(this.end.x - +rounded*dir.x, this.end.y),
            ],
        })
        // Left
        renderer.drawLine({
            ...line as Required<typeof line>,
            points: [
                vec(this.start.x, this.start.y + +rounded*dir.y),
                vec(this.start.x, this.end.y - +rounded*dir.y),
            ],
        })

        EditorStates.HelperText.value = `W ${Math.abs(this.shapeWidth) + 1} H ${Math.abs(this.shapeHeight) + 1}`;
    }
}