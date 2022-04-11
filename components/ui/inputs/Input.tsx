import React, { InputHTMLAttributes, useEffect, useState } from "react";
import createClassName from "../../../src/hooks/createClassName";
import { EditorStates } from "../../../states/editor-states";
import { clamp } from "../../../utils/math";
import { MyComponent } from "../../../utils/types";
import Icon from "../../Icon";
import Button from "../buttons/Button";

interface IInput {
    value: string | number
    onChange?: (value: string | number)=> void
    onSubmit?: (v: string | number)=> void
    onSubmitChange?: (v: string | number)=> void

    type?: "text" | "number"
    maxLength?: number
    minLength?: number
    max?: number
    min?: number
    disabled?: boolean

    width?: number
    inputClassName?: string
    placeholder?: string
}

const Input: React.FC<IInput & MyComponent> = props=> {
    const [newValue, setNewValue] = useState<IInput["value"]>(props.value);

    const wrapperClassName = createClassName([
        "input-wrapper",
        props.type == "number" && "type-number",
        props.className || ""
    ]);
    
    useEffect(()=> {
        setNewValue(props.value);
    }, [props.value]);

    function onChangeHandler(value: string | number) {
        props.onChange && props.onChange(clampValue(value));
        props.onSubmitChange && props.onSubmitChange(clampValue(value));

        setNewValue(value);
    }
    function onFocusHandler() {
        EditorStates.InputIsFocused.value = true;
    }
    function onSubmitHandler() {
        props.onSubmit && props.onSubmit(clampValue(newValue));   
        props.onSubmitChange && props.onSubmitChange(clampValue(newValue));
        setNewValue(props.value);
        EditorStates.InputIsFocused.value = false;
    }

    function clampValue(val: IInput["value"]): IInput["value"] {
        if (props.type == "number" && (props.min || props.max))
            return clamp(+val, props.min || 0, props.max || Infinity)
        
        return val;
    }
    
    return (
        <form
            className={ wrapperClassName }
            onSubmit={ e=> { e.preventDefault(); onSubmitHandler() } }
        >
            <input 
                disabled={ props.disabled }
                className={ createClassName(["input", props.inputClassName || ""]) }
                style={ {
                    width: props.width,
                    ...props.style
                } } 
                
                type={ props.type || "text" }
                min={ props.min }
                max={ props.max }
                minLength={ props.minLength }
                maxLength={ props.maxLength }
                placeholder={ props.placeholder }
                
                value={ newValue }
                onChange={ e=> onChangeHandler(e.target.value) }
                onFocus={ onFocusHandler }
                onBlur={ onSubmitHandler }
            />

            {/* { props.type == "number" && <div className="increment-buttons">
                <button
                    className="button ghost"
                    onClick={ e=> {
                        (e.target as HTMLButtonElement).blur();
                        onChangeHandler(+props.value + 1);
                    } }
                ><Icon icon="small-arrow-up" /></button>
                <button
                    className="button ghost"
                    onClick={ e=> {
                        (e.target as HTMLButtonElement).blur();
                        onChangeHandler(+props.value - 1);
                    } }
                ><Icon icon="small-arrow-down" /></button>
            </div> } */}
            
        </form>
    );
};

export default Input;