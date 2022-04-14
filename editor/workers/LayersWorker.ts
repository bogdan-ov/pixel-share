import { HistoryItemType } from "../../components/editor/history/HistoryWorker";
import State, { state } from "../../states/State";
import { coolLayerNames, putItemAt, safeValue } from "../../utils/utils";
import Layer from "../layers/Layer";
import App from "../App";
import PreviewLayer from "../layers/PreviewLayer";
import UILayer from "../layers/UILayer";
import { randomInt, vec } from "../../utils/math";
import { EditorActionType, EditorEditedType, EditorTriggers, IEditorActionTrigger } from "../../states/editor-states";
import { Anchor } from "../../utils/types";

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
        this.Layers = state<Layer[]>([], "layers-worker-layers");
        this.CurrentLayerId = state<Layer["id"]>(0, "layers-worker-current-layer-id");
    }

    init() {
        this.setDefaultLayers();

        this.Layers.listen(layers=> {
            layers.map(layer=> layer.init());
            this.rerenderLayersElements();
        });
        EditorTriggers.Action.listen(a=> this.actionListener(a), "layers-worker-action");
    }

    actionListener(action: IEditorActionTrigger) {
        switch (action.type) {
            // Add layer
            case EditorActionType.ADD_LAYER:
                this.addLayer(action.targetId);
                break;
            // Clear layer
            case EditorActionType.CLEAR_LAYER_CANVAS:
                this.layersListPushToHistory();
                this.getLayer(action.targetId)?.clearCanvas();
                EditorTriggers.Edited.trigger({ type: EditorEditedType.LAYERS_EDITED });
                break;
            // Clear layer selection
            case EditorActionType.CLEAR_SELECTION:
                this.getLayer(action.targetId)?.clearBySelection();
                EditorTriggers.Edited.trigger({ type: EditorEditedType.LAYERS_EDITED });
                break;
            // Delete layer
            case EditorActionType.DELETE_LAYER:
                this.deleteLayer(action.targetId);
                break;
            case EditorActionType.DUPLICATE_LAYER:
                this.duplicateLayer(action.targetId);
                break;
            case EditorActionType.MERGE_VISIBLE_LAYERS:
                this.mergeVisibleLayers();
                break;
        }
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
        this.Layers.set(v => v.map(callback), false, "layers-worker");
        this.layersEdited();
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
    addLayer(belowLayerId?: Layer["id"]) {
        this.layersListPushToHistory();
        
        const id = Date.now();
        const belowId = safeValue(belowLayerId, this.CurrentLayerId.value);
        const belowIndex = this.normalLayers.findIndex(l=> l.id == belowId);
        
        const layer = this.makeLayer(id);
        this.putLayerAt(layer, belowIndex+1);

        this.CurrentLayerId.value = id;
        this.rerenderLayersElements();
        this.layersEdited();
    }
    makeLayer(id?: Layer["id"], name?: string, imageData?: ImageData): Layer {
        return new Layer(safeValue(id, Date.now()), name || coolLayerNames[randomInt(0, coolLayerNames.length)] || "New layer", imageData);
    }
    putLayerAt(layer: Layer, index?: number) {
        this.Layers.set(v=> putItemAt(v, layer, safeValue(index, v.length-1)));
    }
    deleteLayer(id?: Layer["id"]) {
        const layerId = safeValue(id, this.CurrentLayerId.value);

        if (!this.getLayer(layerId) || this.normalLayers.length <= 1) return;
        
        this.layersListPushToHistory();

        let removedIndex = this.normalLayers.findIndex(l=> l.id == layerId);
        
        this.Layers.set(v => v.filter(layer=> {
            if (layer.id != layerId) {
                return true;
            }

            return false;
        }));

        if (this.layerIsCurrent(layerId)) {
            let nextLayer = this.normalLayers[removedIndex];
            if (!nextLayer)
                nextLayer = this.normalLayers[removedIndex - 1];
                
            this.CurrentLayerId.value = (nextLayer ? nextLayer : this.normalLayers[0]).id;
        }

        this.rerenderLayersElements();
        this.layersEdited();
    }
    duplicateLayer(id?: Layer["id"]) {
        const layer = this.getLayer(id);
        if (!layer) return;

        this.layersListPushToHistory();

        const belowIndex = this.Layers.value.findIndex(l=> l.id == layer.id);
        let layerName = layer.name;
        if (layerName.indexOf("Another copy") >= 0)
            layerName = "Super-copy " + layerName.replace("Another copy ", "");
        else if (layerName.indexOf("Copy") >= 0)
            layerName = "Another copy " + layerName.replace("Copy ", "");
        else if (layerName.indexOf("Copy") < 0)
            layerName = "Copy " + layerName;

        const dupLayer = new Layer(Date.now(), layerName, layer.getImageData());

        this.putLayerAt(dupLayer, belowIndex+1);

        this.CurrentLayerId.value = dupLayer.id;
        this.layersEdited();
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
        this.layerPushToHistory(id);
        
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

        this.layersListPushToHistory();
        
        const a = newLayers[layerIndex];
        const b = newLayers[layerIndex+dir];

        newLayers[layerIndex] = null;
        newLayers[layerIndex+dir] = null;

        newLayers[layerIndex] = b;
        newLayers[layerIndex+dir] = a;

        this.setLayers(newLayers.filter(Boolean) as Layer[]);
        this.layersEdited();
    }
    mergeVisibleLayers() {
        let layers = [...this.normalLayers];
        const visibleLayers = [...layers.filter(l=> l.visible)];
        
        this.layersListPushToHistory();
        
        const id = Date.now();
        const newLayer = this.makeLayer(id, "Merged layer").init();
    
        for (const layer of visibleLayers) {
            newLayer.putDataUrl(layer.getDataUrl());
        }

        this.setLayers(putItemAt(layers.filter(l=> !l.visible), newLayer, this.Layers.value.findIndex(l=> l.id == visibleLayers.at(-1)?.id)));
        this.CurrentLayerId.value = id;
        this.rerenderLayersElements();
        this.layersEdited();
    }

    layerPushToHistory(layerId: number) {
        EditorTriggers.History.trigger({
            type: HistoryItemType.LAYER_EDITED,
            targetId: layerId
        });
    }
    layersListPushToHistory() {
        EditorTriggers.History.trigger({
            type: HistoryItemType.LAYERS_LIST_EDITED
        });
    }
    layersEdited() {
        EditorTriggers.Edited.trigger({
            type: EditorEditedType.LAYERS_EDITED
        });
    }

    makeBlobFromAllLayers(scale: number=1): Promise<string> {
        const width = App.CanvasWidth.value;
        const height = App.CanvasHeight.value;

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
    makeBlobFromImagesData(imagesData: ImageData[], scale: number=1): Promise<string> {
        const width = App.CanvasWidth.value;
        const height = App.CanvasHeight.value;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.width = width * scale;
        canvas.height = height * scale;
        context.imageSmoothingEnabled = false;
        context.imageSmoothingQuality = "low";
        
        let loaded = 0;

        function makeBlob(imageData: ImageData, resolve: (v: string)=> void) {
            if (!imageData) {
                console.error("No image data to draw (Layer worker)");
                return;
            }
    
            const data = imageData.data;
    
            for (let i = 0; i < data.length; i ++) {
                const pos = vec(i % imageData.width, Math.floor(i / imageData.width));
                const color = `rgba(${ data[i*4] }, ${ data[i*4+1] }, ${ data[i*4+2] }, ${ data[i*4+3]/255 })`;
    
                context.fillStyle = color;
                context.fillRect(
                    Math.floor(pos.x), Math.floor(pos.y),
                    1, 1
                );
            }
            
            loaded ++;
            console.log(loaded);
            if (loaded >= imagesData.length) {
                canvas.toBlob(blob=> {
                    if (!blob) return;

                    resolve(URL.createObjectURL(blob));
                })
            }
        }

        return new Promise((resolve, reject)=> {
            
            for (const imageData of imagesData) {
                makeBlob(imageData, resolve);
            }
            
        })
    }
    makeBlobFromDataUrls(dataUrls: string[], scale: number=1): Promise<string> {
        const width = App.CanvasWidth.value;
        const height = App.CanvasHeight.value;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.width = width * scale;
        canvas.height = height * scale;
        context.imageSmoothingEnabled = false;
        context.imageSmoothingQuality = "low";
        
        let loaded = 0;
        const layersLength = this.normalLayers.length;

        function makeDataUrl(dataUrl: string, resolve: (v: string)=> void) {
            const img = new Image();
            img.src = dataUrl;
            
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
            
            for (const data of dataUrls) {
                makeDataUrl(data, resolve);
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
    async setFromShortData(data: IShortLayerData[]) {
        const res = await this.loadFromShortData(data)
        this.setLayers(res);
    }
    loadFromShortData(data: IShortLayerData[]): Promise<Layer[]> {
        const layers: Layer[] = [];
            
        for (const item of data) {
            if (!(item as any).ghost) {
                const imageData = new ImageData(item.imageData.width, item.imageData.height);
                imageData.data.set(new Uint8ClampedArray(item.imageData.data));
                
                const layer = new Layer(item.id, item.name, imageData).init();
                layer.visible = item.visible;
                layer.locked = item.locked;
                layers.push(layer);
            }
        }

        return new Promise((resolve)=> {
            resolve(layers);
        })
    }
    setDefaultLayers() {
        this.setLayers([ 
            new Layer(Date.now(), "Layer 1").init(),  
        ], true);
    }
    setLayers(layers: Layer[], applyCurrent?: boolean) {
        
        this.Layers.value = [
            ...layers,
            new UILayer().init(),
            new PreviewLayer().init()
        ]

        if (applyCurrent) {
            this.CurrentLayerId.value = this.Layers.value[0].id;
        }
    }
    rerenderLayersElements() {
        App.canvasLayersElement.innerHTML = "";
        this.Layers.value.map(layer=> {
            layer.appendCanvas();
        });
    }
    resizeLayers(anchor: Anchor) {
        App.canvasLayersElement.style.width = App.CanvasWidth.value + "px";
        App.canvasLayersElement.style.height = App.CanvasHeight.value + "px";
        this.Layers.value.map(layer=> layer.resize(anchor));

        this.rerenderLayersElements();
    }
}

export default new LayersWorker();