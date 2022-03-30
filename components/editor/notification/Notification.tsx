import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { EditorTriggers } from "../../../states/editor-states";

export interface INotification {
    id: number
    content: string
    type?: "success" | "danger" | null
}

const Notification: React.FC<INotification & { removeNotification(id: INotification["id"]): void }> = props=> {

    useEffect(()=> {
        const t = setTimeout(()=> {
            props.removeNotification(props.id);
        }, 2200);
        
        return ()=> clearTimeout(t);
        
    }, []);
    
    return (
        <motion.div 
            initial={ {
                opacity: 0,
                scale: .8
            } }
            animate={ {
                opacity: 1,
                scale: 1
            } }
            exit={ {
                x: "-100%",
                opacity: 0,
                transition: {
                    ease: "circIn",
                    duration: .2
                }
            } }
            layout
            transition={ {
                ease: "circOut",
                duration: .1
            } }
            className="notification slot gap-2"
        >
            <main className="slot" dangerouslySetInnerHTML={ { __html: props.content } } />
        </motion.div>
    );
};

const NotificationsList: React.FC = ()=> {

    const [notifications, setNotifications] = useState<INotification[]>([]);

    useEffect(()=> 
        // Automatic unlisten
        EditorTriggers.Notification.listen(notif=> addNotification(notif.content, notif.type)),
    []);
    useEffect(()=> {

        if (notifications.length > 6)
            removeNotification(notifications[notifications.length-1].id);
        
    }, [notifications]);

    function addNotification(content: INotification["content"], type?: INotification["type"]) {
        setNotifications(v=> [
            { id: Date.now(), content, type },
            ...v
        ]);
    }
    function removeNotification(id: INotification["id"]) {
        setNotifications(v=> v.filter(n=> n.id != id));
    }
    
    return (
        <div className="notifications-list flex flex-column gap-2">
            <AnimatePresence>
                { notifications.map(notif=>
                    <Notification { ...notif } key={ notif.id } removeNotification={ removeNotification } />    
                ) }
            </AnimatePresence>
        </div>
    );
};

export default NotificationsList;