import React, { createRef, useEffect, useState } from "react";
import { EditorWindowType } from "../../../../../states/editor-states";
import Range from "../../../inputs/Range";
import Window, { IWindowNeeds } from "../../Window";
import Input from "../../../inputs/Input";
import Button from "../../../buttons/Button";
import LayersWorker from "../../../../../editor/workers/LayersWorker";
import Checkbox from "../../../inputs/Checkbox";
import DecayModifier from "../../../../../editor/modifiers/DecayModifier";

const decayModifier = new DecayModifier();

const DecayModifierWindow: React.FC<IWindowNeeds> = props=> {
    const [active, setActive] = useState<boolean>(false);
    const [intensive, setIntensive] = useState<number>(50);
    const [scale, setScale] = useState<number>(1);
    const [randomize, setRandomize] = useState<number>(0);
    const [seed, setSeed] = useState<number>(1);
    const [inverse, setInverse] = useState<boolean>(false);
    const previewRef = createRef<HTMLDivElement>();

    useEffect(()=> {
        const previewNode = previewRef.current;
        if (!previewNode) return;
        decayModifier.init();
        
        previewNode.appendChild(decayModifier.canvas);

    }, [previewRef]);
    useEffect(()=> {
        if (active)
            render();
    }, [active, intensive, scale, randomize, seed, inverse]);
    
    function render() {
        decayModifier.render(intensive, scale, randomize, seed, inverse);
    }

    function applyHandler() {
        setActive(false);

        LayersWorker.currentLayer?.applyModifier(decayModifier);
    }
    function cancelHandler() {
        setActive(false);
    }

    return (
        <Window
            title={ <span>Decay modifier</span> }
            constrainsRef={ props.constrainsRef }
            trigger={ EditorWindowType.DECAY_MODIFIER_WINDOW }

            active={ active }
            setActive={ setActive }
        >

            <div className="flex gap-4">

                <div className="list gap-1">
                    <div className="preview" ref={ previewRef } />
                    <Button 
                        onClick={ ()=> render() }
                        type="link"
                        text="Refresh"
                    />
                </div>

                <div className="list gap-2">

                    <Checkbox 
                        checked={ inverse }
                        onChange={ setInverse }
                    >
                        <span>Inverse</span>
                    </Checkbox>
                    <div className="slot gap-1 justify-between">
                        <span>Seed</span>
                        <Input
                            width={ 60 }
                            type="number"
                            value={ seed }
                            onSubmitChange={ v=> setSeed(+v) }
                        />
                    </div>
                    <div className="list gap-1">
                        <span className="text-muted">Intensive</span>
                        <Range
                            value={ intensive }
                            onChange={ setIntensive }
                            onInputSubmit={ setIntensive }

                            disableGroupBoxClass
                            rangeStyle={ { width: 100 } }

                            min={ 0 }
                            max={ 100 }
                        />
                    </div>
                    <div className="list gap-1">
                        <span className="text-muted">Scale</span>
                        <Range
                            value={ scale }
                            onChange={ setScale }
                            onInputSubmit={ setScale }

                            disableGroupBoxClass
                            rangeStyle={ { width: 100 } }

                            min={ 1 }
                            max={ 100 }
                        />
                    </div>
                    <div className="list gap-1">
                        <span className="text-muted">Randomize</span>
                        <Range
                            value={ randomize }
                            onChange={ setRandomize }
                            onInputSubmit={ setRandomize }

                            disableGroupBoxClass
                            rangeStyle={ { width: 100 } }

                            min={ 0 }
                            max={ 100 }
                        />
                    </div>

                    <div className="slot gap-1">
                        <Button
                            onClick={ applyHandler }
                            color="blue"
                            text="Apply"
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

DecayModifierWindow.displayName = "DecayModifierWindow";
export default DecayModifierWindow;