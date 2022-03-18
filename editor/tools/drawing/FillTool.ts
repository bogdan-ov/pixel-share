import { ToolType } from "..";
import { EditorStates, EditorTriggers } from "../../../states/editor-states";
import { vec, Vector2 } from "../../../utils/math";
import { RGBA } from "../../../utils/types";
import { hslaToString, rgbToHex } from "../../../utils/utils";
import App from "../../App";
import Keyboard from "../../managers/Keyboard";
import Mouse from "../../managers/Mouse";
import { Renderer } from "../../renderer/Renderer";
import LayersWorker from "../../workers/LayersWorker";
import PaletteWorker from "../../workers/PaletteWorker";
import SelectionWorker from "../../workers/SelectionWorker";
import PickerTool from "../parent/PickerTool";

export default class FillTool extends PickerTool {
    constructor() {
        super(ToolType.FILL);
    }

    onStartDraw(renderer: Renderer): void {
        super.onStartDraw(renderer);

        const currentLayer = LayersWorker.currentLayer;
        if (!currentLayer?.editable || !this.allowUse) return;

        if (Keyboard.isShift) {
            // Fill all selection
            const sel = SelectionWorker.getSelection();
            const curLayer = LayersWorker.currentLayer;
            if (!curLayer) return;

            curLayer.context.fillStyle = PaletteWorker.currentPaletteColor.hexColor;
            curLayer.context.fillRect(sel.from.x, sel.from.y, sel.to.x - sel.from.x, sel.to.y - sel.from.y)
            
            EditorStates.HelperText.value = "Full filled!";
            
            return;
        }
        // Normal selection

        EditorStates.HelperText.value = "Filling...";

        const canvasWidth = App.canvasWidth;
        const canvasHeight = App.canvasHeight;

        const imageData = currentLayer.context.getImageData(0, 0, canvasWidth, canvasHeight);
        const startPixelPos = Mouse.pos.expand();
        const startPixelColor = pickColorAt(startPixelPos.toIndex(canvasWidth));

        const startFillingDate = Date.now();

        fillPixel(startPixelPos);

        function fillPixel(pos: Vector2, color?: string) {
            if (!currentLayer) return;

            currentLayer.drawPixel({
                position: pos,
                color: color || PaletteWorker.currentPaletteColor.hexColor
            });

        }
        function comparePixelColor(rgba1: RGBA, rgba2: RGBA): boolean {
            return rgba1[0] == rgba2[0] && rgba1[1] == rgba2[1] && rgba1[2] == rgba2[2] && rgba1[3] == rgba2[3];
        }
        function pixelIsValid(pos: Vector2, rgbaColor: RGBA) {
            return (
                !(
                    pos.x < 0 || pos.y < 0 || pos.x >= canvasWidth || pos.y >= canvasHeight ||
                    !comparePixelColor(rgbaColor, startPixelColor)
                ) &&
                (rgbaColor[3] == 255 ? rgbToHex(rgbaColor) != PaletteWorker.currentPaletteColor.hexColor : true) &&
                SelectionWorker.pointInsideSelection(pos)
            );
        }
        function pickColorAt(index: number): RGBA {
            return [
                imageData.data[index * 4],
                imageData.data[index * 4 + 1],
                imageData.data[index * 4 + 2],
                imageData.data[index * 4 + 3],
            ]
        }

        function tryFillPixel(pos: Vector2, offset: Vector2) {
            if (
                pixelIsValid(pos.add(offset), pickColorAt(pos.add(offset).toIndex(canvasWidth))) &&
                visited.findIndex(v => Vector2.compare(v, pos.add(offset))) < 0
            ) {
                fillPixel(pos.add(offset));
                queue.push(pos.add(offset));
                visited.push(pos.add(offset));
            }
        }
        function stop() {
            EditorStates.HelperText.value = `Filled in ${ Date.now() - startFillingDate }ms`;
            EditorTriggers.Edited.trigger(true);
        }

        const queue: Vector2[] = [startPixelPos.expand()];
        const visited: Vector2[] = [];
        let i = 0;

        while (queue.length > 0 && i < imageData.data.length) {
            const currentPos = queue[queue.length - 1];
            if (!currentPos) {
                stop();
                break;
            }
            queue.pop();

            tryFillPixel(currentPos, vec(1, 0))
            tryFillPixel(currentPos, vec(0, 1))
            tryFillPixel(currentPos, vec(-1, 0))
            tryFillPixel(currentPos, vec(0, -1))

            i++;
        }
        stop();

    }
} 