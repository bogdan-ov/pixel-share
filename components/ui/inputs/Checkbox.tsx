import React from "react";
import createClassName from "../../../src/hooks/createClassName";
import { MyComponent } from "../../../utils/types";
import Icon from "../../Icon";

interface ICheckbox {
    checked: boolean
    onChange?: (value: boolean)=> void
}

const Checkbox: React.FC<ICheckbox & MyComponent> = props=> {
    const className = createClassName([
        "checkbox",
        props.checked ? "checked" : ""
    ]);
    const wrapperClassName = createClassName([
        "checkbox-wrapper slot gap-2 group-box",
        props.className || ""
    ]);
    
    return (
        <div className={ wrapperClassName } onClick={ ()=> props.onChange && props.onChange(!props.checked) }>
            <button className={ className }>
                <div className="icon"><Icon icon="checkmark" /></div>
            </button>
            { props.children }
        </div>
    );
};

export default Checkbox;