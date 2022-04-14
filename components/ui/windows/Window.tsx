import { motion, useDragControls } from "framer-motion";
import React, { createRef, RefObject, useEffect, useState } from "react";
import Keyboard from "../../../editor/managers/Keyboard";
import createClassName from "../../../src/hooks/createClassName";
import useSafeState from "../../../src/hooks/useSafeState";
import { EditorTriggers, EditorWindowType, IEditorWindowTrigger } from "../../../states/editor-states";
import { MyComponent } from "../../../utils/types";
import Icon from "../../Icon";
import Button from "../buttons/Button";

export interface IWindow {
    trigger: EditorWindowType
    
    active?: boolean
    setActive?: (value: boolean)=> void
    title?: React.ReactElement

    onEnter?: ()=> void
    onEscape?: ()=> void
    onTrigger?: (action: IEditorWindowTrigger)=> void

    minWidth?: number
}
export interface IWindowNeeds {
    constrainsRef: RefObject<HTMLDivElement>
}

const Window: React.FC<IWindow & MyComponent & IWindowNeeds> = props=> {
    const ref = createRef<HTMLDivElement>();
    const dragControls = useDragControls();
    const [active, setActive] = useSafeState(false, props.active, props.setActive);
    
    const className = ["window-draggable-wrapper flex flex-column gap-1"].join(" ");
    
    useEffect(()=> {

        const unlistenWindow = EditorTriggers.Window.listen((action)=> {
            if (action.type != props.trigger) return;

            setActive(true);

            if (props.onTrigger)
                props.onTrigger(action);
        });
        const unlistenKeyboard = Keyboard.onKeyPress(e=> {
            if (!active) return;
            
            if (e.code == "Enter")
                props.onEnter && props.onEnter();
            if (e.code == "Escape") {
                props.onEscape ? props.onEscape() : setActive(false);
            }
        })

        return ()=> {
            unlistenWindow();
            unlistenKeyboard();
        };
        
    }, []);
    useEffect(()=> {
        const node = ref.current;
        if (!node) return;
        
        function onBlur() {
            if (!node) return;
            node.style.zIndex = "888";
        }
        function onFocus() {
            if (!node) return;
            node.style.zIndex = "899";
        }

        node.addEventListener("focus", onFocus);
        node.addEventListener("blur", onBlur);
        return ()=> {
            node?.removeEventListener("focus", onFocus)
            node?.removeEventListener("blur", onBlur)
        };
        
    }, [ref]);
    useEffect(()=> {
        if (!ref.current) return;

        if (active) {
            ref.current.focus();
        }
    }, [active, ref]);
    
    function onHeaderPointerDownHandler(e: React.PointerEvent) {
        dragControls.start(e);
    }
    function onCloseHandler() {
        setActive(false);
    }
    
    return active ? (
        <motion.div
            initial={ {
                left: 100,
                top: 100,
            } }
            drag
            dragMomentum={ false }
            dragListener={ false }
            dragControls={ dragControls }
            dragConstraints={ props.constrainsRef } 

            ref={ ref }
            className={ className }
            tabIndex={ 0 }
        >
            <motion.div 
                initial={ {
                    opacity: 0,
                    scale: .8,
                } }
                animate={ {
                    opacity: 1,
                    scale: 1,
                } }
                transition={ {
                    ease: "circOut",
                    duration: .2
                } }
                className={ createClassName(["window opacity-box", props.className]) }
                style={ {
                    minWidth: props.minWidth,
                    ...props.style
                } }
            >
                <header className="window-header slot justify-between" onPointerDown={ onHeaderPointerDownHandler }>
                    { props.title || <span></span> }
                    <Button 
                        style={{ transform: "translateX(8px)" }}
                        ghost
                        size="small"
                        onClick={ onCloseHandler }
                        icon="small-cross"
                    />
                </header>
                
                <main className="window-content">
                    { props.children }
                </main>
            </motion.div>
        </motion.div>
    ) : <></>;
};

export default Window;