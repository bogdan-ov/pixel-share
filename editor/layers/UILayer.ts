import { EditorStates } from "../../states/editor-states";
import config from "../../utils/config";
import { vec, Vector2 } from "../../utils/math";
import { Anchor } from "../../utils/types";
import { hslaToString } from "../../utils/utils";
import App from "../App";
import Mouse from "../managers/Mouse";
import tools, { ToolType } from "../tools";
import SelectionWorker from "../workers/SelectionWorker";
import ViewWorker from "../workers/ViewWorker";
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

        tools[ToolType.SELECTION].DarkAlpha.listen(()=> {
            this.render();
        });
        EditorStates.MovingSelection.listen(()=> {
            this.render();
        });
        ViewWorker.GridEnabled.listen(()=> {
            this.render();
        })

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
            this.context.fillRect(0, 0, App.CanvasWidth.value*scale, App.CanvasHeight.value*scale);
        }
        
        this.context.clearRect(
            Math.floor(pos.x*scale),
            Math.floor(pos.y*scale),
            Math.floor(width*scale),
            Math.floor(height*scale)
        );

        // this.context.fillStyle = config.SELECTION_COLOR;
        // this.context.fillRect(
        //     Math.floor(pos.x*scale),
        //     Math.floor(pos.y*scale),
        //     Math.floor(width*scale),
        //     Math.floor(height*scale)
        // );
        this.context.strokeStyle = config.SELECTION_COLOR;
        this.context.lineDashOffset = Math.round(this.elapsed / 4) % (scale + scale*2);
        this.context.setLineDash([ scale*2, scale ])
        this.context.lineWidth = scale;
        this.context.strokeRect(
            Math.floor(pos.x*scale+Math.round(scale/2)),
            Math.floor(pos.y*scale+Math.round(scale/2)),
            Math.floor(width*scale-(scale + scale%2)),
            Math.floor(height*scale-(scale + scale%2))
        );

        this.context.restore();
    }
    renderGrid() {
        if (!ViewWorker.GridEnabled.value) return;
        const width = App.CanvasWidth.value;
        const height = App.CanvasHeight.value;
        const scale = config.UI_SCALE;
        const cellWidth = ViewWorker.GridWidth.value;
        const cellHeight = ViewWorker.GridHeight.value;

        this.context.strokeStyle = hslaToString(ViewWorker.GridColor.value);
        const lineWidth = Math.round(20/App.zoom);
        this.context.lineWidth = lineWidth + lineWidth%2;

        for (let x = 1; x < Math.floor(width/cellWidth)+1; x ++) {

            this.context.moveTo(x*scale*cellWidth, 0);
            this.context.lineTo(x*scale*cellWidth, height*scale);
            
            this.context.stroke();
            this.context.beginPath();
        }
        for (let y = 1; y < Math.floor(height/cellHeight)+1; y ++) {
            this.context.moveTo(0, y*scale*cellHeight);
            this.context.lineTo(width*scale, y*scale*cellHeight);
            
            this.context.stroke();
            this.context.beginPath();
        }
    }

    render() {
        this.clearCanvas();
        this.elapsed ++;

        this.renderSelection();
        this.renderPointer();
        this.renderGrid();
    }

    resize(anchor: Anchor): void {
        super.resize(anchor);

        this.canvas.width = App.CanvasWidth.value * config.UI_SCALE;
        this.canvas.height = App.CanvasHeight.value * config.UI_SCALE;
    }
}