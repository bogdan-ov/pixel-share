import { motion, useDragControls } from "framer-motion";
import React, { createRef, RefObject, useEffect, useState } from "react";
import Keyboard from "../../../editor/managers/Keyboard";
import createClassName from "../../../src/hooks/createClassName";
import { EditorTriggers, EditorWindowType, IEditorWindowTrigger } from "../../../states/editor-states";
import { MyComponent } from "../../../utils/types";
import Icon from "../../Icon";

export interface IWindow {
    trigger: EditorWindowType
    
    custom?: boolean
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
    const [active, setActive] = useState<boolean>(false);

    const _active = props.custom ? props.active! : active;
    const _setActive = props.custom ? props.setActive! : setActive;
    
    const className = ["window-draggable-wrapper flex flex-column gap-1"].join(" ");
    
    useEffect(()=> {

        const unlistenWindow = EditorTriggers.Window.listen((action)=> {
            if (action.type != props.trigger) return;

            _setActive(true);

            if (props.onTrigger)
                props.onTrigger(action);
        });
        const unlistenKeyboard = Keyboard.onKeyPress(e=> {
            if (!_active) return;
            
            if (e.code == "Enter")
                props.onEnter && props.onEnter();
            if (e.code == "Escape") {
                props.onEscape ? props.onEscape() : _setActive(false);
            }
        })

        return ()=> {
            unlistenWindow();
            unlistenKeyboard();
        };
        
    }, []);
    
    function onHeaderPointerDownHandler(e: React.PointerEvent) {
        dragControls.start(e);
    }
    function onCloseHandler() {
        _setActive(false);
    }
    
    return _active ? (
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
                    <button 
                        style={{ transform: "translateX(8px)" }}
                        className="button ghost small"
                        onClick={ onCloseHandler }
                    ><Icon icon="small-cross" /></button>
                </header>
                
                <main className="window-content">
                    { props.children }
                </main>
            </motion.div>
        </motion.div>
    ) : <></>;
};

export default Window;