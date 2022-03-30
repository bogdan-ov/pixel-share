import React, { useState } from "react";
import App from "../../../../editor/App";
import createClassName from "../../../../src/hooks/createClassName";
import { EditorTriggers, EditorWindowType } from "../../../../states/editor-states";
import config from "../../../../utils/config";
import { clamp } from "../../../../utils/math";
import { Anchor } from "../../../../utils/types";
import Button from "../../../ui/buttons/Button";
import Input from "../../../ui/inputs/Input";
import Tooltip from "../../../ui/windows/Tooltip";
import Window, { IWindowNeeds } from "../../../ui/windows/Window";

interface IAnchorCell {
    anchor: Anchor
    setAnchor: (v: Anchor)=> void
    type: Anchor
}

const ResizeCanvasWindow: React.FC<IWindowNeeds> = props=> {
    const [active, setActive] = useState<boolean>(false);
    const [width, setWidth] = useState<number>(App.CanvasWidth.value);
    const [height, setHeight] = useState<number>(App.CanvasHeight.value);
    const [scale, setScale] = useState<number>(1);
    const [keepAspect, setKeepAspect] = useState<boolean>(true);
    const [aspect, setAspect] = useState<number>(App.CanvasWidth.value / App.CanvasHeight.value);
    const [anchor, setAnchor] = useState<Anchor>(Anchor.TOP_LEFT);

    const finalWidth = Math.round(width * scale);
    const finalHeight = Math.round(height * scale);

    function toggleKeepAspect() {
        if (!keepAspect) {
            setAspect(width / height);
            setKeepAspect(true);
        } else {
            setKeepAspect(false);
        }
    }
    
    function applyHandler() {
        const successResize = App.resizeCanvas(finalWidth, finalHeight, anchor, true);

        if (successResize) {
            setWidth(finalWidth);
            setHeight(finalHeight);
            setAspect(finalWidth/finalHeight);
            setScale(1);

            EditorTriggers.Notification.trigger({
                type: "success",
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
            custom
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
                    <Tooltip
                        tooltip={ <span>Anchor</span> }
                        placement="bottom"
                        offset={ -6 }
                    >
                        <div className="anchor">
                            <AnchorCell type={ Anchor.TOP_LEFT } anchor={ anchor } setAnchor={ setAnchor } />
                            <AnchorCell type={ Anchor.TOP_CENTER } anchor={ anchor } setAnchor={ setAnchor } />
                            <AnchorCell type={ Anchor.TOP_RIGHT } anchor={ anchor } setAnchor={ setAnchor } />
                            <AnchorCell type={ Anchor.CENTER_LEFT } anchor={ anchor } setAnchor={ setAnchor } />
                            <AnchorCell type={ Anchor.CENTER_CENTER } anchor={ anchor } setAnchor={ setAnchor } />
                            <AnchorCell type={ Anchor.CENTER_RIGHT } anchor={ anchor } setAnchor={ setAnchor } />
                            <AnchorCell type={ Anchor.BOTTOM_LEFT } anchor={ anchor } setAnchor={ setAnchor } />
                            <AnchorCell type={ Anchor.BOTTOM_CENTER } anchor={ anchor } setAnchor={ setAnchor } />
                            <AnchorCell type={ Anchor.BOTTOM_RIGHT } anchor={ anchor } setAnchor={ setAnchor } />
                        </div>
                    </Tooltip>
                    
                    <div className="list width-fill gap-2">

                        {/* Width / Height */}
                        <div className="slot width-fill gap-2">
                            <div className="list gap-2 width-fill">

                                <label className="slot justify-between width-fill">
                                    <span>Width</span>
                                    <Input
                                        value={ width }
                                        onSubmitChange={ v=> {
                                            setWidth(+v)
                                            if (keepAspect)
                                                setHeight(+v/aspect);
                                        } }

                                        min={ 1 }
                                        max={ config.MAX_CANVAS_WIDTH }

                                        type="number"
                                    />
                                </label>
                                <label className="slot justify-between width-fill">
                                    <span>Height</span>
                                    <Input
                                        value={ height }
                                        onSubmitChange={ v=> {
                                            setHeight(+v)
                                            if (keepAspect)
                                                setWidth(+v*aspect);
                                        } }

                                        min={ 1 }
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

const AnchorCell: React.FC<IAnchorCell> = props=> {
    const className = createClassName([
        "anchor-cell",
        props.type == props.anchor && "active"
    ]);
    
    return (
        <Button 
            onClick={ ()=> props.setAnchor(props.type) }
            className={ className }
            ghost
            icon={ `arrow-${ Anchor[props.type].toLowerCase().replace("_", "-") }` as any }
        />
    );
};

ResizeCanvasWindow.displayName = "ResizeCanvasWindow";
export default ResizeCanvasWindow;