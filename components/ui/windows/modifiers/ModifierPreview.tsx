import React, { createRef, useEffect } from "react";
import App from "../../../../editor/App";
import Layer from "../../../../editor/layers/Layer";
import LayersWorker from "../../../../editor/workers/LayersWorker";
import SelectionWorker from "../../../../editor/workers/SelectionWorker";
import { vec } from "../../../../utils/math";
import { ReactSimpleState } from "../../../../utils/types";
import { drawImageData } from "../../../../utils/utils";

export type IPreviewDraw = (curLayer: Layer, image: HTMLImageElement, imageData: ImageData, sel: ReturnType<typeof SelectionWorker.getSelection>, context: CanvasRenderingContext2D, canvas: HTMLCanvasElement)=> void
interface IArrayPreview {
    draw: IPreviewDraw
    drawReference?: ()=> void
    update: any[]
    updateReference?: any[]
    setImageData: ReactSimpleState<ImageData>
}

const ModifierPreview: React.FC<IArrayPreview> = React.memo(props=> {
    const canvasRef = createRef<HTMLCanvasElement>();
    
    useEffect(()=> {
        const canvas = canvasRef.current;
        const curLayer = LayersWorker.currentLayer;
        if (!canvas || !curLayer) return;
        const context = canvas.getContext("2d")!;
        canvas.width = App.CanvasWidth.value;
        canvas.height = App.CanvasHeight.value;

        const dataUrl = curLayer.getDataUrl();
        const imageData = curLayer.getSelectionImageData();
        const sel = SelectionWorker.getSelection();
        const image = new Image();
        image.src = dataUrl;
        
        props.draw(curLayer, image, imageData, sel, context, canvas);

        // props.setImageData(context.getImageData(0, 0, canvas.width, canvas.height));
        
    }, [canvasRef, ...props.update]);
    useEffect(()=> {
        props.drawReference && props.drawReference();
    }, props.updateReference ? props.updateReference : [])
    
    return <canvas ref={ canvasRef } className="preview-canvas" style={ { height: 200, width: "auto" } } />
});

ModifierPreview.displayName = "ModifierPreview";
export default ModifierPreview;