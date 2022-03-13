import React, { createRef, useEffect } from "react";
import App from "../../../../editor/App";
import LayersWorker from "../../../../editor/workers/LayersWorker";
import config from "../../../../utils/config";

const ImagePreviewCanvas: React.FC = ()=> {
    const canvasRef = createRef<HTMLCanvasElement>();

    useEffect(()=> {
        const canvas = canvasRef.current;
        if (!canvas) {
            config.DEBUG && console.error("Image preview canvas doesn't exists!");
            return;
        }

        const width = App.canvasWidth;
        const height = App.canvasHeight;
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
            
    }, []);
    
    return <canvas className="image-preview-canvas" ref={ canvasRef } />
};

export default ImagePreviewCanvas;