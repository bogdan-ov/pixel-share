import React from "react";
import ActionWorker from "../../../editor/workers/ActionWorker";
import config from "../../../utils/config";
import messages from "../../../utils/messages";
import TriggerNotice, { ITriggerNotice } from "../interactive/TriggerNotice";
import Button, { IButton } from "./Button";

export type IActionButton = {
    actionName: string
    actionProps?: any
} & IButton & ITriggerNotice;

const ActionButton: React.FC<IActionButton> = props=> {
    function onClickHandler(e: React.MouseEvent) {
        props.onClick && props.onClick(e);

        const action = ActionWorker.registered[props.actionName];

        if (action) {
            action(props.actionProps);
        } else 
            config.DEBUG && console.error(messages.err.actionName(props.actionName)); 
    }
    
    return (
        <TriggerNotice
            { ...props }
        >
            <Button
                { ...props }
                onClick={ onClickHandler }
                tooltipHotkeysName={ props.tooltipHotkeysName || props.actionName }
            />
        </TriggerNotice>
    );
};

ActionButton.displayName = "ActionButton";
export default ActionButton;