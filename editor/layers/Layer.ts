import config from "../../utils/config";
import { vec, Vector2 } from "../../utils/math";
import { RGBA } from "../../utils/types";
import { safeValue } from "../../utils/utils";
import App from "../App";
import SelectionWorker from "../workers/SelectionWorker";

export interface IPixelData {
    position: Vector2
    color: RGBA
}
export type IPixelShortData = [x: number, y: number, color: string, size: number];

export default class Layer {
    id: number
    name: string
    ghost: boolean
    visible: boolean
    locked: boolean
    order: number
    
    canvas!: HTMLCanvasElement
    context!: CanvasRenderingContext2D

    inited: boolean
    initialImageData: ImageData | null
    
    constructor(id: number, name: string, imageData?: ImageData) {
        this.id = id;
        this.name = name;
        this.ghost = false;
        this.visible = true;
        this.locked = false;
        this.order = 0;

        this.inited = false;
        this.initialImageData = imageData || null;
    }

    init(): Layer {
        if (this.inited) return this;
        
        this.canvas = document.createElement("canvas");
        this.canvas.id = this.name.toLowerCase().split(" ").join("-");
        this.context = this.canvas.getContext("2d")!;
        this.context.imageSmoothingEnabled = false;

        this.updateAspect();
        this.appendCanvas();
        
        if (this.initialImageData) {
            this.replaceImageData(this.initialImageData);
            this.initialImageData = null;
        }
        
        this.inited = true;

        return this;
    }
    appendCanvas() {
        App.canvasLayersElement.appendChild(this.canvas);
    }

    // Draw pixels
    drawLine(props: {
        points: [Vector2, Vector2]
        color: string
        pixelPerfect?: boolean
        allowDrawBehindSelection?: boolean
        pixelRule?: (pixelPos: Vector2)=> boolean
        size?: number
    }): number {
        if (!this.editable) return 0;
        
        const from = props.points[0].expand();
        const to = props.points[1].expand();

        const delta = to.sub(from);
        let step = 0;
        
        if (Math.abs(delta.x) >= Math.abs(delta.y))
            step = Math.abs(delta.x);
        else
            step = Math.abs(delta.y);

        delta.copy(delta.div(step));
        let i = 0;

        while (i <= step) {
            const pos = from.add(vec(.5, .5)).apply(Math.floor);

            if (props.pixelPerfect)
                this.pixelPerfect();
            
            if (props.pixelRule ? props.pixelRule(pos) : true)
                this.drawPixel({
                    ...props,
                    position: pos,
                });   

            from.x += delta.x;
            from.y += delta.y;
            i ++;
        }
        
        return 0;
    }
    drawPixel(props: {
        position: Vector2
        color: string
        size?: number
        allowPreview?: boolean
        allowDrawBehindSelection?: boolean
    }) {
        if (!this.editable) return;
        if (!SelectionWorker.pointInsideSelection(props.position, props.allowDrawBehindSelection || false))
            return;
        
        const size = props.size || 1;
        
        if (props.color == config.EMPTY_PIXEL_COLOR) {
            // Erase
            this.context.clearRect(
                Math.floor(props.position.x),
                Math.floor(props.position.y),
                size, size
            );
        } else {
            // Draw
            this.context.fillStyle = props.color;
            this.context.fillRect(
                Math.floor(props.position.x),
                Math.floor(props.position.y),
                size, size
            );
        }
    }
    pixelPerfect() {}
    
    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    clearRect(pos: Vector2, width: number, height: number) {
        this.context.clearRect(pos.x, pos.y, width, height);
    }
    clearBySelection() {
        const selection = SelectionWorker.selection;
        const pos = selection.from.expand();
        let width = selection.width;
        let height = selection.height;

        if (width < 0) {
            width -= 2;
            pos.x += 1;
        }
        if (height < 0) {
            height -= 2;
            pos.y += 1;
        }
        
        this.clearRect(pos, width, height);
    }
    updateAspect() {
        this.canvas.style.width = App.canvasWidth + "px";
        this.canvas.style.height = App.canvasHeight + "px";
        this.canvas.width = App.canvasWidth;
        this.canvas.height = App.canvasHeight;
    }
    // removeDOM() {
    //     this.canvas.remove();
    // }
    toggleVisible(visible?: boolean) {
        this.visible = safeValue(visible, !this.visible);
        
        this.canvas.style.visibility = this.visible ? "visible" : "hidden";
    }
    toggleLock(locked?: boolean) {
        this.locked = safeValue(locked, !this.locked);
    }
    get editable(): boolean {
        return this.visible && !this.locked;
    }

    pickColorAt(pos: Vector2): RGBA {
        const imageData = this.getImageData();
        const pixelIndex = pos.toIndex(this.canvas.width) * 4;

        return [
            imageData.data[pixelIndex],
            imageData.data[pixelIndex+1],
            imageData.data[pixelIndex+2],
            imageData.data[pixelIndex+3],
        ]
    }
    makeBlob(): Promise<string> {
        return new Promise((resolve, reject)=> {

            this.canvas.toBlob(blob=> {
                if (!blob) {
                    reject(null);
                    return;
                }

                resolve(URL.createObjectURL(blob));
            })

        });
    }
    getImageData(pos: Vector2=vec(), width: number=this.canvas.width, height: number=this.canvas.height): ImageData {
        return this.context.getImageData(pos.x, pos.y, width, height);
    }
    replaceImageData(imageData: ImageData) {
        if (!imageData) {
            console.error("No image data");
            return;
        }
        
        this.clearCanvas();

        this.context.putImageData(imageData, 0, 0);
    }
    putImageData(imageData: ImageData, position: Vector2=vec()) {
        if (!imageData) return;

        const data = imageData.data;

        for (let i = 0; i < data.length; i ++) {
            const pos = vec(i % imageData.width, Math.floor(i / imageData.width)).add(position);
            const color = `rgba(${ data[i*4] }, ${ data[i*4+1] }, ${ data[i*4+2] }, ${ data[i*4+3]/255 })`;

            this.drawPixel({
                position: pos,
                color,
                size: 1
            });
            
        }

    }
}
//
// export 