import React, { useState } from "react";
import useStateListener, { useJustStatesListener } from "../../../src/hooks/useStateListener";
import PaletteColorComponent from "./PaletteColorComponent";
import PaletteColor from "../../../editor/renderer/PaletteColor";
import Icon from "../../Icon";
import config from "../../../utils/config";
import { ViewMode } from "../../../utils/types";
import PaletteWorker from "../../../editor/workers/PaletteWorker";
import Panel, { SwitchViewModeButton } from "../../ui/panels/Panel";
import createClassName from "../../../src/hooks/createClassName";
import Button from "../../ui/buttons/Button";
import { AnimatePresence, motion } from "framer-motion";

const PalettePanel: React.FC = ()=> {
    const [palette, paletteState] = useStateListener(PaletteWorker.Palette, "palette-panel-palette");
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
    useJustStatesListener([PaletteWorker.CurrentPaletteColorId, PaletteWorker.LastPaletteColorId], "palette-panel-just");

    const className = createClassName([
        "palette-panel flex flex-column gap-2"
    ]);
    
    function addHandler() {
        PaletteWorker.addPaletteColor();
    }
    
    return (
        <Panel className={ className } viewMode={ viewMode }>

            <header className="panel-header centered">
                <SwitchViewModeButton
                    viewMode={ viewMode }
                    setViewMode={ setViewMode }
                    rules={ {
                        [ViewMode.GRID]: ViewMode.LIST,
                        [ViewMode.LIST]: ViewMode.GRID,
                    } }
                />
            </header>

            <PalettePanelContent palette={ palette } />

            <footer className="ph-1 pb-1">
                <Button 
                    className="p-0 width-fill"
                    color="transparent"
                    onClick={ addHandler }
                    icon="add"
                />
            </footer>
            
        </Panel>
    );
};

export const PalettePanelContent: React.FC<{ palette: PaletteColor[] }> = props=> {
    return (
        <div className="palette-panel-scroll">
            <div className="palette-colors-list auto-borders ph-1">
                { props.palette.map(color=>
                    <PaletteColorComponent 
                        hslaColor={ color.hslaColor }
                        id={ color.id }
                        key={ color.id }
                    />
                ) }
            </div>
        </div>
    );
};

export default PalettePanel;