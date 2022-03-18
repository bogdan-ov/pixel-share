import { MyComponent } from "../../../utils/types";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { EditorActionType, EditorEditedType, EditorTriggers, EditorWindowType, EditorWrongActionType } from "../../../states/editor-states";

export interface ITriggerNotice {
    triggerType?: keyof typeof EditorTriggers
    trigger?: EditorWindowType | EditorActionType | EditorWrongActionType | EditorEditedType
}

const TriggerNotice: React.FC<ITriggerNotice & MyComponent> = props=> {
    
    const animation = useAnimation();

    useEffect(()=> {
        if (!props.triggerType)
            return;

        let unlisten = EditorTriggers[props.triggerType].listen(action=> {
            const type = (action as any).type || null;
            if ((props.trigger && !type) ? false : (type ? (action as any).type == props.trigger : true))
                shakeAnimation();
        });
        
        return ()=> unlisten();
        
    }, []);

    function shakeAnimation() {
        animation.start({
            y: [0, -2, 1, 0],
            transition: {
                ease: "easeInOut",
                duration: .4
            }
        });
    }
    
    return (
        <motion.div
            style={ props.style }
            className={ props.className }
        
            initial={ { y: 0 } }
            animate={ animation }
        >
            { props.children }
        </motion.div>
    );
};

TriggerNotice.displayName = "TriggerNotice";
export default TriggerNotice;