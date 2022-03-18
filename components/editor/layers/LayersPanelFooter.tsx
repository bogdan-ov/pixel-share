import LayersWorker from "../../../editor/workers/LayersWorker";
import { EditorActionType, EditorTriggers } from "../../../states/editor-states";
import { MyComponent } from "../../../utils/types";
import Button, { IButton } from "../../ui/buttons/Button";
import TriggerNotice, { ITriggerNotice } from "../../ui/interactive/TriggerNotice";

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
            EditorTriggers.Action.trigger({ targetId: layer.id, type: EditorActionType.RENAME_LAYER });
    }
    
    return (
        <footer className="panel-footer flex items-center gap-1">
            <FooterButton
                icon="add-layer"
                tooltip={ <span>Add layer</span> }
                onClick={ addLayerHandler }
            />
            <div className="flex auto-borders hor">
                <FooterButton 
                    triggerType="Action"
                    trigger={ EditorActionType.DELETE_LAYER }
                
                    icon="delete-layer"
                    disabled={ !allowDelete }
                    tooltip={ <span>Delete current layers</span> }
                    tooltipHotkeysName="delete-layer-trigger"
                    onClick={ deleteLayerHandler }
                />
                <FooterButton
                    triggerType="Action"
                    trigger={ EditorActionType.RENAME_LAYER }
                
                    icon="rename-layer"
                    disabled={ !allowRename }
                    tooltip={ <span>Rename current layer</span> }
                    tooltipHotkeysName="rename-layer-trigger"
                    onClick={ triggerRenameLayerHandler }
                />
            </div>
        </footer>
    );
};

const FooterButton: React.FC<IButton & ITriggerNotice & MyComponent> = props=> {
    return (
        <TriggerNotice
            triggerType={ props.triggerType }
            trigger={ props.trigger }
        >
            <Button
                tooltipPlacement="top"

                ghost
                size="middle"
            
                { ...props }
            />
        </TriggerNotice>
    );
};

LayersPanelFooter.displayName = "LayersPanelFooter";
export default LayersPanelFooter;