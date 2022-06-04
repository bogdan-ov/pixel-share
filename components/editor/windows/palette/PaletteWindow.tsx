import React, { createRef, useEffect, useState } from "react";
import PaletteColor from "../../../../editor/renderer/PaletteColor";
import PaletteWorker from "../../../../editor/workers/PaletteWorker";
import createClassName from "../../../../src/hooks/createClassName";
import useStateListener from "../../../../src/hooks/useStateListener";
import { EditorWindowType } from "../../../../states/editor-states";
import { HSLA, ViewMode } from "../../../../utils/types";
import { hslaToString, viewModeToString, hslToHex } from "../../../../utils/utils";
import Button from "../../../ui/buttons/Button";
import { SwitchViewModeButton } from "../../../ui/panels/Panel";
import ColorPicker from "../../../ui/utils/ColorPicker";
import FullWindow, { FullWindowContent } from "../../../ui/windows/FullWindow";
import Tooltip from "../../../ui/windows/Tooltip";
import { IPaletteColorComponent } from "../../palette/PaletteColorComponent";

const PaletteWindow: React.FC = ()=> {
    const [active, setActive] = useState<boolean>(false);
    const [palette] = useStateListener<PaletteColor[]>(PaletteWorker.Palette);
    const [lastColor, setLastColor] = useState<HSLA>(palette[0]?.hslaColor || [0,0,0,1]);
    const [currentColorId, currentColorIdState] = useStateListener(PaletteWorker.CurrentPaletteColorId);
    const [newColor, setNewColor] = useState<HSLA>([0,0,0,1]);
    const [paletteViewMode, setPaletteViewMode] = useState<ViewMode>(ViewMode.GRID);

    useEffect(()=> {

        const c = PaletteWorker.currentPaletteColor.hslaColor;
        setLastColor(c)
        setNewColor(c);
        
    }, [currentColorId]);
    
    function applyHandler() {
        PaletteWorker.updatePaletteColor(currentColorId, newColor);
        setLastColor(newColor);
    }
    function applyNewHandler() {
        PaletteWorker.addPaletteColor(Date.now(), newColor);
    }
    function addColorHandler() {
        PaletteWorker.addPaletteColor()
    }
    function duplicateColorHandler() {
        PaletteWorker.duplicateColor(currentColorId);
    }
    function deleteColorHandler() {
        PaletteWorker.deletePaletteColor(currentColorId);
    }
    
    return (
        <FullWindow
            active={ active }
            setActive={ setActive }
            trigger={ EditorWindowType.PALETTE_WINDOW }

            className="palette-window"
        >

            <FullWindowContent className="flex p-0">
                <div className="list gap-4 p-4">
                    <ColorPicker 
                        lastColor={ lastColor }
                        newColor={ newColor }
                        setNewColor={ setNewColor }
                    />
                    <div className="slot gap-1">
                        <Button 
                            text="Apply"
                            color="blue"
                            onClick={ applyHandler }
                            className="width-fill"
                        />
                        <Button 
                            text="Insert new"
                            onClick={ applyNewHandler }
                            className="p-0 width-fill"
                        />
                    </div>
                </div>

                <div className="list">
                    <div className="list gap-3 scrollable p-4 height-fill">
                        <div className="slot justify-between">
                            <span>Palette <span className="text-muted">({ palette.length })</span></span>

                            <SwitchViewModeButton
                                rules={ {
                                    [ViewMode.GRID]: ViewMode.LIST,
                                    [ViewMode.LIST]: ViewMode.GRID
                                } }
                                viewMode={ paletteViewMode }
                                setViewMode={ setPaletteViewMode }
                            />
                            
                        </div>
                        
                        <div className={ createClassName(["palette", viewModeToString(paletteViewMode)]) }>
                            { palette.map(color=>
                                <Color 
                                    key={ color.id }
                                    { ...color }
                                    active={ color.id == currentColorId }
                                    colorName={ paletteViewMode == ViewMode.LIST }
                                    onClick={ ()=> {
                                        currentColorIdState.value = color.id;
                                    } }
                                />
                            ) }
                        </div>

                    </div>

                    <footer className="slot p-2 gap-1">
                        <Button
                            icon="add-color"
                            size="middle"
                            ghost

                            tooltip={ <span>Add color</span> }
                            tooltipPlacement="top"

                            onClick={ addColorHandler }
                        />
                        <Button
                            icon="duplicate-color"
                            size="middle"
                            ghost

                            tooltip={ <span>Duplicate current color</span> }
                            tooltipPlacement="top"

                            onClick={ duplicateColorHandler }
                        />
                        <Button
                            icon="delete-color"
                            size="middle"
                            ghost

                            tooltip={ <span>Remove current color</span> }
                            tooltipPlacement="top"

                            onClick={ deleteColorHandler }
                        />
                    </footer>
                </div>

                <div className="list height-fill justify-between p-4">
                    <div className="list gap-3">
                        <span>Actions</span>
                        <Button
                            type="link"
                            text="Paste from clipboard"
                            onClick={ ()=> PaletteWorker.pasteColorFromClipboard() }
                            tooltipHotkeysName="fast-add-palette-color"
                            tooltip={ <span></span> }
                            tooltipPlacement="top"
                        />
                    </div>
                    <span className="text-muted">There will be more<br />functions! :D</span>
                </div>
                
            </FullWindowContent>
            
        </FullWindow>
    );
};

const Color: React.FC<IPaletteColorComponent & { colorName: boolean, active: boolean, onClick: ()=> void }> = props=> {
    const className = createClassName([
        "color centered",
        (props.hslaColor[2] > 50 || (props.hslaColor[1] > 90 && props.hslaColor[2] > 40)) && "text-black",
        props.active && "active"
    ]);
    const ref = createRef<HTMLDivElement>();

    useEffect(()=> {
        if (props.active)
            ref.current?.focus()
    }, [props.active]);
    
    return (
        <Tooltip
            tooltip={ <span>{ hslToHex(props.hslaColor) }</span> }
            placement="top"
            delay={ 0 }
        >
            <div 
                ref={ ref }
                tabIndex={ 0 }
                className={ className }
                style={{ background: hslaToString(props.hslaColor) }}
                onClick={ props.onClick }
            >
                { props.colorName && <span>{ hslToHex(props.hslaColor) }</span> }
            </div>
        </Tooltip>
    );
};

PaletteWindow.displayName = "PaletteWindow";
export default PaletteWindow;