import React, { createRef, useEffect } from "react";
import ContextMenu from "../components/context-menu/ContextMenu";
import Helper from "../components/editor/Helper";
import LayersPanel from "../components/editor/layers/LayersPanel";
import NotificationsList from "../components/editor/notification/Notification";
import ColorPickerPopover from "../components/editor/palette/ColorPickerPopover";
import PalettePanel from "../components/editor/palette/PalettePanel";
import Toolbar from "../components/editor/Toolbar";
import ToolSettings from "../components/editor/tools-settings/ToolSettings";
import ToolSettingsPopover from "../components/editor/tools-settings/ToolSettingsPopover";
import ExportImageWindow from "../components/editor/windows/export-window/ExportImageWindow";
import Page from "../components/Page";
import App from "../editor/App";
import Keyboard from "../editor/managers/Keyboard";
import Mouse from "../editor/managers/Mouse";
import ProjectWorker from "../editor/workers/ProjectWorker";
import { EditorStates, EditorTriggers, EditorWindowType } from "../states/editor-states";
import config from "../utils/config";
import { clamp, Vector2 } from "../utils/math";

const Editor: React.FC = ()=> {
    const workspaceRef = createRef<HTMLDivElement>();
    const layersRef = createRef<HTMLDivElement>();
    
    useEffect(()=> {
        if (!workspaceRef.current || !layersRef.current) return;

        App.init(layersRef.current, workspaceRef.current);
        
        updateCanvasTransform();
        
        function onWheel(delta: Vector2, e: WheelEvent) {
            e.preventDefault();
            
            if (Keyboard.isCtrl && Keyboard.isShift || Mouse.isDown) {
                return;
            }
            
            // Move pan
            if (!Keyboard.isCtrl) {
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
            if (layersRef.current)
                layersRef.current.style.transform = `scale(${ App.zoom }) translate(calc(${ -App.pan.x }px), calc(${ -App.pan.y }px))`;
        }
        
        const removeWheelListener = Mouse.onWheel(onWheel);
        const removeMoveListener = Mouse.onMove(onMouseMove, window);
        return ()=> {
            removeWheelListener();
            removeMoveListener();
        }
    }, [workspaceRef, layersRef]);
    useEffect(
        ProjectWorker.Name.listen(name=> {

            document.title = `${ name } - Editor - Pixel share!`;

        }),
    []);

    function onWorkspaceContext(e: React.MouseEvent) {
        e.preventDefault();
        if (!EditorStates.IsDrawing.value)
            EditorTriggers.Window.trigger({ type: EditorWindowType.TOOL_SETTINGS });
    }

    return (
        <Page title="Editor" className="editor-page">

            <div className="flex flex-column" style={ { height: "100vh" } }>

                <div className="flex width-fill height-fill">
                    <Toolbar />
                    <div className="flex flex-column width-fill height-fill">
                        <ToolSettings />
                        
                        {/* <div className="flex flex-column width-fill height-fill"> */}
                            <div 
                                className="workspace"
                                ref={ workspaceRef }
                                onContextMenu={ onWorkspaceContext }
                            >
                                <div className="canvas-layers" ref={ layersRef } />
                            </div>

                            {/* <AnimationTimeline /> */}
                        {/* </div> */}

                        <Helper />
                        <NotificationsList />
                    </div>
                    <PalettePanel />
                    <LayersPanel />
                </div>

                {/* Windows goes here... (constrains is "workspaceRef") */}
                <ExportImageWindow constrainsRef={ workspaceRef } />
                
            </div>

            {/* Popovers goes here */}
            <ColorPickerPopover />
            <ToolSettingsPopover />
            
            <ContextMenu />
        </Page>
    )
};

export default Editor;