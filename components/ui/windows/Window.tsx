import { motion, useDragControls } from "framer-motion";
import React, { createRef, RefObject, useEffect, useState } from "react";
import Mouse from "../../../editor/managers/Mouse";
import createClassName from "../../../src/hooks/createClassName";
import { EditorTriggers, EditorWindowType, IEditorWindowTrigger } from "../../../states/editor-states";
import { vec, Vector2 } from "../../../utils/math";
import { MyComponent } from "../../../utils/types";
import Icon from "../../Icon";

export interface IWindow {
    trigger: EditorWindowType
    constrainsRef: RefObject<HTMLDivElement>
    
    custom?: boolean
    active?: boolean
    setActive?: (value: boolean)=> void
    title?: React.ReactElement
    onTrigger?: (action: IEditorWindowTrigger)=> void

    minWidth?: number
}

const Window: React.FC<IWindow & MyComponent> = props=> {
    const ref = createRef<HTMLDivElement>();
    const dragControls = useDragControls();
    const [active, setActive] = useState<boolean>(false);

    const _active = props.custom ? props.active! : active;
    const _setActive = props.custom ? props.setActive! : setActive;
    
    const className = ["window-draggable-wrapper flex flex-column gap-1"].join(" ");
    
    useEffect(()=> {

        const unlisten = EditorTriggers.Window.listen((action)=> {
            if (action.type != props.trigger) return;

            _setActive(true);

            if (props.onTrigger)
                props.onTrigger(action);
        });

        return unlisten;
        
    }, []);
    // useEffect(()=> {
    //     const node = ref.current;
    //     const constrainsNode = props.constrainsRef.current;
    //     if (!node || !constrainsNode) return;

    //     const bounds = node.getBoundingClientRect();
    //     const constrainsBounds = constrainsNode.getBoundingClientRect();
    //     node.style.left = (constrainsBounds.left + constrainsBounds.width/2 - bounds.width/2) + "px";
    //     node.style.top = (constrainsBounds.top + constrainsBounds.height/2 - bounds.height/2) + "px";
    //     setPos(vec(
    //         constrainsBounds.left + constrainsBounds.width/2 - bounds.width/2,
    //         constrainsBounds.top + constrainsBounds.height/2 - bounds.height/2
    //     ))
        
    // }, [_active]);
    
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
                    { props.title }
                    <button className="button ghost small" onClick={ onCloseHandler }><Icon icon="small-cross" /></button>
                </header>
                
                <main className="window-content">
                    { props.children }
                </main>
            </motion.div>
        </motion.div>
    ) : <></>;
};

export default Window;