import App from "../../../editor/App";
import Layer from "../../../editor/layers/Layer";
import PaletteColor from "../../../editor/renderer/PaletteColor";
import LayersWorker from "../../../editor/workers/LayersWorker";
import PaletteWorker from "../../../editor/workers/PaletteWorker";
import { EditorEditedType, EditorStates, EditorTriggers } from "../../../states/editor-states";
import State, { state } from "../../../states/State";
import config from "../../../utils/config";
import { Anchor, HSLA } from "../../../utils/types";
import { exists } from "../../../utils/utils";

export enum HistoryItemType {
    ALL,
    LAYER_EDITED,
    LAYERS_LIST_EDITED,
    PALETTE,
    APP
}
export interface IHistoryItem {
    type: HistoryItemType
    data: any
    targetId?: number
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
type PushToType = "pushItemsPast" | "pushItemsFuture";

class HistoryWorker {
    Past: State<IHistoryItem[][]>
    Future: State<IHistoryItem[][]>
    
    constructor() {
        this.Past = state<IHistoryItem[][]>([], "history-worker-past");
        this.Future = state<IHistoryItem[][]>([], "history-worker-past");
    }

    init() {
        EditorTriggers.History.listen(history=> {
            this.Future.value = [];
            if (history.type) {
                this.pushItemsByType(history.type, "pushItemsPast", history.targetId);
            } 
            if (history.items)
                this.pushItemsPast(history.items);
        });
    }
    
    undo() {
        if (this.Past.value.length <= 0 || EditorStates.MovingSelection.value || EditorStates.IsDrawing.value)
            return;
            
        const lastPastItems = [...this.Past.value].at(-1);
        if (!lastPastItems) {
            config.DEBUG && console.error("Last history in the PAST items doesn't exit!");
            return;
        }

        this.restoreItems(lastPastItems, "pushItemsFuture");
        
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
            
        const lastFutureItems = [...this.Future.value].at(-1);
        
        if (!lastFutureItems) {
            config.DEBUG && console.error("Last history in the FUTURE items doesn't exit!");
            return;
        }

        this.restoreItems(lastFutureItems, "pushItemsPast");
        
        const newFuture = [...this.Future.value];
        newFuture.pop();
        this.Future.value = newFuture;

        EditorTriggers.Edited.trigger({
            type: EditorEditedType.REDO
        }, "history-redo");
    }
    private restoreItems(items: IHistoryItem[], to: PushToType) {

        // this[to](items);
        
        for (const item of items) {
            this.pushItemsByType(item.type, to, item.targetId);
            switch (item.type) {

                // All
                case HistoryItemType.ALL:
                    this.restoreLayersList(item);
                    this.restorePalette(item);
                    this.restoreApp(item);
                    break;

                // App
                case HistoryItemType.APP:
                    this.restoreApp(item);
                    break;
                // Layers list
                case HistoryItemType.LAYERS_LIST_EDITED:
                    this.restoreLayersList(item);
                    break;
                // Layer
                case HistoryItemType.LAYER_EDITED:
                    this.restoreLayer(item);
                    break;
                // Palette
                case HistoryItemType.PALETTE:
                    this.restorePalette(item);
                    break;
            }
        }
    }

    private pushItemsByType(type: HistoryItemType, to: PushToType, targetId?: number) {
        switch (type) {

            // All
            case HistoryItemType.ALL:
                this[to](([
                    this.makeAppData(),
                    this.makeLayersListData(),
                    targetId && this.makeLayerData(targetId),
                    this.makePaletteData()
                ] as any).filter(Boolean));
                break;

            // App
            case HistoryItemType.APP:
                this[to]([
                    this.makeAppData(),
                ])
                break;
            // Layers list
            case HistoryItemType.LAYERS_LIST_EDITED: 
                this[to]([
                    this.makeLayersListData(),
                ])
                break;
            // Layer
            case HistoryItemType.LAYER_EDITED:
                if (exists(targetId))
                    this[to]([
                        this.makeLayerData(targetId!),
                    ])
                break;
            // Palette
            case HistoryItemType.PALETTE: 
                this[to]([
                    this.makePaletteData()
                ])
                break;
                
        }
    }
    pushItemsPast(items: IHistoryItem[]) {
        const newPast = [...this.Past.value];
        newPast.push(items);

        if (newPast.length > config.MAX_HISTORY_LENGTH)
            newPast.splice(0, 1);

        this.Past.value = newPast;
    }
    private pushItemsFuture(items: IHistoryItem[]) {
        const newFuture = [...this.Future.value];
        newFuture.push(items);

        if (newFuture.length > config.MAX_HISTORY_LENGTH)
            newFuture.splice(0, 1);

        this.Future.value = newFuture;
    }

    // App
    makeAppData(): IHistoryItem {
        return {
            type: HistoryItemType.APP,
            data: {
                canvasWidth: App.CanvasWidth.value,
                canvasHeight: App.CanvasHeight.value,
                resizeAnchor: App.resizeAnchor,
            } as IAppData
        };
    }
    private restoreApp(item: IHistoryItem) {
        const historyApp: IAppData = item.data;

        App.resizeCanvas(historyApp.canvasWidth, historyApp.canvasHeight, historyApp.resizeAnchor, false);
    }
    // Layers
    makeLayersListData(): IHistoryItem {
        return {
            type: HistoryItemType.LAYERS_LIST_EDITED,
            data: {
                layers: LayersWorker.normalLayers.map(layer=> ({
                    id: layer.id,
                    name: layer.name,
                    imageData: layer.getImageData()
                })) as ILayerData[]
            }
        };
    }
    makeLayerData(layerId: number): IHistoryItem {
        const layer = LayersWorker.Layers.value.find(l=> l.id == layerId);
        
        return {
            type: HistoryItemType.LAYER_EDITED,
            targetId: layerId,
            data: {
                layer: {
                    id: layerId,
                    name: layer?.name,
                    imageData: layer?.getImageData()
                } as ILayerData
            }
        }
    }
    private restoreLayersList(item: IHistoryItem) {
        const historyLayersList: ILayerData[] = item.data.layers;

        let newLayers: Layer[] = [];
        for (const historyLayer of historyLayersList) {
            newLayers.push(new Layer(historyLayer.id, historyLayer.name, historyLayer.imageData));
        }
        
        LayersWorker.setLayers(newLayers);
    }
    private restoreLayer(item: IHistoryItem) {
        const historyLayer: ILayerData = item.data.layer;
        const layer = LayersWorker.Layers.value.find(l=> l.id == historyLayer.id);
        if (!layer) return;

        layer.replaceImageData(historyLayer.imageData);
        layer.name = historyLayer.name;

        LayersWorker.Layers.notify();
    }
    // Palette
    makePaletteData(): IHistoryItem {
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
    private restorePalette(item: IHistoryItem) {
        const historyPalette: IPaletteColorData[] = item.data.palette;
        
        const newPalette: PaletteColor[] = [];
        for (const color of historyPalette) {
            newPalette.push(new PaletteColor(color.id, color.hslaColor));
        }
        
        PaletteWorker.setPalette(newPalette);
    }
}

export default new HistoryWorker();