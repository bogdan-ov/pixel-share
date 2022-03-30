import HistoryWorker, { HistoryItemType } from "../components/editor/history/HistoryWorker";
import { EditorActionType, EditorEditedType, EditorStates, EditorTriggers, EditorWrongActionType, IEditorActionTrigger } from "../states/editor-states";
import State, { state } from "../states/State";
import config from "../utils/config";
import { clamp, Vector2 } from "../utils/math";
import { capitalize, safeValue } from "../utils/utils";
import Keyboard from "./managers/Keyboard";
import Mouse from "./managers/Mouse";
import { Renderer } from "./renderer/Renderer";
import tools, { ToolType } from "./tools";
import Tool from "./tools/Tool";
import ActionWorker from "./workers/ActionWorker";
import HotkeysWorker from "./workers/HotkeysWorker";
import LayersWorker from "./workers/LayersWorker";
import PaletteWorker from "./workers/PaletteWorker";
import ProjectWorker from "./workers/ProjectWorker";
import SelectionWorker from "./workers/SelectionWorker";
import { Anchor } from "../utils/types";
import ViewWorker from "./workers/ViewWorker";

const cursors = {
    "initial": "initial",
    "default": "initial",
    "pick": "crosshair",
    "move": "move",
    "not-allowed": "not-allowed",
    "pointer": "pointer",
}

export class Application {
    CurrentToolType: State<ToolType>
    ToolsSize: State<number>

    CanvasWidth: State<number>
    CanvasHeight: State<number>
    resizeAnchor: Anchor
    renderer: Renderer
    
    workspaceElement!: HTMLDivElement
    canvasLayersElement!: HTMLDivElement

    zoom: number
    pan: Vector2

    inited: boolean

    constructor() {
        this.CurrentToolType = state<ToolType>(ToolType.PEN, "current-tool-tile");
        this.ToolsSize = state(1, "tools-size");

        this.CanvasWidth = state<number>(64, "app-canvas-width");
        this.CanvasHeight = state<number>(64, "app-canvas-height");
        this.resizeAnchor = Anchor.TOP_LEFT;
        this.renderer = new Renderer();

        this.zoom = 1;
        this.pan = new Vector2();

        this.inited = false;
    }

    init(canvasLayersElement: HTMLDivElement, workspace: HTMLDivElement) {
        if (this.inited) return;
        
        this.workspaceElement = workspace;

        this.zoom = innerHeight / this.CanvasHeight.value * .8;

        this.canvasLayersElement = canvasLayersElement;
        
        ProjectWorker.init();
        ActionWorker.init();
        PaletteWorker.init();
        HotkeysWorker.init();
        HistoryWorker.init();
        SelectionWorker.init();
        LayersWorker.init();
        ViewWorker.init();
        
        LayersWorker.resizeLayers(Anchor.TOP_LEFT);

        Mouse.init();
        Keyboard.init();
        this.initListeners();

        this.inited = true;
    }

    setCursor(type: keyof typeof cursors) {
        document.body.style.cursor = cursors[type];
    }
    
    resizeCanvas(width: number, height: number, anchor: Anchor, pushToHistory: boolean): boolean {
        width = width || 64;
        height = height || 64;

        this.resizeAnchor = anchor;
        if (pushToHistory)
            HistoryWorker.pushToPast(HistoryItemType.APP);
        
        if (width <= 0 || height <= 0) {
            EditorTriggers.Notification.trigger({
                content: "❌ Too small!",
                type: "danger"
            });
            return false;
        }
        if (width >= 900 || height >= 900) {
            EditorTriggers.Notification.trigger({
                content: "❌ Too large!",
                type: "danger"
            });
            return false;
        }
        
        this.CanvasWidth.value = width;
        this.CanvasHeight.value = height;

        LayersWorker.resizeLayers(anchor);
        EditorTriggers.Edited.trigger({
            type: EditorEditedType.CANVAS_RESIZED
        });

        return true;
    }
    
    currentToolStartDraw() {
        Mouse.oldPos.copy(Mouse.pos);
            
        if (this.canUseCurrentTool)
            this.currentTool.onStartDraw(this.renderer);
    }
    currentToolDraw() {
        if (this.canUseCurrentTool) {
            this.currentTool.onUsing();
            if (!this.currentTool.isPickingColor)
                this.currentTool.onDraw(this.renderer);
        }

        Mouse.oldPos.copy(Mouse.pos);
    }
    currentToolEndDraw() {
        if (this.canUseCurrentTool)
            this.currentTool.onEndDraw(this.renderer);
    }

    initListeners() {
        EditorTriggers.Action.listen(this.actionListener, "app-action");

        // Mouse listeners
        Mouse.onDown(()=> {
            const currentLayer = LayersWorker.currentLayer;
            if (Mouse.button != 0 || !this.currentTool || !currentLayer)
                return;

            // Layer locked or hidden
            if (!currentLayer.editable) {
                EditorTriggers.WrongAction.trigger({ type: EditorWrongActionType.UNEDITABLE_LAYER });
                return;
            }

            this.currentToolStartDraw();
            this.currentToolDraw();

            LayersWorker.uiLayer?.render();
        });
        Mouse.onUp(()=> {
            this.currentToolEndDraw();
        });
        Mouse.onMove(() => {
            this.currentTool.onMove(this.renderer);
            this.currentTool.onUpdate();
            this.currentToolDraw();

            LayersWorker.uiLayer?.render();
        }, this.workspaceElement);
        this.workspaceElement.addEventListener("mouseout", ()=> {
            this.setCursor("initial");
            this.currentToolEndDraw();
        });

        Mouse.onWheel(delta => {
            // Resize tool hot keys
            if (Keyboard.isCtrl && Keyboard.isShift && this.currentTool.resizable) {
                this.ToolsSize.set(v => clamp(v + (delta.y > 0 ? 1 : -1), 1, config.MAX_TOOL_SIZE));
                EditorStates.HelperText.value = `Tool size ${this.ToolsSize.value}`;
                LayersWorker.uiLayer?.render();
            }
        })
        
        // Update
        setInterval(()=> {
            this.currentTool.onUpdate();
            if (!EditorStates.IsDrawing.value)
                LayersWorker.uiLayer?.render();
        }, 40);
        
        // Notify states listeners
        EditorTriggers.Edited.trigger(true, "app");
        this.initHistory();
    }
    initHistory() {
        HistoryWorker.Past.value = [];
        HistoryWorker.Future.value = [];
        // HistoryWorker.pushToPast(HistoryItemType.ALL);
    }

    actionListener(action: IEditorActionTrigger) {
        switch (action.type) {
            // Add layer
            case EditorActionType.ADD_LAYER:
                LayersWorker.addLayer(action.targetId);
                // EditorTriggers.Edited.trigger({ type: EditorEditedType.LAYERS_EDITED1 });
                break;
            // Clear layer
            case EditorActionType.CLEAR_LAYER_CANVAS:
                LayersWorker.pushToHistory();
                LayersWorker.getLayer(action.targetId)?.clearCanvas();
                EditorTriggers.Edited.trigger({ type: EditorEditedType.LAYERS_EDITED });
                break;
            // Clear layer selection
            case EditorActionType.CLEAR_SELECTION:
                LayersWorker.getLayer(action.targetId)?.clearBySelection();
                EditorTriggers.Edited.trigger({ type: EditorEditedType.LAYERS_EDITED });
                break;
            // Delete layer
            case EditorActionType.DELETE_LAYER:
                LayersWorker.deleteLayer(action.targetId);
                // EditorTriggers.Edited.trigger({ type: EditorEditedType.LAYERS_EDITED1 });
                break;
            case EditorActionType.DUPLICATE_LAYER:
                LayersWorker.duplicateLayer(action.targetId);
                // EditorTriggers.Edited.trigger({ type: EditorEditedType.LAYERS_EDITED1 });
                break;
            case EditorActionType.MERGE_VISIBLE_LAYERS:
                LayersWorker.mergeVisibleLayers();
                // EditorTriggers.Edited.trigger({ type: EditorEditedType.LAYERS_EDITED1 });
                break;
        }
    }

    // Tools
    get currentToolSize(): number {
        return this.currentTool.resizable ? this.ToolsSize.value : 1;
    }
    get currentTool(): Tool {
        return tools[this.CurrentToolType.value];
    }
    getToolNames(type?: ToolType) {
        const t = safeValue(type, this.CurrentToolType.value);
        
        return {
            name: capitalize(ToolType[t]) + " tool",
            icon: ToolType[t].toLowerCase()
        }
    }
    get canUseCurrentTool(): boolean {
        return (
            Mouse.isDown &&
            Mouse.button == 0 &&
            (EditorStates.MovingSelection.value ? this.currentTool.allowUseWhenMoveSelection : true)
            // (this.currentTool instanceof PenTool ? !this.currentTool.AutoPick.value : true)
        );
    }
}

export default new Application();