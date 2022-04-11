import React, { useState } from "react";
import FramesWorker from "../../../editor/workers/FramesWorker";
import LayersWorker from "../../../editor/workers/LayersWorker";
import useStateListener from "../../../src/hooks/useStateListener";
import Button from "../../ui/buttons/Button";
import Panel from "../../ui/panels/Panel";
import FrameComponent from "./FrameComponent";

const FramesPanel: React.FC = ()=> {
    function addFrameHandler() {
        FramesWorker.addFrame();
    }
    
    return (
        <Panel className="frames-panel">
            
            <main className="panel-content scrollable">
                <FramesList />
            </main>

            <footer className="panel-footer slot gap-1">
                <Button 
                    ghost
                    size="middle"
                    icon="add"
                    onClick={ addFrameHandler }
                />
            </footer>
        </Panel>
    );
};

const FramesList: React.FC = ()=> {
    const [frames] = useStateListener(FramesWorker.Frames);
    const [] = useStateListener(FramesWorker.CurrentFrameId);
    
    return (
        <div className="frames-list list gap-1">
            { frames.map((frame, index)=> 
                <FrameComponent 
                    key={ frame.id }
                    index={ index }
                    { ...frame }
                />
            ) }
        </div>
    );
};

FramesPanel.displayName = "FramesPanel";
export default FramesPanel;