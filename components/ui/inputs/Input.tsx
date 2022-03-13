import React, { InputHTMLAttributes, useEffect, useState } from "react";
import createClassName from "../../../src/hooks/createClassName";
import { EditorStates } from "../../../states/editor-states";
import { clamp } from "../../../utils/math";
import { MyComponent } from "../../../utils/types";

interface IInput {
    value: string | number
    onChange?: (value: string | number)=> void

    type?: "text" | "number"
    maxLength?: number
    minLength?: number
    max?: number
    min?: number
    onSubmit?: (v: string | number)=> void

    width?: number
    inputClassName?: string
}

const Input: React.FC<IInput & MyComponent> = props=> {
    const [newValue, setNewValue] = useState<IInput["value"]>(props.value);

    useEffect(()=> {
        setNewValue(props.value);
    }, [props.value]);

    function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        props.onChange && props.onChange(clampValue(e.target.value));

        setNewValue(e.target.value);
    }
    function onFocusHandler() {
        EditorStates.InputIsFocused.value = true;
    }
    function onSubmitHandler() {
        props.onSubmit && props.onSubmit(clampValue(newValue));   
        setNewValue(props.value);
        EditorStates.InputIsFocused.value = false;
    }

    function clampValue(val: IInput["value"]): IInput["value"] {
        if (props.type == "number")
            return clamp(+val, props.min || 0, props.max || Infinity)
        
        return val;
    }
    
    return (
        <form className={ createClassName(["input-wrapper", props.className || ""]) } onSubmit={ e=> { e.preventDefault(); onSubmitHandler() } }>
            <input 
                className={ createClassName(["input", props.inputClassName || ""]) }
                style={ {
                    width: props.width,
                    ...props.style
                } } 
                
                type={ props.type || "text" }
                minLength={ props.minLength }
                maxLength={ props.maxLength }
                
                value={ newValue }
                onChange={ onChangeHandler }
                onFocus={ onFocusHandler }
                onBlur={ onSubmitHandler }
            />
        </form>
    );
};

export default Input;