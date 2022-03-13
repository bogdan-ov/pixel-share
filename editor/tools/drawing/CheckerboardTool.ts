import { ToolType } from "..";
import State, { state } from "../../../states/State";
import App from "../../App";
import Keyboard from "../../managers/Keyboard";
import Mouse from "../../managers/Mouse";
import { Renderer } from "../../renderer/Renderer";
import LayersWorker from "../../workers/LayersWorker";
import PaletteWorker from "../../workers/PaletteWorker";
import PickerTool from "../parent/PickerTool";

export default class CheckerboardTool extends PickerTool {
    Offset: State<boolean>

    constructor() {
        super(ToolType.CHECKERBOARD);

        this.Offset = state<boolean>(false, "checkerboard-tool-offset");
    }

    onDraw(renderer: Renderer): void {
        super.onDraw(renderer);
        if (!LayersWorker.currentLayer?.editable || !this.allowUse) return;

        renderer.drawLine({
            points: [Mouse.oldPos, Mouse.pos],
            color: PaletteWorker.currentPaletteColor.hexColor,
            allowDrawBehindSelection: this.allowUseBehindSelection,
            pixelRule: pos => (pos.x + pos.y) % 2 == +this.Offset.value,
        });
    }
}