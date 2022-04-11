import { vec, Vector2 } from "../../utils/math";
import { HSLA } from "../../utils/types";
import App from "../App";
import LayersWorker from "../workers/LayersWorker";
import SelectionWorker from "../workers/SelectionWorker";
import Modifier, { ModifierType } from "./Modifier";

export default class StrokeModifier extends Modifier {
    constructor() {
        super(ModifierType.STROKE);
        this.name = "stroke";
    }

    render(right: boolean, left: boolean, top: boolean, bottom: boolean, topLeft: boolean, topRight: boolean, bottomLeft: boolean, bottomRight: boolean, color: HSLA): void {
        super.render();

        const curLayer = LayersWorker.currentLayer;
        if (!curLayer) return;
        this.clear();

        //
        const stroke = (pos: Vector2, offsetX: number, offsetY: number, color: string)=> {
            this.context.fillStyle = color;
            this.context.fillRect(
                Math.floor(pos.x + offsetX + sel.from.x),
                Math.floor(pos.y + offsetY + sel.from.y),
                1, 1
            );
        }
        //
        
        const sel = SelectionWorker.getSelection();
        
        const imageData = curLayer.getSelectionImageData();
        const dataUrl = curLayer.getDataUrl();
        const image = new Image();
        image.src = dataUrl;

        const data = imageData.data;
        for (let i = 0; i < data.length; i ++) {
            const pos = vec(i % imageData.width, Math.floor(i / imageData.width));
            const c = `hsla(${ color[0] }, ${ color[1] }%, ${ color[2] }%, ${ data[i*4+3]/255 })`;

            if (pos.y < App.CanvasHeight.value) {

                right && stroke(pos, 1, 0, c);
                left && stroke(pos, -1, 0, c);
                top && stroke(pos, 0, -1, c);
                bottom && stroke(pos, 0, 1, c);
        
                bottomRight && stroke(pos, 1, 1, c);
                topLeft && stroke(pos, -1, -1, c);
                topRight && stroke(pos, 1, -1, c);
                bottomLeft && stroke(pos, -1, 1, c);
            }
        }
        
        this.context.drawImage(
            image,
            sel.from.x, sel.from.y,
            sel.width, sel.height,
            sel.from.x,
            sel.from.y, 
            sel.width, sel.height
        )
    }
}