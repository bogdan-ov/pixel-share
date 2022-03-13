import React, { useState } from "react";
import App from "../../../editor/App";
import useStateListener from "../../../src/hooks/useStateListener";
import { EditorWindowType } from "../../../states/editor-states";
import Icon from "../../Icon";
import Popover, { PopoverHeader } from "../../ui/windows/Popover";
import { Settings } from "./ToolSettings";

const ToolSettingsPopover: React.FC = ()=> {
    const [active, setActive] = useState<boolean>(false);  
    
    const [currentToolType] = useStateListener(App.CurrentToolType, "tool-settings-popover-current-tool-type");
    
    return (
        <Popover
            custom
            active={ active }
            setActive={ setActive }
            offset={ 5 }
            openTrigger={ EditorWindowType.TOOL_SETTINGS }
            className="tool-settings-popover flex flex-column gap-3 p-2"
            disableContextMenu
        >
            <PopoverHeader
                closeButton
                setActive={ setActive }
                className="pb-1"
            >
                <div className="slot gap-2">
                    <Icon icon={ App.getToolNames().icon as any } />
                    <span className="text-muted">{ App.getToolNames().name }</span>
                </div>
            </PopoverHeader>

            <Settings 
                currentToolType={ currentToolType }
                empty={ <i className="text-muted">No properties yet...</i> }
            />
            
        </Popover>
    );
};

export default ToolSettingsPopover;