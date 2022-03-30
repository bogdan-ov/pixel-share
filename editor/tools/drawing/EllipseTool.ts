import { ToolType } from "..";
import { EditorStates } from "../../../states/editor-states";
import { vec } from "../../../utils/math";
import App from "../../App";
import { Renderer } from "../../renderer/Renderer";
import LayersWorker from "../../workers/LayersWorker";
import PaletteWorker from "../../workers/PaletteWorker";
import ShapeTool from "../parent/ShapeTool";

export default class EllipseTool extends ShapeTool {
    constructor() {
        super(ToolType.ELLIPSE);

        this.resizable = true;
        this.allowPreview
    }

    // Algorithm source: https://www.geeksforgeeks.org/midpoint-ellipse-drawing-algorithm/
    // (Yes, I'm just copy and paste code...)
    onDraw(renderer: Renderer): void {
        super.onDraw(renderer);
        const previewLayer = LayersWorker.previewLayer;
        if (!previewLayer || !this.canBeUsed) return;
        
        const width = Math.floor(Math.abs(this.shapeWidth)/2 + .5);
        const height = Math.floor(Math.abs(this.shapeHeight)/2 + .5);
        const offset = this.drawFromCenter ? vec() : vec(
            Math.ceil((this.to.x - this.from.x) / 2) * this.dir.x,
            Math.ceil((this.to.y - this.from.y) / 2) * this.dir.y,
        );

        var dx, dy, d1, d2, x, y;
        x = 0;
        y = height;
    
        // Initial decision parameter of region 1
        d1 = (height * height) - (width * width * height) + (0.0 * width * width);
        dx = 2 * height * height * x;
        dy = 2 * width * width * y;
    
        previewLayer.clearPixels();

        // For region 1
        while (dx < dy)
        {
            
            this.drawPixel(x + this.start.x + offset.x, y + this.start.y + offset.y);
            this.drawPixel(-x + this.start.x + offset.x, y + this.start.y + offset.y);
            this.drawPixel(x + this.start.x + offset.x, -y + this.start.y + offset.y);
            this.drawPixel(-x + this.start.x + offset.x, -y + this.start.y + offset.y);
    
            // Checking and updating value of
            // decision parameter based on algorithm
            if (d1 < 0)
            {
                x++;
                dx = dx + (2 * height * height);
                d1 = d1 + dx + (height * height);
            }
            else
            {
                x++;
                y--;
                dx = dx + (2 * height * height);
                dy = dy - (2 * width * width);
                d1 = d1 + dx - dy + (height * height);
            }
        }
    
        // Decision parameter of region 2
        d2 = ((height * height) * ((x + 0.5) * (x + 0.5))) +
            ((width * width) * ((y - 1) * (y - 1))) -
            (width * width * height * height);
    
        // Plotting points of region 2
        while (y >= 0)
        {
            this.drawPixel(x + this.start.x + offset.x, y + this.start.y + offset.y);
            this.drawPixel(-x + this.start.x + offset.x, y + this.start.y + offset.y);
            this.drawPixel(x + this.start.x + offset.x, -y + this.start.y + offset.y);
            this.drawPixel(-x + this.start.x + offset.x, -y + this.start.y + offset.y);
    
            // Checking and updating parameter
            // value based on algorithm
            if (d2 > 0)
            {
                y--;
                dy = dy - (2 * width * width);
                d2 = d2 + (width * width) - dy;
            }
            else
            {
                y--;
                x++;
                dx = dx + (2 * height * height);
                dy = dy - (2 * width * width);
                d2 = d2 + dx - dy + (width * width);
            }
        }

        previewLayer.render();

        EditorStates.HelperText.value = `x ${ this.start.x }, y ${ this.start.y }<br>w ${ Math.abs(this.shapeWidth)+1 }, h ${ Math.abs(this.shapeHeight)+1 }`;
    }

    drawPixel(x: number, y: number) {
        if (!LayersWorker.previewLayer) return;

        LayersWorker.previewLayer.drawPixel({
            position: vec(x, y),
            allowPreview: true,
            size: App.ToolsSize.value,
            color: PaletteWorker.currentPaletteColor.hexColor,
        });
    }
}