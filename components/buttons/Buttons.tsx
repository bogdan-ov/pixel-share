import createClassName from "../../src/hooks/createClassName";
import { MyComponent } from "../../utils/types";
import Icon, { icons } from "../Icon";

interface IButton {
    ghost?: boolean
    disabled?: boolean
    title?: string
    onClick?: ()=> void
}

interface IActionButton {
    icon: keyof typeof icons
    size?: "small" | "middle"
}

export const ActionButton: React.FC<IButton & IActionButton & MyComponent> = props=> {
    const className = createClassName([
        "button",
        props.size || "middle",
        props.ghost ? "ghost" : "",
        props.className || ""
    ]);
    
    return (
        <button 
            title={ props.title }
            disabled={ props.disabled }
            onClick={ props.onClick }
            className={ className }
        >
            <Icon icon={ props.icon } />
        </button>
    );
};