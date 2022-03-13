import { ToolType } from "..";
import { Vector2 } from "../../../utils/math";
import { RGBA } from "../../../utils/types";
import { rgbToHex } from "../../../utils/utils";
import Keyboard from "../../managers/Keyboard";
import Mouse from "../../managers/Mouse";
import { Renderer } from "../../renderer/Renderer";
import LayersWorker from "../../workers/LayersWorker";
import PaletteWorker from "../../workers/PaletteWorker";
import Tool from "../Tool";

export default class PickerTool extends Tool {
    constructor(type: ToolType) {
        super(type);
    }

    pickColorAt(pos: Vector2): RGBA {
        const currentLayer = LayersWorker.currentLayer;
        if (!currentLayer) return [0, 0, 0, 255];

        const rgbColor = currentLayer.pickColorAt(pos);
        const hexColor = rgbToHex(rgbColor);
        if (rgbColor[3] >= 255) {
            if (PaletteWorker.choosePaletteColorByColor(hexColor, true)) {
                this.isCustomColor = false;
            } else
                this.isCustomColor = true;
        }

        return rgbColor;
    }

    onDraw(renderer: Renderer): void {
        super.onDraw(renderer);

        // this.allowDraw = !Keyboard.isShift;
        // if (Keyboard.isShift) {
        //     this.hexColor = rgbaToHex(this.pickColorAt(Mouse.pos));

        //     console.log("Pick!", this.hexColor);
        // }
    }
}