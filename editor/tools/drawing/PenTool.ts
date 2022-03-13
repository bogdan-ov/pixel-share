import { ToolType } from "..";
import { EditorStates } from "../../../states/editor-states";
import State, { state } from "../../../states/State";
import { rgbToHex } from "../../../utils/utils";
import App from "../../App";
import Keyboard from "../../managers/Keyboard";
import Mouse from "../../managers/Mouse";
import { Renderer } from "../../renderer/Renderer";
import LayersWorker from "../../workers/LayersWorker";
import PaletteWorker from "../../workers/PaletteWorker";
import PickerTool from "../parent/PickerTool";

export default class PenTool extends PickerTool {
    PixelPerfect: State<boolean>
    AutoPick: State<boolean>

    drawLine: boolean

    constructor() {
        super(ToolType.PEN);

        this.resizable = true;
        this.PixelPerfect = state<boolean>(false, "pen-tool-pixel-perfect");
        this.AutoPick = state<boolean>(false, "pen-tool-auto-pick");

        this.drawLine = false;
    }

    onStartDraw(renderer: Renderer): void {
        super.onStartDraw(renderer);
        if (!this.allowUse) return;
        
        // Pick color
        if (!this.AutoPick.value) return;

        const startPixelColor = this.pickColorAt(Mouse.pos);
        if (startPixelColor[3] >= 255)
            this.hexColor = rgbToHex(startPixelColor);
    }
    onDraw(renderer: Renderer): void {
        super.onDraw(renderer);
        if (!this.allowUse || this.drawLine) return;
        
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
    onMove(renderer: Renderer): void {
        super.onMove(renderer);

        if (Keyboard.isShift && !Keyboard.isCtrl && !this.isUsing)
            this.drawLine = true;

        // Draw line preview
        if (this.drawLine) {
            const lineLength = renderer.drawLine({
                points: [Mouse.lastPos, Mouse.pos],
                color: this.hexColor,
                size: App.ToolsSize.value,
                allowPreview: true,
                clearPreview: true,
                pixelPerfect: true,
                allowDrawBehindSelection: this.allowUseBehindSelection
            });

            EditorStates.HelperText.value = `Line length ${ lineLength }`;
            
            if (!Keyboard.isShift || Keyboard.isCtrl) {
                LayersWorker.previewLayer?.clearPixels();
                EditorStates.HelperText.value = ``;
                this.drawLine = false;
            }
            
        }
    }
    onEndDraw(renderer: Renderer): void {
        super.onEndDraw(renderer);

        // Draw line
        if (this.drawLine) {
            renderer.updatePreview();
            this.drawLine = false;
        }
    }
}