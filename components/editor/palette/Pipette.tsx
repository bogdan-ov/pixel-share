import React, { createRef, useEffect, useState } from "react";
import useStateListener from "../../../src/hooks/useStateListener";
import { EditorStates } from "../../../states/editor-states";

const Pipette: React.FC = ()=> {
    const ref = createRef<HTMLDivElement>();
    const [color] = useStateListener(EditorStates.PipetteColor);

    useEffect(()=> {

        function onPointerMove(e: PointerEvent) {
            const node = ref.current;
            if (!node) return;

            node.style.left = e.clientX + "px";
            node.style.top = e.clientY + "px";
            
        }
        
        window.addEventListener("pointermove", onPointerMove);
        return ()=> window.removeEventListener("pointermove", onPointerMove);

    }, [ref]);
    // useEffect(()=> {

    //     function onPointerMove(e: PointerEvent) {
    //         setPosX(e.clientX);
    //         setPosY(e.clientY);
    //     }
        
    //     window.addEventListener("pointermove", onPointerMove);
    //     return ()=> window.removeEventListener("pointermove", onPointerMove);

    // }, []);
    
    return (
        <div
            ref={ ref }
            style={ {
                visibility: color ? "visible" : "hidden",
                borderColor: color || undefined
            } }
            className={ "pipette "}
        ></div>
    );
};

Pipette.displayName = "Pipette";
export default Pipette;