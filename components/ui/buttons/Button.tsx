import React from "react";
import createClassName from "../../../src/hooks/createClassName";
import { MyComponent } from "../../../utils/types";
import Icon, { icons } from "../../Icon";
import Tooltip, { ITooltip } from "../windows/Tooltip";

export type IButton = {
    btnType?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"]
    color?: "transparent" | "blue" | "red"
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

    icon?: keyof typeof icons | (true & {})
    text?: string
}  & MyComponent

const Button: React.FC<IButton> = props=> {
    const className = createClassName([
        "button",
        props.color && `color-${ props.color }`,
        props.size && props.size,
        props.ghost && "ghost",
        props.fab && "fab",
        props.className
    ]);
    
    function onClickHandler(e: React.MouseEvent) {
        props.onClick && props.onClick(e);
    }
    
    const btn = (
        <button 
            type={ props.btnType || "button" }
            title={ props.title }
            disabled={ props.disabled }
            onClick={ onClickHandler }
            className={ className }
            style={ props.style }
        >
            { props.icon && <div className="icon-wrapper">
                { props.icon !== true && <Icon icon={ props.icon } /> }
            </div> }
            { props.children || props.text }
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