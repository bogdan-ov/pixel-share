import HistoryWorker from "../../components/editor/history/HistoryWorker";
import { EditorActionType, EditorTriggers, EditorWindowType } from "../../states/editor-states";
import App from "../App";
import Layer from "../layers/Layer";
import { ToolType } from "../tools";
import LayersWorker from "./LayersWorker";
import SelectionWorker from "./SelectionWorker";
import ProjectWorker from "./ProjectWorker";

class ActionWorker {
    registered: { [key: string]: Function }
    
    constructor() {
        this.registered = {
            // Tools
            "pen-switch": ()=> App.CurrentToolType.value = ToolType.PEN,
            "erase-switch":  ()=> App.CurrentToolType.value = ToolType.ERASE,
            "fill-switch":  ()=> App.CurrentToolType.value = ToolType.FILL,
            "selection-switch":  ()=> App.CurrentToolType.value = ToolType.SELECTION,
            "line-switch":  ()=> App.CurrentToolType.value = ToolType.LINE,
            "rectangle-switch":  ()=> App.CurrentToolType.value = ToolType.RECTANGLE,
            "ellipse-switch":  ()=> App.CurrentToolType.value = ToolType.ELLIPSE,
            "checkerboard-switch":  ()=> App.CurrentToolType.value = ToolType.CHECKERBOARD,
            
            // Layers
            "rename-layer-trigger": (id?: number)=> this.renameLayerTrigger(id),
            "delete-layer-trigger": (id?: number)=> this.deleteLayerTrigger(id),
            "clear-layer-canvas-area-trigger": (id?: number)=> this.clearLayerCanvasAreaTrigger(id),

            // Selection
            "select-all": ()=> SelectionWorker.selectAll(),
            "deselect-all": ()=> SelectionWorker.endMoveSelection(),

            // Project
            "export-image-trigger": ()=> EditorTriggers.Window.trigger({ type: EditorWindowType.EXPORT_IMAGE }),
            "save-project": ()=> ProjectWorker.saveProject(),
            "open-project": ()=> ProjectWorker.openProject(),
            
            // Image data
            "copy-image-data": (layerId?: number)=> SelectionWorker.copyImageData(layerId),
            "paste-image-data": (layerId?: number)=> SelectionWorker.pasteImageData(layerId),
            "cut-image-data": (layerId?: number)=> SelectionWorker.cutImageData(layerId),

            // Mics
            "pick-color": ()=> {
                console.log("Picked! From action!");
            },

            // History
            "undo": ()=> this.undo()
        }
    }

    init() {
        
    }

    // ? Layers
    // Rename
    renameLayerTrigger(layerId?: number) {
        EditorTriggers.Action.trigger({
            type: EditorActionType.RENAME_LAYER,
            targetId: layerId || this.curLayerId
        })
    }
    // Delete
    deleteLayerTrigger(layerId?: number) {
        EditorTriggers.Action.trigger({
            type: EditorActionType.DELETE_LAYER,
            targetId: layerId || this.curLayerId
        });
    }
    // Clear
    clearLayerCanvasAreaTrigger(layerId?: number) {
        if (SelectionWorker.selection.active)
            // Clear selection
            this.clearSelectionTrigger(layerId);
        else
            // Clear canvas
            this.clearLayerCanvasTrigger(layerId);
    }
    clearSelectionTrigger(layerId?: number) {
        EditorTriggers.Action.trigger({
            type: EditorActionType.CLEAR_SELECTION,
            targetId: layerId || this.curLayerId
        })
    }
    clearLayerCanvasTrigger(layerId?: number) {
        EditorTriggers.Action.trigger({
            type: EditorActionType.CLEAR_LAYER_CANVAS,
            targetId: layerId || this.curLayerId
        })
    }
    // Image data
    // copyImageData(layerId?: number) {
    //     SelectionWorker.copyImageData(layerId);
    //     // EditorTriggers.Action.trigger({
    //     //     type: EditorActionType.COPY_IMAGE_DATA,
    //     //     targetId: layerId || this.curLayerId
    //     // });
    // }
    // pasteImageData(layerId?: number) {
    //     SelectionWorker.pasteImageData(layerId);
    //     // SelectionWorker.
    //     // EditorTriggers.Action.trigger({
    //     //     type: EditorActionType.PASTE_IMAGE_DATA,
    //     //     targetId: layerId || this.curLayerId
    //     // });
    // }
    // cutImageData(layerId?: number) {
    //     SelectionWorker.cutImageData(layerId);
    //     // EditorTriggers.Action.trigger({
    //     //     type: EditorActionType.CUT_IMAGE_DATA,
    //     //     targetId: layerId || this.curLayerId
    //     // });
    // }

    // ? History
    undo() {
        HistoryWorker.undo();
    }

    get curLayerId(): Layer["id"] {
        return LayersWorker.CurrentLayerId.value
    }
}

export default new ActionWorker();