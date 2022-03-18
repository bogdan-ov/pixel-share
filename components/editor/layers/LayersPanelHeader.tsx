import React from "react";
import { EditorEditedType, EditorTriggers, EditorWindowType } from "../../../states/editor-states";
import { MyComponent } from "../../../utils/types";
import TriggerNotice, { ITriggerNotice } from "../../ui/interactive/TriggerNotice";
import Button, { IButton } from "../../ui/buttons/Button";
import { HotkeysBuilder } from "../../ui/Misc";
import HistoryWorker from "../history/HistoryWorker";
import App from "../../../editor/App";
import ProjectWorker from "../../../editor/workers/ProjectWorker";

const LayersPanelHeader: React.FC = ()=> {

    function exportHandler() {
        EditorTriggers.Window.trigger({
            type: EditorWindowType.EXPORT_IMAGE,
        });
    }
    function undoHandler() {
        HistoryWorker.undo();
    }
    function projectSettingsHandler(e: React.MouseEvent) {
        EditorTriggers.ContextMenu.trigger({
            buttonsGroups: [[
                {
                    content: <span>Save</span>,
                    icon: "save",
                    actionName: "save-project"
                },
                {
                    content: <span>Save as...</span>,
                },
                {
                    content: <span>Open</span>,
                    icon: "open",
                    actionName: "open-project"
                },
                {
                    content: <span>Resize</span>,
                    handler: resizeProjectHandler
                },
            ]],
            event: e
        });
    }

    function resizeProjectHandler() {
        const sizePrompt = prompt("🔳 Canvas size (width*height):", `${ App.canvasWidth }*${ App.canvasHeight }`)
        if (!sizePrompt) {
            return;
        }
        const size = sizePrompt.toString().split("*");
        if (size.length != 2 || typeof (+size[0]) != "number" || typeof (+size[1]) != "number") {
            EditorTriggers.Notification.trigger({
                content: "😛 Incorrect syntax"
            })
            return;
        }

        ProjectWorker.resizeProjectCanvas(+size[0], +size[1]);
    }
    
    return (
        <header className="layers-panel-header p-2 slot justify-between">
            <div className="slot gap-2">
                <HeaderButton
                    triggerType="Edited"
                    trigger={ EditorEditedType.UNDO }
                    icon="undo"
                    ghost

                    tooltip={ <span>Undo</span> }
                    tooltipHotkeysName="undo"
                    onClick={ undoHandler }
                />
                <HeaderButton
                    icon="file"
                    tooltip={ <span>Project</span> }
                    onClick={ projectSettingsHandler }
                />
                <HeaderButton
                    triggerType="Window"
                    trigger={ EditorWindowType.EXPORT_IMAGE }
                    icon="file-export"
                    className="text-blue"

                    tooltip={ <span>Export!</span> }
                    tooltipHotkeysName="export-image-trigger"
                    tooltipColor="blue"
                    onClick={ exportHandler }
                />
            </div>
        </header>
    );
};

const HeaderButton: React.FC<IButton & ITriggerNotice & MyComponent> = props=> {
    return (
        <TriggerNotice 
            triggerType={ props.triggerType }
            trigger={ props.trigger }
        >
            <Button
                tooltipPlacement="bottom"
                tooltipOffset={ 10 }
            
                fab
                className="icon-muted"
                { ...props }
            />
        </TriggerNotice>
    );
};

LayersPanelHeader.displayName = "LayersPanelHeader";
export default LayersPanelHeader;