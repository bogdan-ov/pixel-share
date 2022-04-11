import App from "../App";

export enum ModifierType {
    STROKE,
    ARRAY,
    DECAY
}

export default class Modifier {
    type: ModifierType
    name: string

    canvas!: HTMLCanvasElement
    context!: CanvasRenderingContext2D
    inited: boolean
    
    constructor(type: ModifierType) {
        this.type = type;
        this.name = "modifier"

        this.inited = false;
    }

    init(): Modifier {
        if (this.inited) return this;
        
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d")!;
        this.canvas.width = App.CanvasWidth.value;
        this.canvas.height = App.CanvasHeight.value;
        this.canvas.classList.add("preview-canvas");

        this.inited = true
        return this;
    }
    render(...args: any[]) {}
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    get dataUrl(): string {
        return this.canvas.toDataURL();
    }
    get imageData(): ImageData {
        return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
    get image(): HTMLImageElement {
        const img = new Image();
        img.src = this.dataUrl;
        return img;
    }

}