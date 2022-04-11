import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import useStateListener, { useJustStatesListener } from "../../../src/hooks/useStateListener";
import PaletteWorker from "../../../editor/workers/PaletteWorker";
import Tooltip from "../../ui/windows/Tooltip";
import { randomId } from "../../../utils/math";

export interface IToolSettingsContainer {
    
}
interface IToolColorsIndicator {
    alpha?: boolean
}

export const ToolSettingsContainer: React.FC = props=> (
    <div className="tool-settings-container slot gap-4 height-fill"><hr className="vertical" />{ props.children }</div>
);
export const CurrentColorsIndicator: React.FC<IToolColorsIndicator> = props=> {
    const [currentColorId] = useStateListener(PaletteWorker.CurrentPaletteColorId);
    const [lastColorId] = useStateListener(PaletteWorker.LastPaletteColorId);
    useJustStatesListener([PaletteWorker.Palette], `tool-colors-indicator`);
    
    return (
        <Tooltip
            tooltip={ <span>Switch colors</span> }
            hotkeysName="switch-current-colors"
            placement="bottom"
        >
            <div className="current-colors-indicator clickable" onClick={ ()=> PaletteWorker.switchCurrentColors() }>
                { props.alpha ?
                    <div className="color alpha" /> :
                    <>
                        <div 
                            className="color last"
                            style={ { background: PaletteWorker.getPaletteColor(lastColorId)?.hexColor } }
                        />
                        <div 
                            className="color current"
                            style={ { background: PaletteWorker.getPaletteColor(currentColorId)?.hexColor } }
                        />
                    </>
                }
            </div>
        </Tooltip>
    )
};