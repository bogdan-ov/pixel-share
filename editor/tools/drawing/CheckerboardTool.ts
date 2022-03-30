import { ToolType } from "..";
import State, { state } from "../../../states/State";
import config from "../../../utils/config";
import App from "../../App";
import Mouse from "../../managers/Mouse";
import { Renderer } from "../../renderer/Renderer";
import PaletteWorker from "../../workers/PaletteWorker";
import PickerTool from "../parent/PickerTool";

export default class CheckerboardTool extends PickerTool {
    CellsSize: State<number>
    Offset: State<boolean>
    Erase: State<boolean>

    constructor() {
        super(ToolType.CHECKERBOARD);

        this.CellsSize = state<number>(1, "checkerboard-tool-cell-size");
        this.Offset = state<boolean>(false, "checkerboard-tool-offset");
        this.Erase = state<boolean>(false, "checkerboard-tool-erase");
    }

    onDraw(renderer: Renderer): void {
        super.onDraw(renderer);
        if (!this.canBeUsed) return;

        const color = this.Erase.value ? config.EMPTY_PIXEL_COLOR : PaletteWorker.currentPaletteColor.hexColor;
        
        for (let y = 0; y < App.ToolsSize.value; y ++)
            for (let x = 0; x < App.ToolsSize.value; x ++)
                renderer.drawLine({
                    points: [Mouse.oldPos.addNum(x, y), Mouse.pos.addNum(x, y)],
                    color,
                    allowDrawBehindSelection: this.allowUseBehindSelection,
                    pixelRule: pos => (Math.floor(pos.x / this.CellsSize.value) + Math.floor(pos.y / this.CellsSize.value)) % 2 == +this.Offset.value,
                });
    }
}