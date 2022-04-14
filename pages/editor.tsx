import React, { createRef, useEffect } from "react";
import ContextMenu from "../components/context-menu/ContextMenu";
import Helper from "../components/editor/Helper";
import LayersPanel from "../components/editor/layers/layer-panel/LayersPanel";
import Menubar from "../components/editor/menubar/Menubar";
import ColorPickerPopover from "../components/editor/palette/ColorPickerPopover";
import PalettePanel from "../components/editor/palette/PalettePanel";
import Pipette from "../components/editor/palette/Pipette";
import Toolbar from "../components/editor/Toolbar";
import ToolSettings from "../components/editor/tools-settings/ToolSettings";
import ToolSettingsPopover from "../components/editor/tools-settings/ToolSettingsPopover";
import GridConfigWindow from "../components/editor/windows/view/GridConfigWindow";
import ExportImageWindow from "../components/editor/windows/export-window/ExportImageWindow";
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
import ArrayModifierWindow from "../components/ui/windows/modifiers/array/ArrayModifierWindow";
import DecayModifierWindow from "../components/ui/windows/modifiers/decay/DecayModifierWindow";
import StrokeModifierWindow from "../components/ui/windows/modifiers/stroke/StrokeModifierWindow";
import WelcomeWindow from "../components/ui/windows/WelcomeWindow";
import PaletteWindow from "../components/editor/windows/palette/PaletteWindow";
import EditorNotification from "../components/editor/notification/EditorNotification";

const Editor: React.FC = ()=> {
    
    const ref = createRef<HTMLDivElement>();
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
            
            // Move pan horizontal and vertical
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

            if (layersNode) {
                const bounds = layersNode.getBoundingClientRect();
                
                if (App.zoom < max*2 && App.zoom > min*2)
                App.pan.copy(App.pan.addNum(
                    (Mouse.screenPos.x - bounds.width/2 - bounds.left) * -delta.y / 1000,
                    (Mouse.screenPos.y - bounds.height/2 - bounds.top) * -delta.y / 1000,
                ));
            }

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
    useEffect(()=> {
        const unlistenName = ProjectWorker.Name.listen(name=> {
            if (name)
                document.title = `${ name } - Editor - Pixel share!`;
        });

        return ()=> unlistenName();
        
    }, []);

    function onWorkspaceContext(e: React.MouseEvent) {
        e.preventDefault();
        if (!EditorStates.IsDrawing.value)
            EditorTriggers.Window.trigger({ type: EditorWindowType.TOOL_SETTINGS_POPOVER });
    }

    return (
        <Page safeMissClick title="Editor" className="editor-page">

            <div ref={ ref } className="list" style={ { height: "100vh" } }>

                <div className="flex width-fill height-fill">
                    <Toolbar />
                    <div className="list width-fill height-fill">
                        <ToolSettings />
                        
                        <div className="flex width-fill height-fill">
                            {/* <FramesPanel /> */}
                            
                            <div 
                                className="workspace"
                                ref={ workspaceRef }
                                onContextMenu={ onWorkspaceContext }
                            >
                                <div className="canvas-layers" ref={ layersRef } />
                            </div>
                        </div>

                        <Helper />
                        <EditorNotification />
                    </div>

                    <PalettePanel />
                    <LayersPanel />
                    <Menubar />
                    
                </div>

                
            </div>
            <Pipette />

            {/* Windows goes here... (constrains is "ref") */}
            <ExportImageWindow constrainsRef={ ref } />
            <ResizeCanvasWindow constrainsRef={ ref } />
            <GridConfigWindow constrainsRef={ ref } />

            <StrokeModifierWindow constrainsRef={ ref } />
            <ArrayModifierWindow constrainsRef={ ref } />
            <DecayModifierWindow constrainsRef={ ref } />

            {/* Popovers goes here */}
            <ColorPickerPopover />
            <ToolSettingsPopover />
            
            {/* Full windows goes here */}
            <OpenProjectWindow />
            <SaveProjectWindow />
            <PaletteWindow />
            
            <ContextMenu />

            <WelcomeWindow />
            
        </Page>
    )
};

export default Editor;