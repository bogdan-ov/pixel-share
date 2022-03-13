import { ToolType } from ".";
import { EditorStates, EditorTriggers } from "../../states/editor-states";
import App from "../App";
import { Renderer } from "../renderer/Renderer";

export default class Tool {
    type: ToolType

    // Settings
    resizable: boolean
    colorable: boolean
    allowPreview: boolean
    allowUse: boolean
    allowAutoHistory: boolean
    allowUseWhenMoveSelection: boolean
    allowUseBehindSelection: boolean

    // Can change in any time
    hexColor: string
    
    // State right now
    isCustomColor: boolean
    isUsing: boolean
    
    constructor(type: ToolType) {
        this.type = type;

        this.resizable = false;
        this.colorable = true;
        this.allowPreview = true;
        this.allowUse = true;
        this.allowAutoHistory = true;
        this.allowUseWhenMoveSelection = false;
        this.allowUseBehindSelection = false;

        this.hexColor = "#000";
        
        this.isCustomColor = false;
        this.isUsing = false;
    }

    onStartDraw(renderer: Renderer) {
        EditorStates.IsDrawing.value = true;

        this.isUsing = true;
    }
    onDraw(renderer: Renderer) {}
    onMove(renderer: Renderer) {
        if (EditorStates.MovingSelection.value && !this.allowUseWhenMoveSelection) {
            App.setCursor("not-allowed");
        } else {
            App.setCursor("initial");
        }
    }
    onEndDraw(renderer: Renderer) {
        if (this.allowPreview)
            renderer.updatePreview();
        
        EditorStates.IsDrawing.value = false;
        EditorTriggers.Edit.trigger(true);

        this.isUsing = false;
    }
}