import React, { useEffect, useState } from "react";
import useStateListener from "../../src/hooks/useStateListener";
import { EditorStates } from "../../states/editor-states";

const Helper: React.FC = React.memo(()=> {
    const [helperText, helperTextState] = useStateListener(EditorStates.HelperText);
    const [isGhost, setIsGhost] = useState<boolean>(false);

    const className = ["helper", isGhost ? "ghost" : ""].join(" ");

    useEffect(()=> {
        
        // After 2 seconds go to ghost mode
        const toGhostTimer = setTimeout(()=> {
            setIsGhost(true);
        }, 2000);
        // After 20 seconds hide
        const hideTimer = setTimeout(()=> {
            helperTextState.value = "";
        }, 20000);

        return ()=> {
            setIsGhost(false);
            clearTimeout(toGhostTimer);
            clearTimeout(hideTimer);
        }
        
    }, [helperText]);

    function onDoubleClickHandler() {
        helperTextState.value = "";
    }
    
    return <>{ helperText &&
        <div 
            onDoubleClick={ onDoubleClickHandler }
            title="Double click to hide"
            className={ className }
            dangerouslySetInnerHTML={ { __html: helperText } }
        />
    }</>;
});

Helper.displayName = "Helper";
export default Helper;