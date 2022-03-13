import React, { useState } from "react";
import useStateListener, { useJustStatesListener } from "../../../src/hooks/useStateListener";
import PaletteColorComponent from "./PaletteColorComponent";
import PaletteColor from "../../../editor/renderer/PaletteColor";
import Icon from "../../Icon";
import config from "../../../utils/config";
import { ViewMode } from "../../../utils/types";
import PaletteWorker from "../../../editor/workers/PaletteWorker";

const PalettePanel: React.FC = ()=> {
    const [palette, paletteState] = useStateListener(PaletteWorker.Palette, "palette-panel-palette");
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
    useJustStatesListener([PaletteWorker.CurrentPaletteColorId], "palette-panel-just");

    const className = [
        "palette panel flex flex-column gap-2",
        viewMode == ViewMode.LIST ? "list-view" : "grid-view"
    ].join(" ");
    
    function addHandler() {
        paletteState.set(v=> v.length < config.MAX_PALETTE_COLORS ? [
            ...v,
            new PaletteColor(Date.now(), [(Math.sin(v.length/5) + 1) / 2 * 360, 100, 50, 1])
        ] : v);
    }
    function toggleViewMode() {
        if (viewMode == ViewMode.LIST)
            setViewMode(ViewMode.GRID);
        else if (viewMode == ViewMode.GRID)
            setViewMode(ViewMode.LIST);
    }
    
    return (
        <div className={ className }>

            <header className="panel-header centered">
                <button title={ viewMode == ViewMode.LIST ? "Switch to grid view" : "Switch to list view"} onClick={ toggleViewMode } className="button small ghost">
                    <Icon icon={ viewMode == ViewMode.LIST ? "grid-view" : "list-view" } />
                </button>
            </header>

            <div className="palette-colors-list auto-borders ph-1">
                { palette.map(color=>
                    <PaletteColorComponent 
                        color={ color.hslaColor }
                        id={ color.id }
                        key={ color.id }
                    />
                ) }
            </div>

            <footer className="ph-1 pb-1">
                <button className="button color-transparent p-0 width-fill" onClick={ addHandler }>
                    <Icon icon="add" />
                </button>
            </footer>
            
        </div>
    );
};

export default PalettePanel;