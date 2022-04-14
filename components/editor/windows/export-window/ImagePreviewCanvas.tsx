import React, { createRef, useEffect } from "react";
import App from "../../../../editor/App";
import LayersWorker from "../../../../editor/workers/LayersWorker";
import config from "../../../../utils/config";
import Button from "../../../ui/buttons/Button";

const ImagePreviewCanvas: React.FC = ()=> {
    const canvasRef = createRef<HTMLCanvasElement>();

    function render() {
        const canvas = canvasRef.current;
        if (!canvas) {
            config.DEBUG && console.error("Image preview canvas doesn't exists!");
            return;
        }

        const width = App.CanvasWidth.value;
        const height = App.CanvasHeight.value;
        const context = canvas.getContext("2d")!;
        canvas.width = width;
        canvas.height = height;
    
        LayersWorker.makeBlobFromAllLayers()
            .then(blob=> {
                const img = new Image();
            
                img.onload = function() {
                    context.drawImage(img, 0, 0, width, height);
                }
                
                img.src = blob;
            })
            
    }
    useEffect(()=> {
        render()
    }, []);
    
    return (
        <div className="list gap-1">
            <canvas className="image-preview-canvas preview-canvas" ref={ canvasRef } />
            <Button
                type="link"
                text="Refresh"
                onClick={ render }
            />
        </div>
    )
};

export default ImagePreviewCanvas;