import React from "react";
import createClassName from "../../../src/hooks/createClassName";
import { MyComponent, ViewMode } from "../../../utils/types";
import { capitalize } from "../../../utils/utils";
import Button, { IButton } from "../buttons/Button";

interface IPanel {
    viewMode?: ViewMode
}
interface ISwitchViewModeButton {
    viewMode: ViewMode
    setViewMode: (value: ViewMode)=> void
    rules: {
        [from: string]: ViewMode
    }
}

const Panel: React.FC<IPanel & MyComponent> = props=> {
    const className = createClassName([
        "panel",
        props.viewMode !== undefined && `view-${ ViewMode[props.viewMode].replace("_", "-").toLowerCase() }`,
        props.className,
    ]);
    
    return (
        <aside 
            className={ className }
            style={ props.style }
        >
            { props.children }
        </aside>
    );
};

export const SwitchViewModeButton: React.FC<ISwitchViewModeButton & IButton & MyComponent> = props=> {
    
    const viewModeName = ViewMode[props.viewMode].toLowerCase();
    return (
        <Button
            tooltip={ <span>{ capitalize(viewModeName.replace("_", " ")) } view</span> }
            tooltipPlacement="bottom"
            onClick={ ()=> {
                props.setViewMode(props.rules[props.viewMode]);
            } }
            ghost
            size="small"
            icon={ ("view-" + viewModeName.replace("_", "-")) as any }

            { ...props }
        />
    );
};

Panel.displayName = "Panel";
export default Panel;