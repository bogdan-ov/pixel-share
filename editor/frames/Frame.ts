import Layer from "../layers/Layer";

export interface IFrameLayerData {
    id: Layer["id"]
    dataUrl: string
}

export default class Frame {
    id: number
    layersData: IFrameLayerData[]
    
    constructor(id: number) {
        this.id = id;
        this.layersData = [];
    }
}