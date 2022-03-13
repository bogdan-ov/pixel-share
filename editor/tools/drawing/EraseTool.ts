import { ToolType } from "..";
import config from "../../../utils/config";
import App from "../../App";
import Mouse from "../../managers/Mouse";
import { Renderer } from "../../renderer/Renderer";
import LayersWorker from "../../workers/LayersWorker";
import Tool from "../Tool";

export default class EraseTool extends Tool {
    constructor() {
        super(ToolType.ERASE);
        
        this.resizable = true;
        this.allowPreview = false
        this.colorable = false;
    }

    onDraw(renderer: Renderer): void {
        super.onDraw(renderer);
        if (!LayersWorker.currentLayer?.editable) return;

        renderer.drawLine({
            points: [Mouse.oldPos, Mouse.pos],
            color: config.EMPTY_PIXEL_COLOR,
            size: App.ToolsSize.value,
            allowDrawBehindSelection: this.allowUseBehindSelection,
        });
    }
}