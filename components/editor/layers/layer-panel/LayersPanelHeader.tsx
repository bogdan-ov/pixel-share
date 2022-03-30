import React from "react";
import { EditorEditedType, EditorTriggers, EditorWindowType } from "../../../../states/editor-states";
import { MyComponent } from "../../../../utils/types";
import TriggerNotice, { ITriggerNotice } from "../../../ui/interactive/TriggerNotice";
import Button, { IButton } from "../../../ui/buttons/Button";
import HistoryWorker from "../../history/HistoryWorker";
import App from "../../../../editor/App";
import ProjectWorker from "../../../../editor/workers/ProjectWorker";
import { MenubarButton } from "../../menubar/Menubar";
import useStateListener from "../../../../src/hooks/useStateListener";

const LayersPanelHeader: React.FC = ()=> {
    const [historyPast] = useStateListener(HistoryWorker.Past);
    const [historyFuture] = useStateListener(HistoryWorker.Future);
    const [projectName] = useStateListener(ProjectWorker.Name);
    const [saved] = useStateListener(ProjectWorker.Saved);
    
    function undoHandler() {
        HistoryWorker.undo();
    }
    function redoHandler() {
        HistoryWorker.redo();
    }
    
    return (
        <header className="layers-panel-header p-2 slot justify-between">
            <div className="slot">
                <MenubarButton
                    triggerType="Edited"
                    trigger={ EditorEditedType.UNDO }
                    icon="undo"
                    ghost

                    tooltip={ <span>Undo</span> }
                    tooltipHotkeysName="undo"
                    onClick={ undoHandler }

                    disabled={ historyPast.length <= 0 }
                />
                <MenubarButton
                    triggerType="Edited"
                    trigger={ EditorEditedType.REDO }
                    icon="redo"
                    ghost

                    tooltip={ <span>Redo</span> }
                    tooltipHotkeysName="redo"
                    onClick={ redoHandler }

                    disabled={ historyFuture.length <= 0 }
                />
            </div>

            <span className="pr-2 text-muted" title={ `${ saved ? "" : "(Unsaved) " }${ projectName || "<Untitled>" }` }>
                { !saved ? <>&bull;</> : "" } { projectName || "<Untitled>" }
            </span>
            
        </header>
    );
};

LayersPanelHeader.displayName = "LayersPanelHeader";
export default LayersPanelHeader;