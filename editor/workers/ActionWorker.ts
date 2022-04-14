import HistoryWorker from "../../components/editor/history/HistoryWorker";
import { EditorActionType, EditorTriggers, EditorWindowType } from "../../states/editor-states";
import App from "../App";
import Layer from "../layers/Layer";
import { ToolType } from "../tools";
import LayersWorker from "./LayersWorker";
import SelectionWorker from "./SelectionWorker";
import ProjectWorker from "./ProjectWorker";
import PaletteWorker from "./PaletteWorker";
import ViewWorker from "./ViewWorker";

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
            "add-layer-trigger": (belowId?: number)=> this.addLayerTrigger(belowId),
            "rename-layer-trigger": (id?: number)=> this.renameLayerTrigger(id),
            "delete-layer-trigger": (id?: number)=> this.deleteLayerTrigger(id),
            "duplicate-layer-trigger": (id?: number)=> this.duplicateLayerTrigger(id),
            "merge-visible-layers-trigger": ()=> this.mergeVisibleLayersTrigger(),
            "clear-layer-canvas-area-trigger": (id?: number)=> this.clearLayerCanvasAreaTrigger(id),

            // Selection
            "select-all": ()=> SelectionWorker.selectAll(),
            "deselect-all": ()=> SelectionWorker.endMoveSelection(),

            // Project
            "export-image-trigger": ()=> EditorTriggers.Window.trigger({ type: EditorWindowType.EXPORT_IMAGE_WINDOW }),
            "save-project-trigger": ()=> this.saveProjectTrigger(),
            "save-project-as-trigger": ()=> this.saveProjectAsTrigger(),
            "open-project-trigger": ()=> this.openProjectTrigger(),
            
            // Image data
            "copy-image-data": (layerId?: number)=> SelectionWorker.copyImageData(layerId),
            "paste-image-data": (layerId?: number)=> SelectionWorker.pasteImageData(layerId),
            "cut-image-data": (layerId?: number)=> SelectionWorker.cutImageData(layerId),

            // Color
            "switch-current-colors": ()=> PaletteWorker.switchCurrentColors(),
            "fast-add-palette-color": ()=> PaletteWorker.pasteColorFromClipboard(),

            // View
            "toggle-grid": ()=> ViewWorker.GridEnabled.set(v=> !v),

            // History
            "undo": ()=> HistoryWorker.undo(),
            "redo": ()=> HistoryWorker.redo(),

            // Modifiers
            "stroke-modifier-window-trigger": ()=> EditorTriggers.Window.trigger({ type: EditorWindowType.STROKE_MODIFIER_WINDOW }),
            "array-modifier-window-trigger": ()=> EditorTriggers.Window.trigger({ type: EditorWindowType.ARRAY_MODIFIER_WINDOW }),
            "decay-modifier-window-trigger": ()=> EditorTriggers.Window.trigger({ type: EditorWindowType.DECAY_MODIFIER_WINDOW }),
        }
    }

    init() {
        
    }

    // ? Layers
    // Add layer
    addLayerTrigger(belowId?: number) {
        EditorTriggers.Action.trigger({
            type: EditorActionType.ADD_LAYER,
            targetId: belowId
        });
        // LayersWorker.addLayer(belowId);
    }
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
    duplicateLayerTrigger(layerId?: number) {
        EditorTriggers.Action.trigger({
            type: EditorActionType.DUPLICATE_LAYER,
            targetId: layerId || this.curLayerId
        });
    }
    mergeVisibleLayersTrigger() {
        EditorTriggers.Action.trigger({
            type: EditorActionType.MERGE_VISIBLE_LAYERS,
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

    // Project
    saveProjectTrigger() {
        ProjectWorker.tryToSave();
    }
    saveProjectAsTrigger() {
        EditorTriggers.Window.trigger({
            type: EditorWindowType.SAVE_PROJECT_WINDOW
        });
    }
    openProjectTrigger() {
        EditorTriggers.Window.trigger({
            type: EditorWindowType.OPEN_PROJECT_WINDOW
        });
    }

    get curLayerId(): Layer["id"] {
        return LayersWorker.CurrentLayerId.value
    }
}

export default new ActionWorker();