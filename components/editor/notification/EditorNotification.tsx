import { useAnimation, motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import createClassName from "../../../src/hooks/createClassName";
import { EditorTriggers } from "../../../states/editor-states";
import Notification, { IEditorNotification } from "./Notification";

const variants: Variants = {
    hidden: {
        y: "300%",
        transition: {
            ease: "easeInOut",
            duration: .2
        }
    },
    visible: {
        y: "0%",
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20
        }
    },
    shake: {
        y: [0, -8, 8, -5, 2, -2, 0],
        transition: {
            ease: "easeInOut",
            duration: .6
        }
    }
}

const EditorNotification: React.FC = props=> {
    const [active, setActive] = useState<boolean>(false);
    const [content, setContent] = useState<IEditorNotification["content"]>("");
    const [color, setColor] = useState<IEditorNotification["color"]>("black");
    const [time, setTime] = useState<number>(0);

    const animation = useAnimation();
    
    const className = createClassName([
        "editor-notification-wrapper",
        active && "active"
    ])
    
    useEffect(()=> {

        const unlistenNotif = EditorTriggers.Notification1.listen(notif=> {
            if (active)
                animation.start("shake");
            setActive(true);
            setColor(notif.color || "black");
            setContent(notif.content);
            setTime(v=> v+1);
        })

        return ()=> unlistenNotif();
    }, [active]);
    useEffect(()=> {
        if (active) {
            animation.start("visible");
        } else {
            animation.start("hidden");
        }
    }, [active]);
    useEffect(()=> {
        if (!active) return;
        
        const timeout = setTimeout(()=> {
            setActive(false);
        }, 3000);

        return ()=> clearTimeout(timeout);
    }, [active, time]);
    
    return (
        <motion.div 
            animate={ animation }
            initial={ "hidden" }
            variants={ variants }
            className={ className }
        >
            <Notification color={ color }>
                { content }
            </Notification>
        </motion.div>
    );
};

EditorNotification.displayName = "EditorNotification"
export default EditorNotification;