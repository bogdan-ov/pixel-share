import React, { createRef, useEffect } from "react";
import ContextMenu from "../components/context-menu/ContextMenu";
import Helper from "../components/editor/Helper";
import LayersPanel from "../components/editor/layers/layer-panel/LayersPanel";
import Menubar from "../components/editor/menubar/Menubar";
import NotificationsList from "../components/editor/notification/Notification";
import ColorPickerPopover from "../components/editor/palette/ColorPickerPopover";
import PalettePanel from "../components/editor/palette/PalettePanel";
import Pipette from "../components/editor/palette/Pipette";
import Toolbar from "../components/editor/Toolbar";
import ToolSettings from "../components/editor/tools-settings/ToolSettings";
import ToolSettingsPopover from "../components/editor/tools-settings/ToolSettingsPopover";
import GridConfigWindow from "../components/editor/windows/view/GridConfigWindow";
import ExportImageWindow from "../components/editor/windows/export-window/ExportImageWindow";
import BrowseProjectsWindow from "../components/editor/windows/projects-window/BrowseProjectsWindow";
import OpenProjectWindow from "../components/editor/windows/projects-window/OpenProjectWindow";
import SaveProjectWindow from "../components/editor/windows/projects-window/SaveProjectWindow";
import ResizeCanvasWindow from "../components/editor/windows/resize-canvas-window/ResizeCanvasWindow";
import Page from "../components/Page";
import App from "../editor/App";
import Keyboard from "../editor/managers/Keyboard";
import Mouse from "../editor/managers/Mouse";
import PaletteWorker from "../editor/workers/PaletteWorker";
import ProjectWorker from "../editor/workers/ProjectWorker";
import { EditorStates, EditorTriggers, EditorWindowType } from "../states/editor-states";
import config from "../utils/config";
import { clamp, Vector2 } from "../utils/math";

const Editor: React.FC = ()=> {
    const workspaceRef = createRef<HTMLDivElement>();
    const layersRef = createRef<HTMLDivElement>();
    
    useEffect(()=> {
        const layersNode = layersRef.current;
        const workspaceNode = workspaceRef.current;
        if (!workspaceNode || !layersNode) return;

        App.init(layersNode, workspaceNode);
        
        updateCanvasTransform();
        
        function onWheel(delta: Vector2, e: WheelEvent) {
            e.preventDefault();
            
            // Change color on mouse wheel
            if (Keyboard.keysPressed["keyz"]) {
                const curIndex = PaletteWorker.Palette.value.findIndex(c=> c.id == PaletteWorker.CurrentPaletteColorId.value);

                let nextIndex = curIndex + (delta.y > 0 ? 1 : -1);
                if (nextIndex >= PaletteWorker.Palette.value.length)
                    nextIndex = 0;
                else if (nextIndex < 0)
                    nextIndex = PaletteWorker.Palette.value.length-1;
                    
                PaletteWorker.CurrentPaletteColorId.value = PaletteWorker.Palette.value[nextIndex].id;
                
                return;
            }
            
            // Return if resize tool
            if (Keyboard.isCtrl && Keyboard.isShift || Mouse.isDown) {
                return;
            }
            
            // Move pan
            if (!Keyboard.isCtrl) {
                App.pan.x += delta.x;
                if (Keyboard.isShift)
                    App.pan.x += delta.y;
                else
                    App.pan.y += delta.y;
                updateCanvasTransform();
                
                return;
            }
            // Zoom
            
            App.zoom -= delta.y / 1000 * App.zoom;
            
            const min = 1 / (App.CanvasHeight.value / 32) - .025;
            const max = config.MAX_ZOOM;

            App.zoom = +clamp(App.zoom, min*2, max*2).toFixed(3);

            updateCanvasTransform();
        }
        function onMouseMove() {
            // Move pan
            if (Mouse.button != 1 || !Mouse.isDown) return;
            
            App.pan.copy(App.pan.addNum(-Mouse.movement.x, -Mouse.movement.y));
            updateCanvasTransform();
        }
        function updateCanvasTransform() {
            if (layersRef.current)
                layersRef.current.style.transform = `translate(calc(${ -App.pan.x }px), calc(${ -App.pan.y }px)) scale(${ App.zoom })`;
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
            if (name)
                document.title = `${ name } - Editor - Pixel share!`;
        }),
    []);

    function onWorkspaceContext(e: React.MouseEvent) {
        e.preventDefault();
        if (!EditorStates.IsDrawing.value)
            EditorTriggers.Window.trigger({ type: EditorWindowType.TOOL_SETTINGS_POPOVER });
    }

    return (
        <Page safeMissClick title="Editor" className="editor-page">

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
                    <Menubar />
                    
                </div>

                {/* Windows goes here... (constrains is "workspaceRef") */}
                <ExportImageWindow constrainsRef={ workspaceRef } />
                <ResizeCanvasWindow constrainsRef={ workspaceRef } />
                <GridConfigWindow constrainsRef={ workspaceRef } />
                
            </div>
            <Pipette />

            {/* Popovers goes here */}
            <ColorPickerPopover />
            <ToolSettingsPopover />
            
            {/* Full windows goes here */}
            <OpenProjectWindow />
            <SaveProjectWindow />
            
            <ContextMenu />
        </Page>
    )
};

export default Editor;