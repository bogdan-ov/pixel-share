import React from "react";
import createClassName from "../../../src/hooks/createClassName";
import { MyComponent } from "../../../utils/types";
import Icon, { icons } from "../../Icon";
import Tooltip, { ITooltip } from "../windows/Tooltip";

export interface IButton {
    color?: "transparent" | "blue"
    size?: "small" | "middle"
    fab?: boolean
    ghost?: boolean
    
    tooltip?: ITooltip["tooltip"]
    tooltipDelay?: ITooltip["delay"]
    tooltipOffset?: ITooltip["offset"]
    tooltipPlacement?: ITooltip["placement"]
    tooltipMaxWidth?: ITooltip["maxWidth"]
    tooltipMinWidth?: ITooltip["minWidth"]
    tooltipColor?: ITooltip["color"]
    tooltipHotkeysName?: ITooltip["hotkeysName"]
    
    disabled?: boolean
    title?: string
    
    onClick?: (e: React.MouseEvent)=> void

    icon?: keyof typeof icons 
}

const Button: React.FC<IButton & MyComponent> = props=> {
    const className = createClassName([
        "button",
        props.color && `color-${ props.color }`,
        props.size && props.size,
        props.ghost && "ghost",
        props.fab && "fab",
        props.className
    ]);
    
    const btn = (
        <button 
            title={ props.title }
            disabled={ props.disabled }
            onClick={ props.onClick }
            className={ className }
            style={ props.style }
        >
            { props.icon ? <Icon icon={ props.icon } /> : props.children }
        </button>
    )
    
    if (props.tooltip)
        return (
            <Tooltip
                tooltip={ props.tooltip }
                delay={ props.tooltipDelay }
                offset={ props.tooltipOffset }
                placement={ props.tooltipPlacement }
                maxWidth={ props.tooltipMaxWidth }
                minWidth={ props.tooltipMinWidth }
                color={ props.tooltipColor }
                hotkeysName={ props.tooltipHotkeysName }
            >
                { btn }
            </Tooltip>
        );

    return btn;
};

Button.displayName = "Button";
export default Button;