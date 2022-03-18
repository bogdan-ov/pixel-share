import { vec, Vector2 } from "../../utils/math";
import LayersWorker from "../workers/LayersWorker";
import SelectionWorker from "../workers/SelectionWorker";

// What is this class for?..
export class Renderer {

    // Draw
    drawLine(props: {
        points: [Vector2, Vector2]
        color: string
        size?: number
        pixelPerfect?: boolean
        pixelRule?: (pixelPos: Vector2)=> boolean
        allowPreview?: boolean
        clearPreview?: boolean
        allowDrawBehindSelection?: boolean
    }): number {
        if (!LayersWorker.currentLayer?.editable) return 0;
        
        if (props.clearPreview)
            LayersWorker.previewLayer?.clearPixels();

        const layer = props.allowPreview ? LayersWorker.previewLayer : LayersWorker.currentLayer;
        return layer?.drawLine(props) || 0;
    }

    // Mics
    updatePreview() {
        const previewLayer = LayersWorker.previewLayer;
        const curLayer = LayersWorker.currentLayer;
        if (!previewLayer || !curLayer) return;
        
        for (const pixel of previewLayer.pixels) {
            curLayer.drawPixel({
                position: vec(pixel[0], pixel[1]),
                color: pixel[2],
                size: pixel[3]
            });
        }

        const sel = SelectionWorker.selection;
        if (sel.imageData) {
            curLayer.putImageData(sel.imageData, sel.from);
            // const imageData = sel.imageData.data;

            // for (let i = 0; i < imageData.length; i ++) {
            //     const pos = vec(i % sel.width, Math.floor(i / sel.width)).add(sel.from);
            //     const color = `rgba(${ imageData[i*4] }, ${ imageData[i*4+1] }, ${ imageData[i*4+2] }, ${ imageData[i*4+3]/255 })`;

            //     curLayer.drawPixel({
            //         position: pos,
            //         color,
            //         size: 1
            //     });
                
            // }
        }
        
        previewLayer.clearPixels();
    }
} 