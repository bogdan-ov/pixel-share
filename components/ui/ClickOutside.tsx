import React, { createRef, useEffect, useMemo, useState } from "react";
import { MyComponent } from "../../utils/types";

interface IClickOutside {
    onClickOutside?: ()=> void
    // allow?: boolean
}

const ClickOutside = React.forwardRef<HTMLDivElement, React.PropsWithChildren<IClickOutside & MyComponent>>((props, ref)=> {
    const [mouseIn, setMouseIn] = useState<boolean>(false);
    
    useEffect(()=> {
        function onClick() {
            if (props.onClickOutside && !mouseIn)
                props.onClickOutside();
        }
        
        window.addEventListener("pointerdown", onClick);

        return ()=> window.removeEventListener("pointerdown", onClick);

    }, [mouseIn])
    
    return (
        <div 
            ref={ ref }
            onMouseOut={ ()=> setMouseIn(false) }
            onMouseOver={ ()=> setMouseIn(true) }
            className={ props.className }
            style={ props.style }
        >
            { props.children }
        </div>
    );
});

ClickOutside.displayName = "ClickOutside"
export default ClickOutside;