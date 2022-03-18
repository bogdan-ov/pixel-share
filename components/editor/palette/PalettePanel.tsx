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

const PalettePanel: React.FC = ()=> {
    const [palette, paletteState] = useStateListener(PaletteWorker.Palette, "palette-panel-palette");
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
    useJustStatesListener([PaletteWorker.CurrentPaletteColorId], "palette-panel-just");

    const className = createClassName([
        "palette-panel flex flex-column gap-2"
    ]);
    
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

export default PalettePanel;