import React from "react";
import { EditorEditedType } from "../../../../states/editor-states";
import HistoryWorker from "../../history/HistoryWorker";
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

                    tooltip={ <span>Undo <span className="text-muted">({ historyPast.length })</span></span> }
                    tooltipHotkeysName="undo"
                    tooltipPlacement="bottom"
                    onClick={ undoHandler }

                    disabled={ historyPast.length <= 0 }
                />
                <MenubarButton
                    triggerType="Edited"
                    trigger={ EditorEditedType.REDO }
                    icon="redo"
                    ghost

                    tooltip={ <span>Redo <span className="text-muted">({ historyFuture.length })</span></span> }
                    tooltipHotkeysName="redo"
                    tooltipPlacement="bottom"
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