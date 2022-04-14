import React, { useEffect, useState } from "react";
import App from "../../../../editor/App";
import useStateListener from "../../../../src/hooks/useStateListener";
import { EditorTriggers, EditorWindowType } from "../../../../states/editor-states";
import config from "../../../../utils/config";
import { clamp } from "../../../../utils/math";
import { Anchor } from "../../../../utils/types";
import Button from "../../../ui/buttons/Button";
import Input from "../../../ui/inputs/Input";
import Window, { IWindowNeeds } from "../../../ui/windows/Window";
import AspectRatioField from "../../settings/AspectRatioField";
import AnchorField from "./AnchorField";

const ResizeCanvasWindow: React.FC<IWindowNeeds> = props=> {
    const [canvasWidth] = useStateListener(App.CanvasWidth);
    const [canvasHeight] = useStateListener(App.CanvasHeight);

    const [active, setActive] = useState<boolean>(false);
    const [width, setWidth] = useState<number>(canvasWidth);
    const [height, setHeight] = useState<number>(canvasHeight);
    const [scale, setScale] = useState<number>(1);
    const [aspect, setAspect] = useState<number>(canvasWidth / canvasHeight);
    const [anchor, setAnchor] = useState<Anchor>(Anchor.TOP_LEFT);

    const finalWidth = clamp(Math.round(width * scale), config.MIN_CANVAS_WIDTH, config.MAX_CANVAS_WIDTH);
    const finalHeight = clamp(Math.round(height * scale), config.MIN_CANVAS_HEIGHT, config.MAX_CANVAS_HEIGHT);
    
    useEffect(()=> {

        if (active) {
            setWidth(canvasWidth);
            setHeight(canvasHeight);
        }
        
    }, [active]);
    
    function applyHandler() {
        const successResize = App.resizeCanvas(finalWidth, finalHeight, anchor, true);

        if (successResize) {
            setWidth(finalWidth);
            setHeight(finalHeight);
            setAspect(finalWidth/finalHeight);
            setScale(1);

            EditorTriggers.Notification1.trigger({
                content: `😃 Canvas resized! ${ width }px*${ height }px`,
            });
        }
        
        setActive(false);
    }
    function cancelHandler() {
        setActive(false);
    }
    function resetHandler() {
        setWidth(App.CanvasWidth.value);
        setHeight(App.CanvasHeight.value);
    }
    
    return (
        <Window 
            constrainsRef={ props.constrainsRef }
            active={ active }
            setActive={ setActive }
        
            onEnter={ applyHandler }
            trigger={ EditorWindowType.RESIZE_CANVAS_WINDOW }
            minWidth={ 260 }
            title={ <span className="text-muted">Resize canvas</span> }
            className="resize-canvas-window"
        >

            <div className="list gap-4">

                <div className="flex width-fill gap-4">
                    {/* Anchor */}
                    <AnchorField
                        anchor={ anchor }
                        setAnchor={ setAnchor }
                    />
                    
                    <div className="list width-fill gap-2">

                        {/* Width / Height */}
                        <AspectRatioField
                            width={ width }
                            height={ height }
                            setWidth={ setWidth }
                            setHeight={ setHeight }

                            aspect={ aspect }
                            setAspect={ setAspect }
                        />

                        {/* Scale */}
                        <label className="slot justify-between gap-2" style={ { maxWidth: "max-content" } }>
                            <span>Scale</span>
                            <Input
                                value={ scale }
                                onSubmitChange={ v=> {
                                    if (Math.max(width, height) * +v > config.MAX_CANVAS_WIDTH)
                                        setScale(clamp(+v, 1, Math.floor(config.MAX_CANVAS_WIDTH / Math.max(width, height)) - 1));
                                    else
                                        setScale(clamp(+v, 1, config.MAX_CANVAS_SCALE))
                                } }

                                min={ 1 }
                                max={ config.MAX_CANVAS_SCALE }
                                
                                type="number"
                            />
                        </label>
                        
                    </div>
                    
                </div>

                {/* Some text */}
                <span className="text-muted">Final size { finalWidth }px*{ finalHeight }px</span>
                
                {/* Action buttons */}
                <div className="slot gap-1">
                    <Button
                        onClick={ applyHandler }
                        color="blue"
                    >Apply</Button>
                    <Button
                        btnType="button"
                        onClick={ resetHandler }
                    >Reset</Button>
                    <Button
                        btnType="button"
                        onClick={ cancelHandler }
                    >Cancel</Button>
                </div>
                
            </div>
            
        </Window>
    );
};

ResizeCanvasWindow.displayName = "ResizeCanvasWindow";
export default ResizeCanvasWindow;