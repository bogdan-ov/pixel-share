import App from "../../../editor/App";
import Layer from "../../../editor/layers/Layer";
import PaletteColor from "../../../editor/renderer/PaletteColor";
import LayersWorker from "../../../editor/workers/LayersWorker";
import PaletteWorker from "../../../editor/workers/PaletteWorker";
import { EditorEditedType, EditorStates, EditorTriggers } from "../../../states/editor-states";
import State, { state } from "../../../states/State";
import config from "../../../utils/config";
import { Anchor, HSLA } from "../../../utils/types";

export enum HistoryItemType {
    ALL,
    LAYERS,
    PALETTE,
    APP
}
export interface IHistoryItem {
    type: HistoryItemType
    data: any
}

export interface ILayerData {
    id: number
    name: string
    imageData: ImageData
}
export interface IPaletteColorData {
    id: number
    hslaColor: HSLA
}
export interface IAppData {
    canvasWidth: number
    canvasHeight: number
    resizeAnchor: Anchor
}
type PushToType = "pushPast" | "pushFuture";

class HistoryWorker {
    Past: State<IHistoryItem[][]>
    Future: State<IHistoryItem[][]>
    
    constructor() {
        this.Past = state<IHistoryItem[][]>([], "history-worker-past");
        this.Future = state<IHistoryItem[][]>([], "history-worker-past");
    }

    init() {
        // Yee
    }
    
    undo() {
        if (this.Past.value.length <= 0 || EditorStates.MovingSelection.value || EditorStates.IsDrawing.value)
            return;
            
        const lastPastItems = this.Past.value.at(-1);
        if (!lastPastItems) {
            config.DEBUG && console.error("Last history in the PAST items doesn't exit!");
            return;
        }

        this.undoRedoItems(lastPastItems, "pushFuture");
        
        const newPast = [...this.Past.value];
        newPast.pop();
        this.Past.value = newPast;
        
        EditorTriggers.Edited.trigger({
            type: EditorEditedType.UNDO
        }, "history-undo");
    }
    redo() {
        if (this.Future.value.length <= 0 || EditorStates.MovingSelection.value || EditorStates.IsDrawing.value)
            return;
            
        const lastFutureItems = this.Future.value.at(-1);
        
        if (!lastFutureItems) {
            config.DEBUG && console.error("Last history in the FUTURE items doesn't exit!");
            return;
        }

        this.undoRedoItems(lastFutureItems, "pushPast");
        
        const newFuture = [...this.Future.value];
        newFuture.pop();
        this.Future.value = newFuture;

        EditorTriggers.Edited.trigger({
            type: EditorEditedType.REDO
        }, "history-redo");
    }
    private undoRedoItems(items: IHistoryItem[], to: PushToType) {
        for (const item of items) {
            switch (item.type) {

                // All
                case HistoryItemType.ALL:
                    this.pushTo(HistoryItemType.ALL, to);
                    this.undoRedoLayers(item);
                    this.undoRedoPalette(item);
                    this.undoRedoApp(item);
                    break;

                // App
                case HistoryItemType.APP:
                    this.pushTo(HistoryItemType.APP, to);
                    this.undoRedoApp(item);
                    break;
                // Layers
                case HistoryItemType.LAYERS:
                    this.pushTo(HistoryItemType.LAYERS, to);
                    this.undoRedoLayers(item);
                    break;
                // Palette
                case HistoryItemType.PALETTE:
                    this.pushTo(HistoryItemType.PALETTE, to);
                    this.undoRedoPalette(item);
                    break;
            }
        }
    }

    pushToPast(type: HistoryItemType) {
        config.DEBUG && console.log(`Pushed ${ HistoryItemType[type] }`);
        
        this.Future.value = [];
        this.pushTo(type, "pushPast");
    }
    private pushTo(type: HistoryItemType, to: PushToType) {
        switch (type) {

            // All
            case HistoryItemType.ALL:
                this[to]([
                    this.makeAppData(),
                    this.makeLayersData(),
                    this.makePaletteData()
                ]);
                break;

            // App
            case HistoryItemType.APP:
                this[to]([
                    this.makeAppData(),
                ]);
                break;
            // Layers
            case HistoryItemType.LAYERS: 
                this[to]([
                    this.makeLayersData(),
                ]);
                break;
            // Palette
            case HistoryItemType.PALETTE: 
                this[to]([
                    this.makePaletteData()
                ]);
                break;
                
        }
    }
    private pushPast(items: IHistoryItem[]) {
        const newPast = [...this.Past.value];
        newPast.push(items);

        if (newPast.length > config.MAX_HISTORY_LENGTH)
            newPast.splice(0, 1);

        this.Past.value = newPast;
    }
    private pushFuture(items: IHistoryItem[]) {
        const newFuture = [...this.Future.value];
        newFuture.push(items);

        if (newFuture.length > config.MAX_HISTORY_LENGTH)
            newFuture.splice(0, 1);

        this.Future.value = newFuture;
    }

    // App
    private makeAppData(): IHistoryItem {
        return {
            type: HistoryItemType.APP,
            data: {
                canvasWidth: App.CanvasWidth.value,
                canvasHeight: App.CanvasHeight.value,
                resizeAnchor: App.resizeAnchor,
            } as IAppData
        };
    }
    private undoRedoApp(item: IHistoryItem) {
        const historyApp: IAppData = item.data;

        App.resizeCanvas(historyApp.canvasWidth, historyApp.canvasHeight, historyApp.resizeAnchor, false);
    }
    // Layers
    private makeLayersData(): IHistoryItem {
        return {
            type: HistoryItemType.LAYERS,
            data: {
                layers: LayersWorker.normalLayers.map(layer=> ({
                    id: layer.id,
                    name: layer.name,
                    imageData: layer.getImageData()
                })) as ILayerData[]
            }
        };
    }
    private undoRedoLayers(item: IHistoryItem) {
        const historyLayers: ILayerData[] = item.data.layers;

        // let newLayers: Layer[] = [...LayersWorker.normalLayers];
        let newLayers: Layer[] = [];
        for (const historyLayer of historyLayers) {
            // newLayers = newLayers.filter(l=> l.id == historyLayer.id);
            // const layer = newLayers.find(l=> l.id == historyLayer.id);
            
            // if (!layer)
                // Add layer if it doesn't exists
                newLayers.push(new Layer(historyLayer.id, historyLayer.name, historyLayer.imageData));
            // else
            //     // Just replace image data if it exists
            //     layer.replaceDataUrl(historyLayer.dataUrl);
        }
        
        LayersWorker.setLayers(newLayers);
    }
    // Palette
    private makePaletteData(): IHistoryItem {
        return {
            type: HistoryItemType.PALETTE,
            data: {
                palette: PaletteWorker.Palette.value.map(color=> ({
                    id: color.id,
                    hslaColor: color.hslaColor
                })) as IPaletteColorData[]
            }
        };
    }
    private undoRedoPalette(item: IHistoryItem) {
        const historyPalette: IPaletteColorData[] = item.data.palette;
        
        const newPalette: PaletteColor[] = [];
        for (const color of historyPalette) {
            newPalette.push(new PaletteColor(color.id, color.hslaColor));
        }
        
        PaletteWorker.setPalette(newPalette);
    }
}

export default new HistoryWorker();