import React, { createRef, ReactElement, useEffect } from "react";
import createClassName from "../../../src/hooks/createClassName";
import { vec } from "../../../utils/math";
import { MyComponent } from "../../../utils/types";
import { safeValue } from "../../../utils/utils";
import { HotkeysBuilder } from "../Misc";

export interface ITooltip {
    tooltip: ReactElement

    color?: "blue"
    placement?: "right" | "left" | "top" | "bottom"
    delay?: number
    offset?: number
    maxWidth?: number
    minWidth?: number
    hotkeysName?: string

    childrenClassName?: string
}

const Tooltip: React.FC<ITooltip & MyComponent> = props=> {
    const ref = createRef<HTMLDivElement>();
    const wrapperRef = createRef<HTMLDivElement>();
    
    const wrapperClassName = createClassName([
        "tooltip-wrapper",
        props.className
    ]);
    const className = createClassName([
        "tooltip",
        props.color && `color-${ props.color }`
    ]);
    const placement = props.placement || "right";
    
    function onPointerOverHandler() {
        const node = ref.current;
        const wrapperNode = wrapperRef.current;
        if (!node || !wrapperNode) return;
        
        const bounds = node.getBoundingClientRect();
        const wrapperBounds = wrapperNode.getBoundingClientRect();
        
        const offset = props.offset || 20;
        const isRight = placement == "right";
        const isLeft = placement == "left";
        const isTop = placement == "top";
        const isBottom = placement == "bottom";
        const isHor = isRight || isLeft;
        const isVer = isTop || isBottom;

        const center = vec(
            wrapperBounds.width/2 - bounds.width/2,
            wrapperBounds.height/2 - bounds.height/2
        );
        const offsetPos = vec(
            isHor ? (isRight ? offset : -offset) : 0,
            isVer ? (isBottom ? offset : -offset) : 0,
        );
        const pos = vec(
            (!isVer ? (isLeft ? wrapperBounds.left : wrapperBounds.right) : wrapperBounds.left) + (isVer ? center.x : 0) + offsetPos.x,
            (!isHor ? (isTop ? wrapperBounds.top : wrapperBounds.bottom) : wrapperBounds.top) + (isHor ? center.y : 0) + offsetPos.y,
        ).clamp(
            vec(!isRight ? 10 : -Infinity, !isBottom ? 10 : -Infinity),
            vec(!isLeft ? (innerWidth - bounds.width - 10) : Infinity, !isTop ? innerHeight - bounds.height - 10 : Infinity)
        );
        
        node.style.left = (pos.x - wrapperBounds.left) + "px";
        node.style.top = (pos.y - wrapperBounds.top) + "px";
    }

    return (
        <div
            ref={ wrapperRef }
            onPointerOver={ onPointerOverHandler }
            data-placement={ placement }
            className={ wrapperClassName }
            style={ props.style }
        >
            <div className={ createClassName(["tooltip-children", props.childrenClassName]) }>{ props.children }</div>
            
            <div className="tooltip-pos" ref={ ref }>
                <div 
                    className={ className }
                    style={ {
                        maxWidth: props.maxWidth,
                        minWidth: props.minWidth,
                        transitionDelay: safeValue(props.delay, .2) + "s",
                    } }
                >
                    <div className="slot gap-2">
                        { props.tooltip }
                        { props.hotkeysName && <span className="text-muted"><HotkeysBuilder justText variants={ props.hotkeysName } /></span> }
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Tooltip;