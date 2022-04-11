import { stopAnimation } from "framer-motion/types/render/utils/animation";
import React from "react";
import createClassName from "../../../src/hooks/createClassName";
import { MyComponent } from "../../../utils/types";
import Tooltip from "../windows/Tooltip";
import Input from "./Input";

interface IRange {
    min?: number
    max?: number
    inputMin?: number
    inputMax?: number
    inputMaxLength?: number
    inputMinLength?: number
    
    value: number
    onChange: (value: number)=> void
    onInputSubmit: (value: number)=> void
    
    rangeStyle?: React.CSSProperties
    inputStyle?: React.CSSProperties
    step?: number
    
    disabled?: boolean
    disableInput?: boolean
    disableGroupBoxClass?: boolean
}

const Range: React.FC<IRange & MyComponent> = props=> {

    const className = createClassName([
        "slot gap-1",
        !props.disableGroupBoxClass && "group-box",
        props.className
    ]);
    
    return (
        <div className={ className }>
            { !props.disableInput && 
                <Input
                    style={ {
                        width: 38,
                        ...props.inputStyle
                    } }
                    inputClassName="ghost"
                    type="number"

                    min={ props.inputMin || props.min }
                    max={ props.inputMax || props.max }
                    minLength={ props.inputMinLength }
                    maxLength={ props.inputMaxLength }
                    
                    disabled={ props.disabled }
                    value={ props.value }
                    onChange={ v=> props.onChange(+v) }
                    onSubmit={ v=> props.onInputSubmit(+v) }
                />
            }

            <input
                type="range"
                className="range-input"
                style={ props.rangeStyle }

                min={ props.min }
                max={ props.max }
                step={ props.step || 1 }
                
                disabled={ props.disabled }
                value={ props.value }
                onChange={ e=> props.onChange(+e.target.value) }
            />
        
        </div>
    );
};

export default Range;