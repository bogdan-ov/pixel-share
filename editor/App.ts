import Layer from "./layers/Layer";
import HistoryWorker, { HistoryItemType } from "../components/editor/history/HistoryWorker";
import { EditorActionType, EditorStates, EditorTriggers, EditorWrongActionType, IEditorActionTrigger } from "../states/editor-states";
import State, { state } from "../states/State";
import config from "../utils/config";
import { clamp, Vector2 } from "../utils/math";
import { capitalize, safeValue } from "../utils/utils";
import Keyboard from "./managers/Keyboard";
import Mouse from "./managers/Mouse";
import { Renderer } from "./renderer/Renderer";
import tools, { ToolType } from "./tools";
import PenTool from "./tools/drawing/PenTool";
import Tool from "./tools/Tool";
import ActionWorker from "./workers/ActionWorker";
import HotkeysWorker from "./workers/HotkeysWorker";
import LayersWorker from "./workers/LayersWorker";
import PaletteWorker from "./workers/PaletteWorker";
import ProjectWorker from "./workers/ProjectWorker";
import SelectionWorker from "./workers/SelectionWorker";

const cursors = {
    "default": "initial",
    "move": "move",
    "not-allowed": "not-allowed",
    "pointer": "pointer",
}

export class Application {
    CurrentToolType: State<ToolType>
    ToolsSize: State<number>

    canvasWidth: number
    canvasHeight: number
    renderer: Renderer

    workspaceElement!: HTMLDivElement
    canvasLayersElement!: HTMLDivElement

    zoom: number
    pan: Vector2

    inited: boolean

    constructor() {
        this.CurrentToolType = state<ToolType>(ToolType.PEN, "current-tool-tile");
        this.ToolsSize = state(1, "tools-size");

        this.canvasWidth = 64;
        this.canvasHeight = 64;
        this.renderer = new Renderer();

        this.zoom = 1;
        this.pan = new Vector2();

        this.inited = false;
    }

    init(canvasLayersElement: HTMLDivElement, workspace: HTMLDivElement) {
        if (this.inited) return;
        
        this.workspaceElement = workspace;

        this.zoom = innerHeight / this.canvasHeight * .8;

        this.canvasLayersElement = canvasLayersElement;
        
        ProjectWorker.init();
        ActionWorker.init();
        PaletteWorker.init();
        HotkeysWorker.init();
        HistoryWorker.init();
        SelectionWorker.init();
        LayersWorker.init();
        LayersWorker.updateLayersAspect();

        Mouse.init();
        Keyboard.init();
        this.initListeners();

        this.inited = true;
    }

    setCursor(type: keyof typeof cursors) {
        document.body.style.cursor = cursors[type];
    }
    
    currentToolStartDraw() {
        if (this.currentTool.allowAutoHistory)
            HistoryWorker.pushType(HistoryItemType.LAYERS);
            // EditorTriggers.History.trigger(HistoryItemType.LAYERS, "app");
        
        if (this.canUseCurrentTool)
            this.currentTool.onStartDraw(this.renderer);
    }
    currentToolDraw() {
        if (this.canUseCurrentTool) {
            this.currentTool.onDraw(this.renderer);
        }

        Mouse.oldPos.copy(Mouse.pos);
    }
    currentToolEndDraw() {
        if (this.canUseCurrentTool)
            this.currentTool.onEndDraw(this.renderer);
    }

    initListeners() {
        LayersWorker.Layers.listen(this.layersListener, "app-layers");
        EditorTriggers.Action.listen(this.actionListener, "app-action");

        this.ToolsSize.listen(() => {
            LayersWorker.previewLayer?.clearCanvas();
        });

        // Mouse listeners
        Mouse.onDown(()=> {
            const currentLayer = LayersWorker.currentLayer;
            if (Mouse.button != 0 || !this.currentTool || !currentLayer)
                return;

            // Layer locked or hidden
            if (!currentLayer.editable) {
                EditorTriggers.WrongAction.trigger({ type: EditorWrongActionType.LOCKED_LAYER });
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
            this.currentToolDraw();

            LayersWorker.uiLayer?.render();
        }, this.workspaceElement);
        this.workspaceElement.addEventListener("mouseout", ()=> {
            this.setCursor("default");
        });

        Mouse.onWheel(delta => {
            // Resize tool hot keys
            if (Keyboard.isCtrl && Keyboard.isShift && this.currentTool.resizable) {
                this.ToolsSize.set(v => clamp(v + (delta.y > 0 ? 1 : -1), 1, config.MAX_TOOL_SIZE));
                EditorStates.HelperText.value = `Tool size ${this.ToolsSize.value}`;
                LayersWorker.uiLayer?.render();
            }
        })
        
        setInterval(()=> {
            LayersWorker.uiLayer?.render();
        }, 24);
        
        // Notify states listeners
        EditorTriggers.Edited.trigger(true, "app");
        HistoryWorker.pushType(HistoryItemType.LAYERS);
        // EditorTriggers.History.trigger(HistoryItemType.LAYERS, "app");
    }

    layersListener(layers: Layer[]) {
        layers.map(layer => !layer.inited && layer.init())
        EditorTriggers.Edited.trigger(true);
    }
    actionListener(action: IEditorActionTrigger) {
        switch (action.type) {
            case EditorActionType.CLEAR_LAYER_CANVAS:
                LayersWorker.getLayer(action.targetId)?.clearCanvas();
                EditorTriggers.Edited.trigger(true);
                break;
            case EditorActionType.DELETE_LAYER:
                LayersWorker.deleteLayer(action.targetId);
                break;
            case EditorActionType.CLEAR_SELECTION:
                LayersWorker.getLayer(action.targetId)?.clearBySelection();
                EditorTriggers.Edited.trigger(true);
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
            (EditorStates.MovingSelection.value ? this.currentTool.allowUseWhenMoveSelection : true) &&
            (this.currentTool instanceof PenTool ? !this.currentTool.AutoPick.value : true)
        );
    }
}

export default new Application();