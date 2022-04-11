import { ToolType } from "..";
import { EditorStates } from "../../../states/editor-states";
import State, { state } from "../../../states/State";
import { vec, Vector2 } from "../../../utils/math";
import App from "../../App";
import Keyboard from "../../managers/Keyboard";
import Mouse from "../../managers/Mouse";
import { Renderer } from "../../renderer/Renderer";
import LayersWorker from "../../workers/LayersWorker";
import SelectionWorker from "../../workers/SelectionWorker";
import ShapeTool from "../parent/ShapeTool";

export default class SelectionTool extends ShapeTool {
    dragOffset: Vector2

    DarkAlpha: State<number>
    
    constructor() {
        super(ToolType.SELECTION);

        this.resizable = false;
        this.colorable = false;
        this.allowPreview = false;
        this.allowAutoHistory = false;
        this.allowUseWhenMoveSelection = true;
        this.allowUseBehindSelection = true;

        this.dragOffset = vec();

        this.DarkAlpha = state<number>(40, "selection-tool-dark-alpha");
    }

    onStartDraw(renderer: Renderer): void {
        super.onStartDraw(renderer);
        if (!this.canBeUsed) return;

        const sel = SelectionWorker.selection;
        
        if (sel.active) {
            if (this.startMovingSelection) {
                // Move selection
                if (!EditorStates.MovingSelection.value) {
                    SelectionWorker.startMoveSelection();
                }
                this.dragOffset.set(
                    Mouse.pos.x - SelectionWorker.selection.from.x,
                    Mouse.pos.y - SelectionWorker.selection.from.y,
                );
            } else {
                // Deselect
                SelectionWorker.endMoveSelection();
            }
        }
    }
    onDraw(renderer: Renderer): void {
        super.onDraw(renderer);
        if (!this.canBeUsed) return;

        if (EditorStates.MovingSelection.value) {
            // Move selection
            SelectionWorker.setSelectionPosition(Mouse.pos.sub(this.dragOffset));

            LayersWorker.previewLayer?.render();
        } else {
            // Select area
            SelectionWorker.setSelection(this.from, this.to);
            
            const sel = SelectionWorker.selection;
            EditorStates.HelperText.value = `x ${ sel.from.x }, y ${ sel.from.y }<br>w ${ Math.abs(sel.width) }, h ${ Math.abs(sel.height) }`;
        }
    }

    onUpdate(): void {
        super.onUpdate();

        // Cursor style
        if (this.startMovingSelection)
            App.setCursor("move");
        else
            App.setCursor("default");
    }

    get startMovingSelection(): boolean {
        return Keyboard.isShift || (EditorStates.MovingSelection.value && SelectionWorker.pointInSelection(Mouse.pos));
    }
}