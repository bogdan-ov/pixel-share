import { EditorStates } from "../../states/editor-states";
import config from "../../utils/config";
import App from "../App";
import Mouse from "../managers/Mouse";
import tools, { ToolType } from "../tools";
import SelectionWorker from "../workers/SelectionWorker";
import Layer from "./Layer";

export default class UILayer extends Layer {
    elapsed: number
    
    constructor() {
        super(-2, "ui");

        this.ghost = true;
        this.elapsed = 0;
    }

    init() {
        super.init();

        // this.canvas.width = App.canvasWidth * config.UI_SCALE;
        // this.canvas.height = App.canvasHeight * config.UI_SCALE;

        tools[ToolType.SELECTION].DarkAlpha.listen(()=> {
            this.render();
        });
        EditorStates.MovingSelection.listen(()=> {
            this.render();
        });

        return this;
    }

    renderPointer() {
        this.context.fillStyle = config.POINTER_COLOR;
        this.context.fillRect(
            Math.floor(Mouse.pos.x * config.UI_SCALE),
            Math.floor(Mouse.pos.y * config.UI_SCALE),
            App.currentToolSize * config.UI_SCALE, App.currentToolSize * config.UI_SCALE
        );
    }
    renderSelection() {
        if (!SelectionWorker.selection.active) return;
        const scale = config.UI_SCALE
        
        const pos = SelectionWorker.selection.from;
        const width = SelectionWorker.selection.width;
        const height = SelectionWorker.selection.height;

        this.context.save();
        
        if (!EditorStates.MovingSelection.value) {
            this.context.fillStyle = `rgba(0, 0, 0, ${ tools[ToolType.SELECTION].DarkAlpha.value / 100 })`;
            this.context.fillRect(0, 0, App.canvasWidth*scale, App.canvasHeight*scale);
        }
        
        this.context.clearRect(
            Math.floor(pos.x*scale),
            Math.floor(pos.y*scale),
            Math.floor(width*scale),
            Math.floor(height*scale)
        );

        // this.context.fillStyle = config.SELECTION_COLOR;
        this.context.strokeStyle = config.SELECTION_COLOR;
        this.context.lineDashOffset = Math.round(this.elapsed / 4) % 12;
        this.context.setLineDash([ 8, 4 ])
        this.context.lineWidth = 4;
        this.context.strokeRect(
        // this.context.fillRect(
            Math.floor(pos.x*scale+2),
            Math.floor(pos.y*scale+2),
            Math.floor(width*scale-4),
            Math.floor(height*scale-4)
        );

        this.context.restore();
    }

    render() {
        this.clearCanvas();
        this.elapsed ++;

        this.renderSelection();
        this.renderPointer();
    }

    updateAspect(): void {
        super.updateAspect();

        this.canvas.width = App.canvasWidth * config.UI_SCALE;
        this.canvas.height = App.canvasHeight * config.UI_SCALE;
    }
}