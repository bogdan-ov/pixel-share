import React from "react";
import App from "../../editor/App";
import { ToolType } from "../../editor/tools";
import HotkeysWorker from "../../editor/workers/HotkeysWorker";
import { useJustStatesListener } from "../../src/hooks/useStateListener";
import { capitalize } from "../../utils/utils";
import Icon from "../Icon";
import { HotkeysBuilder, Key } from "../ui/Misc";
import Tooltip from "../ui/windows/Tooltip";

const Toolbar: React.FC = ()=> {

    useJustStatesListener([App.CurrentToolType], "toolbar-just");
    
    const toolsKeys = Object.keys(ToolType).filter(key=> !(+key >= 0)) as (keyof typeof ToolType)[]
    return (
        <div className="toolbar panel flex flex-column gap-2">

            <div className="toolbar-tools auto-borders">
                { toolsKeys.map(key=>
                    <Tool
                        type={ ToolType[key] }
                        key={ key }
                    />
                ) }
            </div>

        </div>
    );
};

const Tool: React.FC<{ type: ToolType }> = props=> {
    const className = [
        "button toolbar-tool static color-transparent",
        props.type == App.CurrentToolType.value ? "active" : ""
    ].join(" ");

    function onClickHandler() {
        App.CurrentToolType.value = props.type;
    }
    
    const tooltips = {
        [ToolType.PEN]: <div className="flex flex-column">
            <span>
                <Key className="mr-1" keys={ ["SHIFT"] } />
                <span>to draw line</span>
            </span>
        </div>,
        [ToolType.CHECKERBOARD]: <></>,
        [ToolType.ERASE]: <></>,
        [ToolType.SELECTION]: <div className="flex flex-column gap-2">
            <span>
                <Key className="mr-1" keys={ ["Shift"] } />
                <span>to move selection</span>
            </span>
        </div>,
        [ToolType.FILL]: <div className="flex flex-column">
            <i className="text-muted">Who drew this icon?</i>
        </div>,
        [ToolType.LINE]: <></>,
        [ToolType.RECTANGLE]: <></>,
    }
    
    const tooltip = ()=> (
        <div className="flex flex-column gap-2">

            <div className="slot gap-3 justify-between">
                <span>{ App.getToolNames(props.type).name }</span>
                <div className="slot gap-1">
                    <HotkeysBuilder variants={ `${ ToolType[props.type].toLowerCase() }-switch` } />
                </div>
            </div>
            
            { tooltips[props.type] }
        </div>
    )
    
    return (
        <Tooltip
            delay={ .2 }
            tooltip={ tooltip() }
        >
            <button className={ className } onClick={ onClickHandler }>
                { <Icon icon={ App.getToolNames(props.type).icon as any } /> }
            </button>
        </Tooltip>
    );
};

export default Toolbar;