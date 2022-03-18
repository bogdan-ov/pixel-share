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
            this.shapeWidth <= 1 ? 0 : 1,
            this.shapeHeight <= 1 ? 0 : 1
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
                vec(this.from.x + +rounded*dir.x, this.from.y),
                vec(this.to.x - +rounded*dir.x, this.from.y),
            ],
            clearPreview: true
        })
        // Right
        renderer.drawLine({
            ...line as Required<typeof line>,
            points: [
                vec(this.to.x, this.from.y + +rounded*dir.y),
                vec(this.to.x, this.to.y - +rounded*dir.y),
            ],
        })
        // Bottom
        renderer.drawLine({
            ...line as Required<typeof line>,
            points: [
                vec(this.from.x + +rounded*dir.x, this.to.y),
                vec(this.to.x - +rounded*dir.x, this.to.y),
            ],
        })
        // Left
        renderer.drawLine({
            ...line as Required<typeof line>,
            points: [
                vec(this.from.x, this.from.y + +rounded*dir.y),
                vec(this.from.x, this.to.y - +rounded*dir.y),
            ],
        })

        EditorStates.HelperText.value = `x ${ this.start.x }, y ${ this.start.y }<br>w ${ Math.abs(this.shapeWidth)+1 }, h ${ Math.abs(this.shapeHeight)+1 }`;
    }
}