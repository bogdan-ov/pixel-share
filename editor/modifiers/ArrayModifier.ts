import LayersWorker from "../workers/LayersWorker";
import SelectionWorker from "../workers/SelectionWorker";
import Modifier, { ModifierType } from "./Modifier";

export default class ArrayModifier extends Modifier {
    constructor() {
        super(ModifierType.ARRAY);
        this.name = "array"
    }

    render(iterations: number, offsetX: number, offsetY: number) {
        super.render();

        const curLayer = LayersWorker.currentLayer;
        if (!curLayer) return;
        this.clear();
        
        const sel = SelectionWorker.getSelection();
        
        const dataUrl = curLayer.getDataUrl();
        const image = new Image();
        image.src = dataUrl;
        
        for (let i = 0; i < iterations; i ++) {
            this.context.drawImage(
                image,
                sel.from.x, sel.from.y,
                sel.width, sel.height,
                i*offsetX + sel.from.x,
                i*offsetY + sel.from.y, 
                sel.width, sel.height
            );
        }
    }
}