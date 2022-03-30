import { ToolType } from "..";
import State, { state } from "../../../states/State";
import { rgbaToString, rgbToHex } from "../../../utils/utils";
import App from "../../App";
import Mouse from "../../managers/Mouse";
import { Renderer } from "../../renderer/Renderer";
import LayersWorker from "../../workers/LayersWorker";
import PaletteWorker from "../../workers/PaletteWorker";
import FastLineTool from "../parent/FastLineTool";

export default class PenTool extends FastLineTool {
    PixelPerfect: State<boolean>
    AutoPick: State<boolean>

    constructor() {
        super(ToolType.PEN);

        this.PixelPerfect = state<boolean>(false, "pen-tool-pixel-perfect");
        this.AutoPick = state<boolean>(false, "pen-tool-auto-pick");
    }

    onStartDraw(renderer: Renderer): void {
        super.onStartDraw(renderer);
        if (!this.canBeUsed) return;
        
        // Pick color
        if (!this.AutoPick.value || !LayersWorker.currentLayer) return;

        const startPixelColor = LayersWorker.currentLayer.pickColorAt(Mouse.pos);
        if (startPixelColor[3] > 0)
            this.hexColor = rgbaToString(startPixelColor);
    }
    onDraw(renderer: Renderer): void {
        super.onDraw(renderer);
        if (!this.canBeUsed || this.drawingLine) return;
        
        if (!this.AutoPick.value && !this.isCustomColor)
            this.hexColor = PaletteWorker.currentPaletteColor.hexColor || "#000";

        renderer.drawLine({
            points: [Mouse.oldPos, Mouse.pos],
            color: this.hexColor,
            size: App.ToolsSize.value,
            pixelPerfect: this.PixelPerfect.value,
            allowPreview: this.PixelPerfect.value,
            allowDrawBehindSelection: this.allowUseBehindSelection
        });

    }
}