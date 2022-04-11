import React, { createRef, useEffect, useState } from "react";
import ArrayModifier from "../../../../../editor/modifiers/ArrayModifier";
import LayersWorker from "../../../../../editor/workers/LayersWorker";
import { EditorWindowType } from "../../../../../states/editor-states";
import config from "../../../../../utils/config";
import Button from "../../../buttons/Button";
import Range from "../../../inputs/Range";
import Window, { IWindowNeeds } from "../../Window";

const arrayModifier = new ArrayModifier();

const ArrayModifierWindow: React.FC<IWindowNeeds> = props=> {
    const [iterations, setIteration] = useState<number>(4);
    const [offsetX, setOffsetX] = useState<number>(2);
    const [offsetY, setOffsetY] = useState<number>(2);
    const [active, setActive] = useState<boolean>(false);
    const previewRef = createRef<HTMLDivElement>();

    useEffect(()=> {
        const previewNode = previewRef.current;
        if (!previewNode) return;
        arrayModifier.init();
        
        previewNode.appendChild(arrayModifier.canvas);

    }, [previewRef]);
    useEffect(()=> {
        if (active)
            render();
    }, [active, iterations, offsetX, offsetY]);
    
    function render() {
        arrayModifier.render(iterations, offsetX, offsetY);
    }
    
    function applyHandler() {
        setActive(false);
        
        LayersWorker.currentLayer?.applyModifier(arrayModifier);
    }
    function cancelHandler() {
        setActive(false);
    }
    
    return (
        <Window
            constrainsRef={ props.constrainsRef }
            trigger={ EditorWindowType.ARRAY_MODIFIER_WINDOW }

            title={ <span>Array modifier</span> }
            active={ active }
            setActive={ setActive }
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

                        <label className="list gap-1 width-fill">
                            <span className="text-muted">Iterations</span>
                            <Range
                                value={ iterations }
                                onChange={ v=> setIteration(+v) }
                                onInputSubmit={ v=> setIteration(+v) }

                                disableGroupBoxClass
                                className="justify-between width-fill"
                                rangeStyle={ { width: 100 } }
                                
                                min={ 1 }
                                max={ 100 }
                            />
                        </label>
                        <label className="list gap-1">
                            <span className="text-muted">Offset</span>
                            <div className="list gap-1">
                                <div className="slot gap-2">
                                    <span>X</span>
                                    <Range
                                        value={ offsetX }
                                        onChange={ v=> setOffsetX(+v) }
                                        onInputSubmit={ v=> setOffsetX(+v) }

                                        disableGroupBoxClass
                                        rangeStyle={ { width: 100 } }

                                        min={ config.MIN_ARRAY_MOD_OFFSET }
                                        max={ config.MAX_ARRAY_MOD_OFFSET }
                                    />
                                </div>
                                <div className="slot gap-2">
                                    <span>Y</span>
                                    <Range
                                        value={ offsetY }
                                        onChange={ v=> setOffsetY(+v) }
                                        onInputSubmit={ v=> setOffsetY(+v) }

                                        disableGroupBoxClass
                                        rangeStyle={ { width: 100 } }

                                        min={ config.MIN_ARRAY_MOD_OFFSET }
                                        max={ config.MAX_ARRAY_MOD_OFFSET }
                                    />
                                </div>
                            </div>
                        </label>

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

            </div>
            
        </Window>
    );
};

ArrayModifierWindow.displayName = "ArrayModifierWindow";
export default ArrayModifierWindow;