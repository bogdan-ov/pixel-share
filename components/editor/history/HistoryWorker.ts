import Layer from "../../../editor/layers/Layer";
import PaletteColor from "../../../editor/renderer/PaletteColor";
import LayersWorker from "../../../editor/workers/LayersWorker";
import PaletteWorker from "../../../editor/workers/PaletteWorker";
import { EditorActionType, EditorStates, EditorTriggers } from "../../../states/editor-states";
import config from "../../../utils/config";
import { HSLA } from "../../../utils/types";

export enum HistoryItemType {
    LAYERS,
    PALETTE
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

class HistoryWorker {
    history: IHistoryItem[][]
    
    constructor() {
        this.history = [];
    }

    init() {
        // EditorTriggers.History.listen((type, from)=> {
            
            
        // }, "history");
    }
    
    undo() {
        if (this.history.length <= 1 || EditorStates.MovingSelection.value || EditorStates.IsDrawing.value)
            return;
            
        const lastHistoryItems = this.history.at(-1);
        if (!lastHistoryItems) {
            config.DEBUG && console.error("Last history items doesn't exit!");
            return;
        }

        EditorTriggers.Action.trigger({
            targetId: 0,
            type: EditorActionType.UNDO
        }, "history");

        for (const item of lastHistoryItems) {
            switch (item.type) {

                // Layers
                case HistoryItemType.LAYERS:
                    const historyLayers: ILayerData[] = item.data.layers;

                    const newLayers = LayersWorker.Layers.value.filter(layer=> historyLayers.findIndex(l=> l.id == layer.id) >= 0).map(layer=> {
                        
                        const newProps = historyLayers.find(l=> l.id == layer.id);
                        if (newProps && !layer.ghost) {
                            layer.name = newProps.name;
                            newProps.imageData && layer.replaceImageData(newProps.imageData);
                        }

                        return layer;
                    })
                    for (const layer of historyLayers) {
                        if (newLayers.findIndex(l=> l.id == layer.id) < 0) {
                            newLayers.push(new Layer(layer.id, layer.name, layer.imageData));
                        }
                    }
                    
                    LayersWorker.Layers.value = newLayers;
                    
                    break;

                // Palette
                // case HistoryItemType.PALETTE:
                //     const data: IPaletteColorData[] = item.data;

                //     const newPalette = [];

                //     for (const paletteColor of data) {
                //         const newPaletteColor = new PaletteColor(paletteColor.id, paletteColor.hslaColor);

                //         PaletteWorker.
                //     }
                //     // PaletteWorker.Palette.value = item.data;
                    
                //     break;


            }
        }

        this.history.pop();
        EditorTriggers.Edit.trigger(true);
    }

    save(type: HistoryItemType) {
        switch (type) {

            // Layers
            case HistoryItemType.LAYERS: 
                this.push([{
                    type,
                    data: {
                        layers: LayersWorker.Layers.value.map(layer=> ({
                            id: layer.id,
                            name: layer.name,
                            imageData: layer.getImageData()
                        })) as ILayerData[]
                    }
                }]);
                break;

            // Palette
            case HistoryItemType.PALETTE: 
                this.push([{
                    type,
                    data: PaletteWorker.Palette.value.map(color=> ({
                        id: color.id,
                        hslaColor: color.hslaColor
                    })) as IPaletteColorData[]
                }]);
                break;
                
        }
    }
    push(items: IHistoryItem[]) {
        this.history.push(items);

        if (this.history.length > config.MAX_HISTORY_LENGTH)
            this.history.splice(0, 1);
    }
}

export default new HistoryWorker();