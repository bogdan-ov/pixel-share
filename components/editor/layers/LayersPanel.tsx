import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import React from "react";
import Layer from "../../../editor/layers/Layer";
import LayersWorker from "../../../editor/workers/LayersWorker";
import useStateListener, { useJustStatesListener } from "../../../src/hooks/useStateListener";
import { EditorActionType, EditorTriggers } from "../../../states/editor-states";
import { ActionButton } from "../../buttons/Buttons";
import LayerComponent from "./LayerComponent";

const LayersPanel: React.FC = React.memo(()=> {

    const [layers] = useStateListener(LayersWorker.Layers, "layers-panel-layers");
    useJustStatesListener([LayersWorker.CurrentLayerId], "layers-panel-just");
    
    return (
        <div className="layers-panel panel flex flex-column">

            <main className="layers-panel-content flex flex-column scrollable height-fill">

                <header className="panel-header slot justify-between">
                    <span>Layers</span>
                </header>

                <LayersList layers={ layers } />
                
            </main>

            <LayersPanelFooter />
                
        </div>
    );
});

const LayersList: React.FC<{ layers: Layer[] }> = props=> {
    
    return (
        <div
            className="layers-list ph-2 pb-2 flex flex-column"
        >
            <AnimateSharedLayout>
                { props.layers.filter(l=> !l.ghost).map(layer=>
                    <motion.div layout key={ layer.id }>
                        <LayerComponent value={ layer } { ...layer } />
                    </motion.div>
                ) }
            </AnimateSharedLayout>
        </div>
    );
};

const LayersPanelFooter: React.FC = ()=> {

    const allowDelete = !!LayersWorker.currentLayer && LayersWorker.normalLayers.length > 1;
    const allowRename = !!LayersWorker.currentLayer;
    
    function addLayerHandler() {
        LayersWorker.addLayer("New layer");
    }
    function deleteLayerHandler() {
        LayersWorker.deleteLayer(LayersWorker.CurrentLayerId.value);
    }
    function triggerRenameLayerHandler() {
        const layer = LayersWorker.currentLayer;
        if (layer)
            EditorTriggers.Action.trigger({ targetId: layer.id, type: EditorActionType.RENAME_LAYER});
    }
    
    return (
        <footer className="panel-footer flex items-center gap-1">
            <ActionButton 
                ghost
                title="Add layer"
                onClick={ addLayerHandler }
                icon="add-layer"
            />
            <div className="flex auto-borders hor">
                <ActionButton 
                    ghost
                    disabled={ !allowDelete }
                    title="Delete current layers"
                    onClick={ deleteLayerHandler }
                    icon="delete-layer"
                />
                <ActionButton
                    ghost
                    disabled={ !allowRename }
                    title="Rename current layer"
                    onClick={ triggerRenameLayerHandler }
                    icon="rename-layer"
                />
            </div>
        </footer>
    );
};

LayersPanel.displayName = "LayersPanel";
export default LayersPanel;