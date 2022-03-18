import { vec, Vector2 } from "../../utils/math";
import SelectionWorker from "../workers/SelectionWorker";
import Layer, { IPixelShortData } from "./Layer";

export default class PreviewLayer extends Layer {
    pixels: IPixelShortData[]
    
    constructor() {
        super(-1, "preview");

        this.ghost = true;
        this.pixels = [];
    }

    drawLine(props: {
        points: [Vector2, Vector2]
        color: string
        size?: number
        pixelPerfect?: boolean
        allowPreview?: boolean
        allowDrawBehindSelection?: boolean
        pixelRule?: ((pixelPos: Vector2) => boolean),
    }): number {
        super.drawLine(props);
        
        this.render();

        return this.pixels.length;
    }
    drawPixel(props: {
        position: Vector2
        color: string
        size?: number
        allowPreview?: boolean
        allowDrawBehindSelection?: boolean
    }) {
        if (!SelectionWorker.pointInsideSelection(props.position, props.allowDrawBehindSelection || false))
            return;
        
        const pixel = this.getPixelAt(props.position);

        if (pixel)
            pixel[2] = props.color;
        else
            this.pixels.push([ props.position.x, props.position.y, props.color, props.size||1 ]);
    }

    pixelPerfect() {
        super.pixelPerfect();
        
        const secondLastPixelShort = this.pixels[this.pixels.length-2];
        if (!secondLastPixelShort) return;
        
        const pos = vec(secondLastPixelShort[0], secondLastPixelShort[1]);
        const pixels = [...this.pixels].slice(this.pixels.length - 3, this.pixels.length);

        if (
            (this.getPixelAt(pos.addNum(1, 0), pixels) &&
            this.getPixelAt(pos.addNum(0, 1), pixels)) ||
            (this.getPixelAt(pos.addNum(-1, 0), pixels) &&
            this.getPixelAt(pos.addNum(0, -1), pixels)) ||

            (this.getPixelAt(pos.addNum(-1, 0), pixels) &&
            this.getPixelAt(pos.addNum(0, 1), pixels)) ||
            (this.getPixelAt(pos.addNum(1, 0), pixels) &&
            this.getPixelAt(pos.addNum(0, -1), pixels))
        )
            this.pixels.splice(this.pixels.length-2, 1);
    }
    getPixelAt(position: Vector2, pixels?: PreviewLayer["pixels"]): IPixelShortData {

        return (pixels || this.pixels).find(p=>
            Vector2.compare(vec(p[0], p[1]), position)
        )!;
        
    }
    
    render() {
        this.clearCanvas();

        this.pixels.map(pixel=> {
            this.context.fillStyle = pixel[2];
            this.context.fillRect(
                Math.floor(pixel[0]),
                Math.floor(pixel[1]),
                pixel[3], pixel[3]
            );
        });

        this.renderSelectionImage();
    }
    renderSelectionImage() {
        const sel = SelectionWorker.selection;
        if (!sel.imageData) return;

        this.context.putImageData(sel.imageData, sel.from.x, sel.from.y);
    }
    clearPixels() {
        this.pixels = [];
        this.render();
    }
}