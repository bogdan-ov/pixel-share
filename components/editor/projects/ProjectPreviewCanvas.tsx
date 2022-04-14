import React, { createRef, useEffect, useState } from "react";
import { IProjectData } from "../../../editor/workers/ProjectWorker";
import { clamp, vec } from "../../../utils/math";

const ProjectPreviewCanvas: React.FC<{ project: IProjectData }> = props=> {
    const canvasRef = createRef<HTMLCanvasElement>();
    const [loaded, setLoaded] = useState<boolean>(false);
    
    useEffect(()=> {
        setLoaded(false);
        
        const canvas = canvasRef.current;
        if (!canvas) return;

        const project = props.project;

        const width = project.canvasWidth;
        const height = project.canvasHeight;
        const context = canvas.getContext("2d")!;
        canvas.width = width;
        canvas.height = height;
        const aspect = (width*2) / clamp(width*2, 0, 128);
        canvas.style.width = clamp(width*2, 0, 128) + "px";
        canvas.style.height = (height*2/aspect) + "px";
        canvas.style.imageRendering = "pixelated";
    
        for (const layer of project.layers) {
            if (typeof layer.imageData.data != "string") {
                const imageData = new ImageData(layer.imageData.width, layer.imageData.height);
                imageData.data.set(new Uint8ClampedArray(layer.imageData.data));
                const data = imageData.data;

                for (let i = 0; i < data.length; i ++) {
                    const pos = vec(i % imageData.width, Math.floor(i / imageData.width));
                    const color = `rgba(${ data[i*4] }, ${ data[i*4+1] }, ${ data[i*4+2] }, ${ data[i*4+3]/255 })`;
        
                    context.fillStyle = color;
                    context.fillRect(pos.x, pos.y, 1, 1);
                }
            }
        }
        setLoaded(true);
            
    }, []);
    
    return <>
        <canvas ref={ canvasRef } style={ { position: "absolute" } } />
        { !loaded && <i className="text-muted">Loading preview...</i> }
    </>
};

ProjectPreviewCanvas.displayName = "ProjectPreviewCanvas";
export default ProjectPreviewCanvas;