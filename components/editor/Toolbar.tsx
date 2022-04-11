import React from "react";
import App from "../../editor/App";
import { ToolType } from "../../editor/tools";
import createClassName from "../../src/hooks/createClassName";
import { useJustStatesListener } from "../../src/hooks/useStateListener";
import Icon from "../Icon";
import Button from "../ui/buttons/Button";
import { HotkeysBuilder, Key } from "../ui/Misc";
import Tooltip from "../ui/windows/Tooltip";
import Image from "next/image";

const Toolbar: React.FC = ()=> {

    useJustStatesListener([App.CurrentToolType], "toolbar-just");
    
    const toolsKeys = Object.keys(ToolType).filter(key=> !(+key >= 0)) as (keyof typeof ToolType)[]
    return (
        <div className="toolbar panel flex flex-column justify-between gap-2 show-on-hover-trigger">

            <div className="toolbar-tools auto-borders">
                { toolsKeys.map(key=>
                    <Tool
                        type={ ToolType[key] }
                        key={ key }
                    />
                ) }
            </div>

            <div className="list items-center pb-1">
                <a href="https://vk.com/bbog908" target="_blank" rel="noreferrer" className="link">
                    <Button
                        tooltip={ <span>Bogdanov made it! :D<br /><i className="text-muted">бигбоб</i></span> }
                        tooltipColor="blue"
                    
                        type="fab"
                        ghost
                        style={ { fontSize: 16 } }
                        className="show-on-hover fw-500 text-muted mb-2"
                    >:D</Button>
                </a>
                <div className="logo small">
                    <Image alt="Logo" src="/img/logo.png" layout="fill" objectFit="cover" />
                </div>
            </div>

        </div>
    );
};

const Tool: React.FC<{ type: ToolType }> = props=> {
    const active = props.type == App.CurrentToolType.value;
    const className = createClassName([
        "button toolbar-tool static color-transparent",
        active && "active"
    ]);

    function onClickHandler() {
        App.CurrentToolType.value = props.type;
    }
    
    const shapeTool = <>
        <ToolTooltipKey keys={ ["Shift"] }>aspect ratio</ToolTooltipKey>
        <ToolTooltipKey keys={ ["Ctrl"] }>draw from center</ToolTooltipKey>
    </>
    const tooltips = {
        // Pen
        [ToolType.PEN]: <>
            <ToolTooltipKey keys={ ["Shift"] }>to draw line</ToolTooltipKey>
            <ToolTooltipKey keys={ ["Ctrl", "Shift", "Wheel"] }>resize tool!</ToolTooltipKey>
        </>,
        [ToolType.CHECKERBOARD]: <></>,
        [ToolType.ERASE]: <>
            <ToolTooltipKey keys={ ["Shift"] }>to draw line</ToolTooltipKey>
        </>,
        // Selection
        [ToolType.SELECTION]: <>
            <ToolTooltipKey keys={ ["Shift"] }>to move selection</ToolTooltipKey>
            <ToolTooltipKey keys={ ["Ctrl", "C"] }>copy selection image data</ToolTooltipKey>
            <ToolTooltipKey keys={ ["Ctrl", "V"] }>pate image data</ToolTooltipKey>
        </>,
        // Fill
        [ToolType.FILL]: <>
            <i className="text-muted">Who drew this icon?</i>
            <ToolTooltipKey keys={ ["Shift"] }>to fill all selection</ToolTooltipKey>
            <ToolTooltipKey keys={ ["Alt"] }>fill same colors<br />(don{"'"}t work on some browsers)</ToolTooltipKey>
        </>,
        
        [ToolType.ELLIPSE]: <>{ shapeTool }</>,
        [ToolType.LINE]: <>{ shapeTool }</>,
        [ToolType.RECTANGLE]: <>{ shapeTool }</>,
    }
    
    const tooltip = ()=> (
        <div className="flex flex-column gap-2">

            <div className="slot gap-3 justify-between">
                <span>{ App.getToolNames(props.type).name }</span>
                <div className="slot gap-1">
                    <HotkeysBuilder variants={ `${ ToolType[props.type].toLowerCase() }-switch` } />
                </div>
            </div>
            
            <div className="flex flex-column gap-1">
                { tooltips[props.type] }
            </div>
        </div>
    )
    
    return (
        <Tooltip
            color={ active ? "blue" : undefined }
            delay={ 0 }
            tooltip={ tooltip() }
        >
            <button className={ className } onClick={ onClickHandler }>
                { <Icon icon={ App.getToolNames(props.type).icon as any } /> }
            </button>
        </Tooltip>
    );
};

const ToolTooltipKey: React.FC<{ keys: string[] }> = props=> {
    return (
        <span>
            <Key className="mr-1" keys={ props.keys } />
            <span>{ props.children }</span>
        </span>
    );
};

export default Toolbar;