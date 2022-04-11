import React, { createRef, useEffect, useMemo, useState } from "react";
import StrokeModifier from "../../../../../editor/modifiers/StrokeModifier";
import LayersWorker from "../../../../../editor/workers/LayersWorker";
import { EditorWindowType } from "../../../../../states/editor-states";
import { HSLA } from "../../../../../utils/types";
import Button from "../../../buttons/Button";
import Range from "../../../inputs/Range";
import ColorPicker from "../../../utils/ColorPicker";
import Window, { IWindowNeeds } from "../../Window";

const strokeModifier = new StrokeModifier();

const StrokeModifierWindow: React.FC<IWindowNeeds> = props=> {
    const [active, setActive] = useState<boolean>(false);
    const [lastColor] = useState<HSLA>([0, 0, 0, 1]);
    const [color, setColor] = useState<HSLA>([0, 0, 0, 1]);
    const [time, setTime] = useState<number>(1);

    const [right, setRight] = useState<boolean>(true);
    const [left, setLeft] = useState<boolean>(true);
    const [top, setTop] = useState<boolean>(true);
    const [bottom, setBottom] = useState<boolean>(true);
    
    const [topLeft, setTopLeft] = useState<boolean>(false);
    const [topRight, setTopRight] = useState<boolean>(false);
    const [bottomRight, setBottomRight] = useState<boolean>(false);
    const [bottomLeft, setBottomLeft] = useState<boolean>(false);
    
    const previewRef = createRef<HTMLDivElement>();

    useEffect(()=> {
        const previewNode = previewRef.current;
        if (!previewNode) return;
        strokeModifier.init();
        
        previewNode.appendChild(strokeModifier.canvas);

    }, [previewRef]);
    useEffect(()=> {
        if (active)
            render();
    }, [active, right, left, top, bottom, topLeft, topRight, bottomLeft, bottomRight, time]);

    function render() {
        strokeModifier.render(right, left, top, bottom, topLeft, topRight, bottomLeft, bottomRight, color);
    }
    
    function applyHandler() {
        setActive(false);
        LayersWorker.currentLayer?.applyModifier(strokeModifier);
    }
    function cancelHandler() {
        setActive(false)
    }

    return (
        <Window
            title={ <span>Stroke modifier</span> }
            constrainsRef={ props.constrainsRef }
            trigger={ EditorWindowType.STROKE_MODIFIER_WINDOW }
            
            active={ active }
            setActive={ setActive }
            className="stroke-modifier-window"
        >
            
            <div className="flex gap-4">

                {/* Preview */}
                <div className="list gap-1">
                    <div className="preview" ref={ previewRef } />
                    <Button 
                        onClick={ ()=> render() }
                        type="link"
                        text="Refresh"
                    />
                </div>

                {/* Settings */}
                <div className="list gap-2 justify-between">
                    <div className="list gap-2">
                        <div className="anchor">
                            <Button 
                                className="anchor-cell"
                                active={ topLeft }
                                onClick={ ()=> setTopLeft(v=> !v) }
                                icon="arrow-top-left"
                                ghost
                            />
                            <Button 
                                className="anchor-cell"
                                active={ top }
                                onClick={ ()=> setTop(v=> !v) }
                                icon="arrow-top-center"
                                ghost
                            />
                            <Button 
                                className="anchor-cell"
                                active={ topRight }
                                onClick={ ()=> setTopRight(v=> !v) }
                                icon="arrow-top-right"
                                ghost
                            />
                            <Button 
                                className="anchor-cell"
                                active={ left }
                                onClick={ ()=> setLeft(v=> !v) }
                                icon="arrow-center-left"
                                ghost
                            />

                            <Button 
                                className="anchor-cell"
                                onClick={ ()=> {
                                    setRight(true);
                                    setLeft(true);
                                    setTop(true);
                                    setBottom(true);

                                    setTopRight(false);
                                    setTopLeft(false);
                                    setBottomRight(false);
                                    setBottomLeft(false);
                                } }
                                icon="arrow-center-center"
                                ghost
                            />

                            <Button 
                                className="anchor-cell"
                                active={ right }
                                onClick={ ()=> setRight(v=> !v) }
                                icon="arrow-center-right"
                                ghost
                            />
                            <Button 
                                className="anchor-cell"
                                active={ bottomLeft }
                                onClick={ ()=> setBottomLeft(v=> !v) }
                                icon="arrow-bottom-left"
                                ghost
                            />
                            <Button 
                                className="anchor-cell"
                                active={ bottom }
                                onClick={ ()=> setBottom(v=> !v) }
                                icon="arrow-bottom-center"
                                ghost
                            />
                            <Button 
                                className="anchor-cell"
                                active={ bottomRight }
                                onClick={ ()=> setBottomRight(v=> !v) }
                                icon="arrow-bottom-right"
                                ghost
                            />
                        </div>

                        <div className="list gap-1">
                            <span className="text-muted">Width <span className="badge">(soon)</span></span>
                            <Range
                                disabled
                                value={ 1 }
                                onChange={ ()=> {} }
                                onInputSubmit={ ()=> {} }

                                disableGroupBoxClass
                                rangeStyle={ { width: 100 } }

                                min={ 1 }
                                max={ 10 }
                            />
                        </div>
                    </div>

                    <div className="slot gap-1">
                        <Button
                            onClick={ applyHandler }
                            color="blue"
                            text="Apply!"
                        />
                        <Button
                            onClick={ cancelHandler }
                            text="Cancel"
                        />
                    </div>
                    
                </div>

                {/* Color */}
                <ColorPicker 
                    size={ 140 }
                    short
                    palette
                    lastColor={ lastColor }
                    newColor={ color }
                    setNewColor={ setColor }
                    onEnd={ ()=> setTime(v=> v+1) }
                />
                
            </div>
            
        </Window>
    );
};

StrokeModifierWindow.displayName = "StrokeModifierWindow";
export default StrokeModifierWindow;