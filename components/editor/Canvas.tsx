import React, { createRef, useEffect } from "react";
import App from "../../editor/App";
import Keyboard from "../../editor/managers/Keyboard";
import Mouse from "../../editor/managers/Mouse";
import config from "../../utils/config";
import { clamp, Vector2 } from "../../utils/math";

interface ICanvas {
    workspaceRef: (c: HTMLDivElement)=> void 
    layersRef: (c: HTMLDivElement)=> void 
}

const Canvas: React.FC<ICanvas> = props=> {

    // const wrapperRef = createRef<HTMLDivElement>();
    const workspaceRef = createRef<HTMLDivElement>();
    const layersRef = createRef<HTMLDivElement>();

    useEffect(()=> {
        if (!workspaceRef.current || !layersRef.current) return;
        // props.workspaceRef(workspaceRef.current);
        // props.layersRef(layersRef.current);
        App.init(layersRef.current, workspaceRef.current);

        //
        // const wrapper = wrapperRef.current;
        const layers = layersRef.current;
        
        updateCanvasTransform();
        
        function onWheel(delta: Vector2, e: WheelEvent) {
            e.preventDefault();
            
            if (Keyboard.isCtrl && Keyboard.isShift) {
                return;
            }
            
            if (!Keyboard.isCtrl) {
                // Move pan
                App.pan.x += delta.x / App.zoom;
                if (Keyboard.isShift)
                    App.pan.x += delta.y / App.zoom;
                else
                    App.pan.y += delta.y / App.zoom;
                updateCanvasTransform();
                
                return;
            }
            // Zoom
            
            App.zoom -= delta.y / 1000 * App.zoom;
            
            const min = 1 / (App.canvasHeight / 32) - .025;
            const max = config.MAX_ZOOM;

            App.zoom = +clamp(App.zoom, min*2, max*2).toFixed(3);

            updateCanvasTransform();
        }
        function onMouseMove() {
            if (Mouse.button != 1 || !Mouse.isDown) return;
            
            App.pan.copy(App.pan.addNum(-Mouse.movement.x / App.zoom, -Mouse.movement.y / App.zoom));
            updateCanvasTransform();
        }
        function updateCanvasTransform() {
            layers.style.transform = `scale(${ App.zoom }) translate(calc(${ -App.pan.x }px), calc(${ -App.pan.y }px))`;
            // wrapper.style.transform = `scale(${ App.zoom })`;
        }
        
        const removeWheelListener = Mouse.onWheel(onWheel);
        const removeMoveListener = Mouse.onMove(onMouseMove, window);
        return ()=> {
            removeWheelListener();
            removeMoveListener();
        }
    }, [workspaceRef]);
    
    return (
        <div className="workspace" ref={ workspaceRef }>
            <div className="canvas-layers" ref={ layersRef } />
        </div>
    );
};

export default Canvas;