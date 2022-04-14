import React, {  } from "react";
import createClassName from "../../../src/hooks/createClassName";
import { MyComponent } from "../../../utils/types";

export interface INotification {
    color?: "blue" | "red" | "black"
}
export type IEditorNotification = INotification & {
    content: string | React.ReactElement
}

const Notification: React.FC<INotification & MyComponent> = props=> {
    const className = createClassName([
        "notification slot gap-2",
        props.color && `color-${ props.color }`,
        props.className
    ]);
    
    return (
        <div className={ className } style={ props.style }>
            { props.children }
        </div>
    );
};

Notification.displayName = "Notification";
export default Notification;