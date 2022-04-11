import React from "react";
import ProjectWorker from "../../../editor/workers/ProjectWorker";
import ViewWorker from "../../../editor/workers/ViewWorker";
import useStateListener from "../../../src/hooks/useStateListener";
import { EditorTriggers, EditorWindowType } from "../../../states/editor-states";
import Button, { IButton } from "../../ui/buttons/Button";
import Checkbox from "../../ui/inputs/Checkbox";
import TriggerNotice, { ITriggerNotice } from "../../ui/interactive/TriggerNotice";
import Panel from "../../ui/panels/Panel";
import DropdownMenu, { IDropdownMenu } from "../../ui/windows/DropdownMenu";

interface IMenubarButton {
    header?: IDropdownMenu["header"]
    buttonsGroups?: IDropdownMenu["buttonsGroups"]
}

const Menubar: React.FC = React.memo(()=> {
    const [gridEnabled, enableGridState] = useStateListener(ViewWorker.GridEnabled);
    const [projectName] = useStateListener(ProjectWorker.Name);

    function resizeHandler() {
        EditorTriggers.Window.trigger({
            type: EditorWindowType.RESIZE_CANVAS_WINDOW,
        })
    }
    
    return (
        <Panel className="menubar-panel flex flex-column justify-between">

            <div className="flex flex-column gap-1">
                
                {/* // ? Project */}
                <MenubarButton
                    header={ <span className="text-muted p-1 ph-1">{ projectName || "<Untitled>" }</span> }
                    buttonsGroups={ [
                        [
                            {
                                icon: "save",
                                content: <span>Save <span className="text-muted">{ projectName }</span></span>,
                                actionName: "save-project-trigger"
                            },
                            {
                                icon: "open",
                                content: "Open",
                                actionName: "open-project-trigger"
                            },
                            {
                                content: "Save as...",
                                actionName: "save-project-as-trigger"
                            },
                        ],
                        [
                            {
                                icon: "file-export",
                                content: "Export!",
                                actionName: "export-image-trigger"
                            },
                        ],
                    ] }
                
                    tooltip={ <span>Project</span> }
                    icon="file"
                />

                {/* // ? Image */}
                <MenubarButton
                    buttonsGroups={ [[
                        {
                            content: "Resize",
                            handler: resizeHandler
                        },
                    ]] }
                
                    tooltip={ <span>Image</span> }
                    icon="image"
                />

                {/* // ? View */}
                <MenubarButton
                    buttonsGroups={ [[
                        {
                            content: "Toggle grid",
                            actionName: "toggle-grid",
                            icon: gridEnabled ? "checkbox" : undefined
                        },
                        {
                            content: "Grid configuration",
                            handler: ()=> {
                                EditorTriggers.Window.trigger({
                                    type: EditorWindowType.GRID_CONFIG_WINDOW
                                });
                            }
                        }
                    ]] }

                    tooltip={ <span>Grid</span> }
                    icon="grid"
                />

                {/* // ? Modifiers */}
                <MenubarButton
                    buttonsGroups={ [[
                        {
                            content: "Stroke",
                            actionName: "stroke-modifier-window-trigger"
                        },
                        {
                            content: "Array",
                            actionName: "array-modifier-window-trigger"
                        },
                        {
                            content: "Decay",
                            actionName: "decay-modifier-window-trigger"
                        },
                    ]] }

                    tooltip={ <span>Modifiers</span> }
                    icon="modification"
                />

            </div>
            
        </Panel>
    )
});

export const MenubarButton: React.FC<IButton & ITriggerNotice & IMenubarButton> = props=> {
    const btn = (
        <TriggerNotice
            triggerType={ props.triggerType }
            trigger={ props.trigger }
        >
            <Button
                tooltipPlacement="left"
                tooltipOffset={ 10 }
                
                type="fab"
                color="transparent"
                className="icon-muted text-muted"
                { ...props }
            />
        </TriggerNotice>
    )
    
    if (!props.buttonsGroups)
        return btn;
    
    return (
        <DropdownMenu 
            minWidth={ 240 }
            header={ props.header }
            buttonsGroups={ props.buttonsGroups || [] }
        >
            { btn }
        </DropdownMenu>
    );
};

Menubar.displayName = "Menubar";
export default Menubar;