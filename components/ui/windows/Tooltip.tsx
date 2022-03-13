import React, { createRef, ReactElement, useEffect } from "react";
import { MyComponent } from "../../../utils/types";

interface ITooltip {
    tooltip: ReactElement

    placement?: "right" | "left" | "top" | "bottom"
    delay?: number
    maxWidth?: number
    offset?: number
}

const Tooltip: React.FC<ITooltip & MyComponent> = props=> {
    const ref = createRef<HTMLDivElement>();
    
    const className = [
        "tooltip-wrapper",
        props.className || ""
    ].join(" ");
    
    useEffect(()=> {
        const node = ref.current;
        if (!node) return;
        
        const bounds = node.getBoundingClientRect();
        if (bounds.top < 20)
            node.style.marginTop = "20px";
        
    }, [ref]);

    const offset = `${ props.offset || 20 }px`;

    return (
        <div data-placement={ props.placement || "right" } className={ className } style={ props.style }>
            <div className="tooltip-children">{ props.children }</div>
            
            <div 
                className="tooltip"
                style={ {
                    maxWidth: props.maxWidth,
                    transitionDelay: (props.delay || .2) + "s",
                    // Hard to understand...
                    [(()=> {
                        switch (props.placement) {
                            case "right":
                                return "marginLeft";
                            case "left":
                                return "marginRight";
                            case "top":
                                return "marginBottom";
                            case "bottom":
                                return "marginTop";
                            default:
                                return "marginLeft"
                        }
                    })()]: offset
                } }
                ref={ ref }
            >{ props.tooltip }</div>
        </div>
    );
};

export default Tooltip;