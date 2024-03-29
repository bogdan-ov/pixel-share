import React, { createRef, useEffect, useState } from "react";
import Keyboard from "../../../editor/managers/Keyboard";
import Mouse from "../../../editor/managers/Mouse";
import createClassName from "../../../src/hooks/createClassName";
import { EditorTriggers, EditorWindowType } from "../../../states/editor-states";
import { vec } from "../../../utils/math";
import { MyComponent } from "../../../utils/types";
import Icon from "../../Icon";
import Button from "../buttons/Button";
import ClickOutside from "../utils/ClickOutside";

interface IPopover {
    custom?: boolean
    active?: boolean
    setActive?: (value: boolean)=> void
    offset?: number
    
    trigger: EditorWindowType
    onActive?: (action: any)=> void
    onClose?: ()=> void
    onPointerUp?: ()=> void

    disableContextMenu?: boolean
}
interface IPopoverHeader {
    closeButton?: boolean
    setActive?: (value: boolean)=> void
}

const Popover: React.FC<IPopover & MyComponent> = props=> {
    const ref = createRef<HTMLDivElement>();
    const [active, setActive] = useState<boolean>(false);

    const _active = props.custom ? props.active! : active;
    const _setActive = props.custom ? props.setActive! : setActive;
     
    const wrapperClassName = ["popover-wrapper", _active ? "active" : ""].join(" ");
    const contentClassName = ["popover-content", props.className || ""].join(" ");
    
    useEffect(()=> {

        const unlisten = EditorTriggers.Window.listen(action=> {
            if (action.type != props.trigger) return;

            const node = ref.current;
            const targetNode = action.targetRef?.current;
            if (!node) return;

            const bounds = node.getBoundingClientRect();
            const targetBounds = targetNode ? targetNode.getBoundingClientRect() : null;
            const left = targetBounds?.left || 0;
            const right = targetBounds?.right || Mouse.screenPos.x;
            const top = targetBounds?.top || Mouse.screenPos.y;
            
            // Target is in right side of the screen
            const targetInRight = targetNode ? innerWidth / 2 < left : false;

            const pos = vec(
                targetInRight ? left - bounds.width : right,
                top - (targetBounds?.height || 0)/2
            ).clamp(vec(0, 0), vec(innerWidth - bounds.width, innerHeight - bounds.height));
            
            node.style.left = `${ pos.x }px`;
            node.style.top = `${ pos.y }px`;

            _setActive(true);

            if (props.onActive)
                props.onActive(action);
            
        });

        return unlisten;
        
    }, [ref]);
    useEffect(()=> {
        return Keyboard.onEscape(()=> {
            if (_active) {
                _setActive(false);
                props.onClose && props.onClose();
            }
        });
    }, []);
    
    return (
        <ClickOutside 
            onClickOutside={ ()=> {
                if (_active)
                    props.onClose && props.onClose()
                _setActive(false);
            } }
            className={ wrapperClassName }
            style={ { padding: `${ props.offset || 20 }px` } }
            ref={ ref }
        >
            <div 
                onPointerUp={ props.onPointerUp }
                onContextMenu={ props.disableContextMenu ? e=> e.preventDefault() : undefined }
                className="popover opacity-box p-2"
            >
                <main className={ contentClassName } style={ props.style }>{ props.children }</main>
            </div>
        </ClickOutside>
    );
};

export const PopoverHeader: React.FC<IPopoverHeader & MyComponent> = props=> {
    const className = createClassName([
        "popover-header slot justify-between"
    ]);
    
    return (
        <header className={ className } style={ props.style }>
            { props.children }

            { props.closeButton && 
                <Button
                    onClick={ ()=> props.setActive && props.setActive(false) }
                    size="small"
                    ghost
                    style={ {
                        left: 6
                    } }
                >
                    <Icon icon="small-cross" />
                </Button>
            }

        </header>
    );
};

export default Popover;