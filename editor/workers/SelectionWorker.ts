import HistoryWorker, { HistoryItemType } from "../../components/editor/history/HistoryWorker";
import { EditorEditedType, EditorStates, EditorTriggers } from "../../states/editor-states";
import config from "../../utils/config";
import { pointInsideArea, vec, Vector2 } from "../../utils/math";
import App from "../App";
import Keyboard from "../managers/Keyboard";
import LayersWorker from "./LayersWorker";

class SelectionWorker {
    selection: {
        active: boolean
        startFrom: Vector2
        startTo: Vector2
        from: Vector2
        to: Vector2
        imageData: ImageData | null
        get width(): number
        get height(): number
        get startWidth(): number
        get startHeight(): number
    }
    
    constructor() {
        this.selection = {
            active: false,
            startFrom: vec(),
            startTo: vec(),
            from: vec(),
            to: vec(),
            imageData: null,
            get width(): number {
                return Math.abs(this.to.x - this.from.x);
            },
            get height(): number {
                return Math.abs(this.to.y - this.from.y);
            },
            get startWidth(): number {
                return Math.abs(this.startTo.x - this.startFrom.x);
            },
            get startHeight(): number {
                return Math.abs(this.startTo.y - this.startFrom.y);
            },
        }
    }

    init() {
        Keyboard.onKeyPress(e=> {
            if (!this.selection.active) {
                return;
            }
            
            if (e.code == "Enter" || e.code == "Escape") {
                this.endMoveSelection();
            }

            const pos = this.selection.from.expand();
            
            if (e.code == "ArrowUp")
                this.setSelectionPosition(pos.addNum(0, -1));
            if (e.code == "ArrowDown")
                this.setSelectionPosition(pos.addNum(0, 1));
            if (e.code == "ArrowRight")
                this.setSelectionPosition(pos.addNum(1, 0));
            if (e.code == "ArrowLeft")
                this.setSelectionPosition(pos.addNum(-1, 0));

            LayersWorker.uiLayer?.render();
            LayersWorker.previewLayer?.render();
        }, "selection-worker-key-down");
    }

    // Selection
    setSelection(from: Vector2, to: Vector2) {
        from = from.clamp(
            vec(0, 0),
            vec(App.CanvasWidth.value-1, App.CanvasHeight.value-1)
        )
        to = to.clamp(
            vec(0, 0),
            vec(App.CanvasWidth.value-1, App.CanvasHeight.value-1)
        )
        
        if (!(
            Math.abs(to.x - from.x) > 0 &&
            Math.abs(to.y - from.y) > 0
        )) {
            this.selection.active = false;
            return;
        }
        const sel = this.selection;

        const dir = vec(
            from.x < to.x ? 1 : -1,
            from.y < to.y ? 1 : -1
        );
        
        sel.active = true;
        
        sel.startFrom = from.apply(Math.floor);
        sel.startTo = to.addNum(1, 1).apply(Math.floor);
        
        sel.from = from.apply(Math.floor);
        sel.to = to.addNum(dir.x > 0 ? 1 : 0, dir.y > 0 ? 1 : 0).apply(Math.floor);
        
        LayersWorker.uiLayer?.render();
    }
    setSelectionPosition(pos: Vector2) {
        this.selection.from.copy(pos.apply(Math.floor));
        this.selection.to.copy(this.selection.from.addNum(this.selection.startWidth, this.selection.startHeight).apply(Math.floor));
    }
    startMoveSelection(imageData?: ImageData) {
        const curLayer = LayersWorker.currentLayer;
        const previewLayer = LayersWorker.previewLayer;
        if (!curLayer || !previewLayer) return;

        this.pushToHistory(curLayer.id);

        const sel = this.selection;
        const imgData = imageData || curLayer.getImageData(
            sel.from,
            sel.width, sel.height
        );

        previewLayer.clearPixels();
        this.setSelectionImageData(imgData);

        EditorStates.MovingSelection.value = true;

        if (!imageData)
            curLayer.clearBySelection();
        previewLayer.render();
    }
    setSelectionImageData(imageData: ImageData) {
        this.selection.imageData = imageData;
    }
    endMoveSelection() {
        this.clearSelectionImageData();
        this.deselectAll();
        EditorStates.MovingSelection.value = false;

        EditorTriggers.Edited.trigger(true, "selection-worker");
    }
    clearSelectionImageData() {
        if (!this.selection.imageData) return;
        
        App.renderer.updatePreview();
        this.selection.imageData = null;
        LayersWorker.uiLayer?.render();
        LayersWorker.previewLayer?.render();
    }
    deselectAll() {
        this.selection.active = false;
        LayersWorker.uiLayer?.render();
    }
    selectAll() {
        this.setSelection(vec(0, 0), vec(App.CanvasWidth.value-1, App.CanvasHeight.value-1));
    }
    getSelection(): SelectionWorker["selection"] | Pick<SelectionWorker["selection"], "from" | "to" | "width" | "height"> {
        if (this.selection.active) {
            return this.selection;
        } else {
            return {
                from: vec(0, 0),
                to: vec(App.CanvasWidth.value, App.CanvasHeight.value),
                width: App.CanvasWidth.value,
                height: App.CanvasHeight.value
            }
        }
    }

    // Image data
    copyImageData(layerId?: number): boolean {
        const layer = LayersWorker.getLayer(layerId);
        const sel = this.selection;
        if (!layer || !sel.active) return false;

        let imageData: ImageData | null = null;

        if (EditorStates.MovingSelection.value) {
            // Copy moving selection
            imageData = this.selection.imageData;
        } else {
            // Copy layer selection
            imageData = layer.getImageData(sel.from, sel.width, sel.height);
        }

        if (imageData) {
            const a = config.IMAGE_DATA_PREFIX + JSON.stringify({
                data: [...imageData.data],
                width: imageData.width,
                height: imageData.height,
            });
            navigator.clipboard.writeText(a);

            EditorTriggers.Edited.trigger({
                type: EditorEditedType.SELECTION_COPY
            })

            return true;
        } else {
            copyError();

            return false;
        }

        function copyError() {
            EditorTriggers.Notification1.trigger({
                content: "🤔 Can't copy image data...",
            })
        }
    }
    pasteImageData(layerId?: number) {
        const layer = LayersWorker.getLayer(layerId);
        if (!layer) return;

        const paste = (res: string)=> {
            if (res.indexOf(config.IMAGE_DATA_PREFIX) < 0) {
                pasteError();
                return;
            }
            this.endMoveSelection();
            
            this.pushToHistory(layer.id);
            
            const parsedImageData = JSON.parse(res.replace(config.IMAGE_DATA_PREFIX, ""));
            const imageData = new ImageData(parsedImageData.width, parsedImageData.height);
            imageData.data.set(new Uint8ClampedArray(parsedImageData.data));

            const imagePos = this.selection.from.addNum(-1, -1);

            this.setSelection(imagePos, vec(
                imagePos.x + imageData.width-1,
                imagePos.y + imageData.height-1
            ));
            
            this.startMoveSelection(imageData);
            EditorStates.MovingSelection.value = true;

            EditorTriggers.Edited.trigger({
                type: EditorEditedType.SELECTION_PASTE
            })
            EditorTriggers.Notification1.trigger({
                content: "Image data pasted!",
            });
        }
        function pasteError() {
            EditorTriggers.Notification1.trigger({
                content: "😦 Can't paste image data..."
            })
        }

        //
        navigator.clipboard.readText()
            .then(paste)
            .catch(pasteError);

    }
    cutImageData(layerId?: number) {
        const layer = LayersWorker.getLayer(layerId);
        const successCopy = this.copyImageData(layerId);
        
        if (layer && successCopy) {
            this.pushToHistory(layer.id);
            layer.clearBySelection();

            EditorTriggers.Edited.trigger({
                type: EditorEditedType.SELECTION_CUT
            })
            EditorTriggers.Notification1.trigger({
                content: "Image data cut!",
            });
        }
    }

    pushToHistory(layerId: number) {
        EditorTriggers.History.trigger({
            type: HistoryItemType.LAYER_EDITED,
            targetId: layerId
        });
    }
    pointInSelection(point: Vector2, allowBehind: boolean=false): boolean {
        const sel = this.getSelection();
        return !allowBehind ? pointInsideArea(point, sel.from, sel.width-1, sel.height-1) : true;
    }
}
export default new SelectionWorker();