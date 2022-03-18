import { ToolType } from "..";
import { EditorStates } from "../../../states/editor-states";
import App from "../../App";
import { Renderer } from "../../renderer/Renderer";
import LayersWorker from "../../workers/LayersWorker";
import PaletteWorker from "../../workers/PaletteWorker";
import ShapeTool from "../parent/ShapeTool";

export default class LineTool extends ShapeTool {
    constructor() {
        super(ToolType.LINE);

        this.resizable = true;
        this.allowNormalize = false;
    }

    onDraw(renderer: Renderer): void {
        super.onDraw(renderer);
        if (!LayersWorker.currentLayer?.editable || !this.allowUse) return;

        const lineLength = renderer.drawLine({
            points: [this.from, this.to],
            color: PaletteWorker.currentPaletteColor.hexColor,
            allowPreview: true,
            clearPreview: true,
            pixelPerfect: true,
            size: App.ToolsSize.value,
            allowDrawBehindSelection: this.allowUseBehindSelection
        });
        
        EditorStates.HelperText.value = `Line length ${ lineLength }`;
    }
}