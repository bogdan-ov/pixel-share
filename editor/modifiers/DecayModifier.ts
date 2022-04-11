import { simplex2, seed as noiseSeed } from "../../src/libs/noise";
import LayersWorker from "../workers/LayersWorker";
import SelectionWorker from "../workers/SelectionWorker";
import Modifier, { ModifierType } from "./Modifier";

export default class DecayModifier extends Modifier {
    constructor() {
        super(ModifierType.DECAY);
        this.name = "decay"
    }

    render(intensive: number, scale: number, randomize: number, seed: number, inverse: boolean): void {
        super.render();

        const curLayer = LayersWorker.currentLayer;
        if (!curLayer) return;
        this.clear();
        
        const sel = SelectionWorker.getSelection();
        
        const dataUrl = curLayer.getDataUrl();
        const image = new Image();
        image.src = dataUrl;
        
        noiseSeed(seed);
        
        this.context.drawImage(
            image,
            sel.from.x, sel.from.y,
            sel.width, sel.height,
            sel.from.x,
            sel.from.y, 
            sel.width, sel.height
        )
        for (let i = 0; i < sel.width*sel.height; i ++) {
            const x = i%sel.width;
            const y = Math.floor(i/sel.width);
            const value = (simplex2(x/(scale/2), y/(scale/2))+1)/2
            const randomValue = (simplex2(x/scale*10, y/scale*10)+1)/2

            const allow = value*100 + randomValue*randomize <= intensive;

            if (inverse ? !allow : allow) {
                this.context.clearRect(x, y, 1, 1);
            }
        }

    }
}