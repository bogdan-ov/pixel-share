import HistoryWorker, { HistoryItemType } from "../../components/editor/history/HistoryWorker";
import State, { state } from "../../states/State";
import { safeValue } from "../../utils/utils";
import Layer from "../layers/Layer";
import App from "../App";
import PreviewLayer from "../layers/PreviewLayer";
import UILayer from "../layers/UILayer";

export interface IShortLayerData {
    id: Layer["id"]
    name: Layer["name"]
    imageData: {
        width: number
        height: number
        data: number[]
    }
    visible: boolean
    locked: boolean
}

class LayersWorker {
    Layers: State<Layer[]>
    CurrentLayerId: State<Layer["id"]>

    constructor() {
        this.Layers = state<Layer[]>([], "layers");
        this.CurrentLayerId = state<Layer["id"]>(0, "current-layer-id");
    }

    init() {
        this.setLayers([ 
            new Layer(Date.now(), "Layer 1").init(),  
        ], true);
        // this.CurrentLayerId.value = this.Layers.value[0].id;
    }

    //

    get layers(): Layer[] {
        return this.Layers.value;
    }
    get normalLayers(): Layer[] {
        return this.Layers.value.filter(l => !l.ghost);
    }
    getLayer(id?: Layer["id"]): Layer | null {
        return this.Layers.value.find(l => l.id == safeValue(id, this.CurrentLayerId.value)) || null;
    }
    private updateLayers(callback: (layer: Layer) => Layer) {
        this.Layers.set(v => v.map(callback));
    }
    get currentLayer(): Layer | null {
        return this.getLayer(this.CurrentLayerId.value);
    }
    get previewLayer(): PreviewLayer | null {
        return this.getLayer(-1) as PreviewLayer;
    }
    get uiLayer(): UILayer | null {
        return this.getLayer(-2) as UILayer;
    }
    addLayer(name: Layer["name"]) {
        // ! History
        this.pushToHistory();
        
        const id = Date.now();
        
        this.Layers.set(v=> [
            ...v,
            new Layer(id, name)
        ]);
    }
    deleteLayer(id?: Layer["id"]) {
        if (!this.getLayer(id) || this.normalLayers.length <= 1) return;

        console.log();
        
        // ! History
        this.pushToHistory();

        let removedIndex = 0;
        const layerId = safeValue(id, this.CurrentLayerId.value);

        this.Layers.set(v => v.filter((layer) => {
            if (layer.id != layerId) {
                return true;
            }

            return false;
        }));
        this.normalLayers.map((layer, index)=> {
            if (layer.id == layerId)
                removedIndex = index;
        });

        let nextLayer = this.normalLayers[removedIndex];
        if (!nextLayer)
            nextLayer = this.normalLayers[removedIndex - 1]
            
        this.CurrentLayerId.value = (nextLayer ? nextLayer : this.normalLayers[0]).id;

        this.rerenderLayersElements();
    }
    deleteLayers(layersId: Layer["id"][]) {
        // ! History
        this.pushToHistory();
        
        for (const id of layersId)
            this.deleteLayer(id);
    }
    toggleLayerVisible(id: Layer["id"], visible?: boolean) {
        this.updateLayers(layer => {
            if (layer.id == id)
                layer.toggleVisible(visible);

            return layer;
        })
    }
    toggleLayerLock(id: Layer["id"], lock?: boolean) {
        this.updateLayers(layer => {
            if (layer.id == id)
                layer.toggleLock(lock);

            return layer;
        })
    }
    renameLayer(id: Layer["id"], newName: string) {
        this.updateLayers(layer => {
            if (layer.id == id)
                layer.name = newName;

            return layer;
        });
    }
    layerIsEditable(id: Layer["id"]): boolean {
        return this.getLayer(id)?.editable || false;
    }
    layerIsCurrent(id: Layer["id"]): boolean {
        return this.CurrentLayerId.value == id;
    }
    moveLayer(id: Layer["id"], dir: number) {
        const layers = this.normalLayers;
        const newLayers: (Layer | null)[] = [...layers];
        const layerIndex = layers.findIndex(l=> l.id == id);
        if (layerIndex+dir > newLayers.length-1 || layerIndex+dir < 0 || layerIndex < 0) return;

        
        const a = newLayers[layerIndex];
        const b = newLayers[layerIndex+dir];

        newLayers[layerIndex] = null;
        newLayers[layerIndex+dir] = null;

        newLayers[layerIndex] = b;
        newLayers[layerIndex+dir] = a;
        // [newLayers[layerIndex], newLayers[layerIndex+1]] = [newLayers[layerIndex+1], newLayers[layerIndex]]

        this.setLayers(newLayers.filter(Boolean) as Layer[]);
    }

    pushToHistory() {
        // EditorTriggers.History.trigger(HistoryItemType.LAYERS, "layer-worker");
        HistoryWorker.save(HistoryItemType.LAYERS);
    }

    makeBlobFromAllLayers(scale: number=1): Promise<string> {

        const width = App.canvasWidth;
        const height = App.canvasHeight;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.width = width * scale;
        canvas.height = height * scale;
        context.imageSmoothingEnabled = false;
        context.imageSmoothingQuality = "low";
        
        let loaded = 0;
        const layersLength = this.normalLayers.length;

        async function makeLayerBlob(layer: Layer, resolve: (v: string)=> void) {
            const blob = await layer.makeBlob();

            const img = new Image();
            img.src = blob;
            
            img.onload = ()=> {
                context.drawImage(img, 0, 0, width * scale, height * scale);

                loaded ++;
                if (loaded >= layersLength) {
                    canvas.toBlob(blob=> {
                        if (!blob) return;

                        resolve(URL.createObjectURL(blob));
                    })
                }
            }
        }

        return new Promise((resolve, reject)=> {
            
            for (const layer of this.normalLayers) {
                makeLayerBlob(layer, resolve);
            }
            
        })
    }
    getShortData(): IShortLayerData[] {
        return this.Layers.value.filter(l=> !l.ghost).map(layer=> {
            const imageData = layer.getImageData();
            
            return {
                id: layer.id,
                name: layer.name,
                visible: layer.visible,
                locked: layer.locked,
                ghost: layer.ghost,
                imageData: {
                    width: imageData.width,
                    height: imageData.height,
                    data: [...imageData.data]
                }
            }
        })
    }
    setFromShortData(data: IShortLayerData[]) {
        const layers: Layer[] = [];
        
        for (const item of data) {
            if (!(item as any).ghost) {
            
                const imageData = new ImageData(item.imageData.width, item.imageData.height);
                imageData.data.set(new Uint8ClampedArray(item.imageData.data));
                
                const layer = new Layer(item.id, item.name, imageData);
                layer.visible = item.visible;
                layer.locked = item.locked;
                layers.push(layer);
            }
        }

        this.setLayers(layers);
        this.rerenderLayersElements();
    }
    async setLayers(layers: Layer[], cur?: boolean) {
        // ! CRUTCH
        
        const ul = await import("../layers/UILayer");
        const pl = await import("../layers/PreviewLayer");

        this.Layers.value = [
            ...layers,
            new ul.default().init(),
            new pl.default().init(),
        ]

        if (cur) {
            this.CurrentLayerId.value = this.Layers.value[0].id;
        }

        this.rerenderLayersElements();
    }
    rerenderLayersElements() {
        App.canvasLayersElement.innerHTML = "";
        this.Layers.value.map(layer=> {
            layer.appendCanvas();
        });
    }
    updateLayersAspect() {
        App.canvasLayersElement.style.width = App.canvasWidth + "px";
        App.canvasLayersElement.style.height = App.canvasHeight + "px";
        this.Layers.value.map(layer=> layer.updateAspect());
    }
}

export default new LayersWorker();