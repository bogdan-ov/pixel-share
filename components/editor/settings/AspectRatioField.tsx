import React, { useState } from "react";
import App from "../../../editor/App";
import useSafeState from "../../../src/hooks/useSafeState";
import config from "../../../utils/config";
import { MyComponent, ReactSimpleState, ReactState } from "../../../utils/types";
import Button from "../../ui/buttons/Button";
import Input from "../../ui/inputs/Input";

interface IAspectRatioField {
    width: number
    height: number
    setWidth: ReactSimpleState<number>
    setHeight: ReactSimpleState<number>

    keepAspect?: boolean
    setKeepAspect?: ReactSimpleState<boolean>

    aspect?: number
    setAspect?: ReactSimpleState<number>
}

const AspectRatioField: React.FC<IAspectRatioField & MyComponent> = props=> {
    const [keepAspect, setKeepAspect] = useSafeState<boolean>(false, props.keepAspect, props.setKeepAspect);
    const [aspect, setAspect] = useSafeState<number>(App.CanvasWidth.value / App.CanvasHeight.value, props.aspect, props.setAspect);

    function toggleKeepAspect() {
        if (!keepAspect) {
            setAspect(props.width / props.height);
            setKeepAspect(true);
        } else {
            setKeepAspect(false);
        }
    }
    
    return (
        <div className="slot width-fill gap-2" style={ props.style }>
            <div className="list gap-2 width-fill">

                <label className="slot gap-2 justify-between width-fill">
                    <span>Width</span>
                    <Input
                        value={ props.width }
                        onSubmitChange={ v=> {
                            props.setWidth(+v)
                            if (keepAspect)
                                props.setHeight(+v/aspect);
                        } }

                        min={ 0 }
                        max={ config.MAX_CANVAS_WIDTH }

                        type="number"
                    />
                </label>
                <label className="slot gap-2 justify-between width-fill">
                    <span>Height</span>
                    <Input
                        value={ props.height }
                        onSubmitChange={ v=> {
                            props.setHeight(+v)
                            if (keepAspect)
                                props.setWidth(+v*aspect);
                        } }

                        min={ 0 }
                        max={ config.MAX_CANVAS_HEIGHT }

                        type="number"
                    />
                </label>
                
            </div>

            <Button
                ghost
                size="small"
                onClick={ toggleKeepAspect }
                icon={ keepAspect ? "keep" : "not-keep" }
            />
        </div>
    );
};

AspectRatioField.displayName = "AspectRatioField";
export default AspectRatioField;