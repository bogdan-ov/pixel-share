import { ToolType } from ".";
import HistoryWorker, { HistoryItemType } from "../../components/editor/history/HistoryWorker";
import { EditorStates, EditorTriggers } from "../../states/editor-states";
import { RGBA } from "../../utils/types";
import { rgbaToString, rgbToHex, rgbToHsl } from "../../utils/utils";
import App from "../App";
import Keyboard from "../managers/Keyboard";
import Mouse from "../managers/Mouse";
import { Renderer } from "../renderer/Renderer";
import LayersWorker from "../workers/LayersWorker";
import PaletteWorker from "../workers/PaletteWorker";

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
    pickedColor: RGBA | null
    
    // State right now
    isCustomColor: boolean
    isUsing: boolean
    isPickingColor: boolean
    
    constructor(type: ToolType) {
        this.type = type;

        this.resizable = true;
        this.colorable = true;
        this.allowPreview = true;
        this.allowUse = true;
        this.allowAutoHistory = true;
        this.allowUseWhenMoveSelection = false;
        this.allowUseBehindSelection = false;

        this.hexColor = "#000";
        this.pickedColor = null;
        
        this.isCustomColor = false;
        this.isUsing = false;
        this.isPickingColor = false;
    }

    onStartDraw(renderer: Renderer) {
        if (this.colorable && Keyboard.isCtrl) {
            this.isPickingColor = true;
        }

        if (!this.isPickingColor && this.allowAutoHistory)
            HistoryWorker.pushToPast(HistoryItemType.LAYERS);

        this.isUsing = true;
        EditorStates.IsDrawing.value = true;
    }
    onDraw(renderer: Renderer) {}
    onUsing() {
        if (this.isPickingColor) {
            this.pickedColor = LayersWorker.currentLayer?.pickColorAt(Mouse.pos) || null;

            EditorStates.PipetteColor.value = this.pickedColor ? rgbaToString(this.pickedColor) : false;

            if (!Keyboard.isCtrl) {
                this.isPickingColor = false;
                EditorStates.PipetteColor.value = false;
            }
        }
    }
    onMove(renderer: Renderer) {
        if (EditorStates.MovingSelection.value && !this.allowUseWhenMoveSelection) {
            App.setCursor("not-allowed");
        } else {
            if (this.isPickingColor) {
                App.setCursor("pick");
            } else {
                App.setCursor("default");
            }

        }
    }
    // ! onUpdate doesn't work yet...
    onUpdate() {}
    onEndDraw(renderer: Renderer) {
        if (this.isPickingColor) {
            EditorStates.PipetteColor.value = false;
            EditorStates.IsDrawing.value = false;
            this.isPickingColor = false;
            this.isUsing = false;
            
            if (this.pickedColor && this.pickedColor[3] > 0) {
                PaletteWorker.choosePaletteColorByColor(rgbToHex(this.pickedColor), true, true);
                return;
            }
        }
        
        if (this.allowPreview)
            renderer.updatePreview();
        
        EditorStates.IsDrawing.value = false;
        if (this.allowAutoHistory)
            EditorTriggers.Edited.trigger(true, `${ ToolType[this.type].toLowerCase() } tool`);

        this.isUsing = false;
        this.isPickingColor = false;
    }

    get canBeUsed(): boolean {
        return (LayersWorker.currentLayer?.editable && this.allowUse) || false;
    }
}