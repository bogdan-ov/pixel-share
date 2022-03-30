import { ToolType } from "..";
import { EditorStates } from "../../../states/editor-states";
import config from "../../../utils/config";
import App from "../../App";
import Keyboard from "../../managers/Keyboard";
import Mouse from "../../managers/Mouse";
import { Renderer } from "../../renderer/Renderer";
import LayersWorker from "../../workers/LayersWorker";
import Tool from "../Tool";

export default class FastLineTool extends Tool {
    drawingLine: boolean
    
    constructor(type: ToolType) {
        super(type);

        this.drawingLine = false;
    }

    onUpdate(): void  {
        super.onUpdate();
        if (!this.canBeUsed) return;

        if (Keyboard.isShift && !Keyboard.isCtrl && !this.isUsing)
            this.drawingLine = true;

        // Draw line preview
        if (this.drawingLine) {
            const lineLength = App.renderer.drawLine({
                points: [Mouse.lastPos, Mouse.pos],
                color: this.colorable ? this.hexColor : config.POINTER_COLOR,
                size: this.resizable ? App.ToolsSize.value : 1,
                allowPreview: true,
                clearPreview: true,
                pixelPerfect: true,
                allowDrawBehindSelection: this.allowUseBehindSelection
            });

            EditorStates.HelperText.value = `Line length ${ lineLength }`;
            
            if (!Keyboard.isShift || Keyboard.isCtrl) {
                LayersWorker.previewLayer?.clearPixels();
                EditorStates.HelperText.value = ``;
                this.drawingLine = false;
            }
            
        }
    }

    onEndDraw(renderer: Renderer): void {
        super.onEndDraw(renderer);

        // Draw line
        if (this.drawingLine) {
            renderer.updatePreview();
            this.drawingLine = false;
        }
    }
}