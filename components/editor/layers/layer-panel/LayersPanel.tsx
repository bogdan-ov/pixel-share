import { AnimateSharedLayout, motion } from "framer-motion";
import React, { useState } from "react";
import Layer from "../../../../editor/layers/Layer";
import LayersWorker from "../../../../editor/workers/LayersWorker";
import createClassName from "../../../../src/hooks/createClassName";
import useStateListener, { useJustStatesListener } from "../../../../src/hooks/useStateListener";
import config from "../../../../utils/config";
import { ViewMode } from "../../../../utils/types";
import Panel, { SwitchViewModeButton } from "../../../ui/panels/Panel";
import LayerComponent from "../LayerComponent";
import LayersPanelFooter from "./LayersPanelFooter";
import LayersPanelHeader from "./LayersPanelHeader";

const LayersPanel: React.FC = React.memo(()=> {
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
    const [layers] = useStateListener(LayersWorker.Layers, "layers-panel-layers");
    useJustStatesListener([LayersWorker.CurrentLayerId], "layers-panel-just");

    const muchLayers = layers.length >= config.MAX_LAYERS;
    
    return (
        <Panel className="layers-panel flex flex-column" viewMode={ viewMode }>

            <LayersPanelHeader />

            <main className="layers-panel-content flex flex-column scrollable height-fill">

                <header className="panel-header slot justify-between show-on-hover-trigger">
                    <span className="text-muted">
                        <span>Layers</span>&#160;
                        <span 
                            style={ muchLayers ? { opacity: 1 } : {}}
                            className={ createClassName(["show-on-hover trans", muchLayers && "text-red fw-700"]) }
                        >({ LayersWorker.normalLayers.length })</span>
                    </span>
                    <SwitchViewModeButton
                        className="show-on-hover"
                        viewMode={ viewMode }
                        setViewMode={ setViewMode }
                        rules={ {
                            [ViewMode.LIST]: ViewMode.SHORT_LIST,
                            [ViewMode.SHORT_LIST]: ViewMode.LIST,
                        } }

                        tooltipPlacement="left"
                    />
                </header>

                <LayersList layers={ layers } />
                
            </main>

            <LayersPanelFooter />
                
        </Panel>
    );
});

const LayersList: React.FC<{ layers: Layer[] }> = props=> {
    
    return (
        <div
            className="layers-list ph-2 pb-2 flex flex-column"
        >
            { props.layers.filter(l=> !l.ghost).map(layer=>
                <LayerComponent key={ layer.id } value={ layer } { ...layer } />
            ) }
        </div>
    );
};

LayersPanel.displayName = "LayersPanel";
export default LayersPanel;