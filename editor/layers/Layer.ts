import { HistoryItemType } from "../../components/editor/history/HistoryWorker";
import { EditorEditedType, EditorTriggers } from "../../states/editor-states";
import config from "../../utils/config";
import { vec, Vector2 } from "../../utils/math";
import { Anchor, RGBA } from "../../utils/types";
import { safeValue } from "../../utils/utils";
import App from "../App";
import Modifier, { ModifierType } from "../modifiers/Modifier";
import LayersWorker from "../workers/LayersWorker";
import ModifiersWorker from "../workers/ModifiersWorker";
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
    initialImageData: ImageData | string | null
    
    constructor(id: number, name: string, imageData?: ImageData | string) {
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

        this.resize(Anchor.TOP_LEFT);
        
        if (this.initialImageData) {
            if (typeof this.initialImageData == "string")
                this.replaceDataUrl(this.initialImageData);
            else
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
        if (!SelectionWorker.pointInSelection(props.position, props.allowDrawBehindSelection || false))
            return;
        
        const size = props.size || 1;
        const x = Math.floor(props.position.x);
        const y = Math.floor(props.position.y);
        
        if (props.color == config.EMPTY_PIXEL_COLOR || props.color == config.POINTER_COLOR) {
            // Erase
            this.context.clearRect(
                x, y,
                size, size
            );
        } else {
            // Draw
            this.context.fillStyle = props.color;
            this.context.fillRect(
                x, y,
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
    /**
     * **Clear ALL layer if selection isn't active!**
     */
    clearBySelection() {
        LayersWorker.layersListPushToHistory();

        const selection = SelectionWorker.getSelection();
        const pos = selection.from.expand();
        
        this.clearRect(pos, selection.width, selection.height);
    }
    resize(anchor: Anchor) {
        const dataUrl = this.getDataUrl();
        
        // this.canvas.style.width = App.CanvasWidth.value + "px";
        // this.canvas.style.height = App.CanvasHeight.value + "px";

        let x = 0;
        let y = 0;

        // Horizontal
        if (anchor == Anchor.TOP_LEFT || anchor == Anchor.CENTER_LEFT || anchor == Anchor.BOTTOM_LEFT) {
        }
        else if (anchor == Anchor.TOP_CENTER || anchor == Anchor.CENTER_CENTER || anchor == Anchor.BOTTOM_CENTER)
            x = -this.canvas.width/2 + App.CanvasWidth.value/2;
        else if (anchor == Anchor.TOP_RIGHT || anchor == Anchor.CENTER_RIGHT || anchor == Anchor.BOTTOM_RIGHT)
            x = -this.canvas.width + App.CanvasWidth.value;
        
        // Vertical
        if (anchor == Anchor.TOP_LEFT || anchor == Anchor.TOP_CENTER || anchor == Anchor.TOP_RIGHT) {
        }
        else if (anchor == Anchor.CENTER_LEFT || anchor == Anchor.CENTER_CENTER || anchor == Anchor.CENTER_RIGHT)
            y = -this.canvas.height/2 + App.CanvasHeight.value/2;
        else if (anchor == Anchor.BOTTOM_LEFT || anchor == Anchor.BOTTOM_CENTER || anchor == Anchor.BOTTOM_RIGHT)
            y = -this.canvas.height + App.CanvasHeight.value;
        
        this.canvas.width = App.CanvasWidth.value;
        this.canvas.height = App.CanvasHeight.value;
        
        this.replaceDataUrl(dataUrl, Math.floor(x), Math.floor(y));
    }
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

    // Image date
    getSelectionImageData(): ImageData {
        const sel = SelectionWorker.getSelection();
        return this.getImageData(sel.from, sel.width, sel.height);
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
    getDataUrl(): string {
        return this.canvas.toDataURL();
    }
    replaceImageData(imageData: ImageData, x: number=0, y: number=0) {
        if (!imageData) {
            console.error("No layer image data to replace");
            return;
        }
        
        this.clearCanvas();

        // this.putImageData(imageData, x, y)
        this.context.putImageData(imageData, x, y);
    }
    putImageData(imageData: ImageData, x: number=0, y: number=0) {
        if (!imageData) {
            console.error("No layer image data to put");
            return;
        }
        
        const data = imageData.data;

        for (let i = 0; i < data.length; i ++) {
            const pos = vec(i % imageData.width, Math.floor(i / imageData.width)).add(vec(x, y));
            const color = `rgba(${ data[i*4] }, ${ data[i*4+1] }, ${ data[i*4+2] }, ${ data[i*4+3]/255 })`;

            if (pos.y < imageData.height + y) {
                this.context.fillStyle = color;
                this.context.fillRect(pos.x, pos.y, 1, 1);
            }
        }
    }
    putDataUrl(dataUrl: string, x: number=0, y: number=0) {
        if (!dataUrl) {
            console.error("No layer data url to put");
            return;
        }
        
        const img = new Image();
        img.src = dataUrl;

        this.context.drawImage(img, x, y);
    }
    replaceDataUrl(dataUrl: string, x: number=0, y: number=0) {
        if (!dataUrl) {
            console.error("No layer data url to replace");
            return;
        }

        this.clearCanvas();
        this.putDataUrl(dataUrl, x, y);
    }

    // Modifiers
    applyModifierByType(type: ModifierType, props?: any[], historyAndNotify: boolean=true) {
        this.applyModifier(ModifiersWorker.getModifier(type), props, historyAndNotify);
    }
    applyModifier(modifier: Modifier, props?: any, historyAndNotify: boolean=true) {
        if (historyAndNotify)
            LayersWorker.layerPushToHistory(this.id);
        
        if (props)
            modifier.render(props);
        this.clearBySelection();
        this.putImageData(modifier.imageData);

        if (historyAndNotify) {
            EditorTriggers.Edited.trigger({
                type: EditorEditedType.LAYERS_EDITED
            })
            EditorTriggers.Notification.trigger({
                content: `Modifier ${ modifier.name } applied!`,
            });
        }
    }

    // Mics
    pushToHistory() {
        EditorTriggers.History.trigger({
            type: HistoryItemType.LAYER_EDITED,
            targetId: this.id
        });
    }
}