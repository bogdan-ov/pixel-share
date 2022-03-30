import LayersWorker from "../../../../editor/workers/LayersWorker";
import { EditorActionType } from "../../../../states/editor-states";
import { MyComponent } from "../../../../utils/types";
import ActionButton, { IActionButton } from "../../../ui/buttons/ActionButton";
import Button, { IButton } from "../../../ui/buttons/Button";
import TriggerNotice, { ITriggerNotice } from "../../../ui/interactive/TriggerNotice";

const LayersPanelFooter: React.FC = ()=> {

    const allowDelete = !!LayersWorker.currentLayer && LayersWorker.normalLayers.length > 1;
    const allowRename = !!LayersWorker.currentLayer;

    return (
        <footer className="panel-footer flex items-center gap-1">
            <FooterButton
                triggerType="Action"
                trigger={ EditorActionType.ADD_LAYER }
            
                icon="add-layer"
                tooltip={ <span>Add layer</span> }
                actionName="add-layer-trigger"
            />
            <div className="flex auto-borders hor">
                <FooterButton 
                    triggerType="Action"
                    trigger={ EditorActionType.DELETE_LAYER }
                
                    icon="delete-layer"
                    disabled={ !allowDelete }
                    tooltip={ <span>Delete current layers</span> }
                    actionName="delete-layer-trigger"
                />
                <FooterButton
                    triggerType="Action"
                    trigger={ EditorActionType.RENAME_LAYER }
                
                    icon="rename-layer"
                    disabled={ !allowRename }
                    tooltip={ <span>Rename current layer</span> }
                    actionName="rename-layer-trigger"
                />
            </div>
        </footer>
    );
};

const FooterButton: React.FC<IActionButton> = props=> {
    return (
        <ActionButton
            tooltipPlacement="top"

            ghost
            size="middle"
        
            { ...props }
        />
    );
};

LayersPanelFooter.displayName = "LayersPanelFooter";
export default LayersPanelFooter;