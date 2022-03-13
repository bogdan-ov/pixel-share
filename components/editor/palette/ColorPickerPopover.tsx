import React, { useEffect, useState } from "react";
import App from "../../../editor/App";
import PaletteColor from "../../../editor/renderer/PaletteColor";
import PaletteWorker from "../../../editor/workers/PaletteWorker";
import { EditorWindowType } from "../../../states/editor-states";
import { HSLA } from "../../../utils/types";
import { hexToHsl, hslToHex } from "../../../utils/utils";
import ColorPicker from "../../ui/ColorPicker";
import Popover from "../../ui/windows/Popover";

interface IColorPickerPopover {
    
}

const ColorPickerPopover: React.FC<IColorPickerPopover> = props=> {
    const [active, setActive] = useState<boolean>(false);
    const [newColor, setNewColor] = useState<HSLA>([0, 0, 0, 1]);
    const [lastColor, setLastColor] = useState<HSLA>([0, 0, 0, 1]);
    const [id, setId] = useState<PaletteColor["id"]>(0);

    function onOpenHandler(action: any) {
        const color = PaletteWorker.getPaletteColor(action.targetId)?.hslaColor || [0, 0, 0, 1];
        
        setLastColor(color);
        setNewColor(color);
        setId(+action.targetId);
    }
    
    function applyColor() {
        PaletteWorker.updatePaletteColor(id, newColor);
    }
    
    return (
        <Popover
            custom
            active={ active }
            setActive={ setActive }
        
            openTrigger={ EditorWindowType.EDIT_COLOR }
            onActive={ onOpenHandler }
            className="flex flex-column gap-4"
        >
            <div className="slot gap-2 clickable">
                <span>Normal color picker</span>
                <input type="color" value={ hslToHex(newColor) } onChange={ e=> setNewColor(hexToHsl(e.target.value)) } />
            </div>
            
            <ColorPicker 
                lastColor={ lastColor }
                newColor={ newColor } setNewColor={ setNewColor }
            />

            <div className="flex flex-column">
                <div className="slot gap-1">
                    <button 
                        className="button color-blue width-fill"
                        onClick={ ()=> {
                            applyColor();
                            setActive(false);
                        } }
                    >Apply</button>
                    <button 
                        className="button width-fill"
                        onClick={ ()=> setActive(false) }
                    >Cancel</button>
                </div>
                <span className="beta self-end mt-2">(beta)</span>
            </div>
            
        </Popover>
    );
};

export default ColorPickerPopover;