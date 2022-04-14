import React from "react";
import App from "../../../../editor/App";
import SelectionTool from "../../../../editor/tools/editing/SelectionTool";
import useStateListener from "../../../../src/hooks/useStateListener";
import { EditorEditedType } from "../../../../states/editor-states";
import ActionButton from "../../../ui/buttons/ActionButton";
import Button from "../../../ui/buttons/Button";
import Range from "../../../ui/inputs/Range";
import Tooltip from "../../../ui/windows/Tooltip";
import { ToolSettingsContainer } from "../ToolSettingsContainer";

const SelectionToolSettings: React.FC = ()=> {
    const currentTool = App.currentTool as SelectionTool;
    const [darkAlpha, darkAlphaState] = useStateListener(currentTool.DarkAlpha);
    
    return (
        <ToolSettingsContainer>

            <Tooltip
                maxWidth={ 160 }
                placement="bottom"
                className="tool-property hidden"
                tooltip={ <div className="text-center">Alpha of darkness in unselected area</div> }
            >
                <label className="slot gap-2 group-box">
                    <span>Darkness alpha</span>
                    <Range
                        min={ 0 }
                        max={ 100 }

                        value={ darkAlpha }
                        onChange={ v=> darkAlphaState.value = +v }
                        onInputSubmit={ v=> darkAlphaState.value = +v }
                        disableGroupBoxClass
                    />
                </label>
            </Tooltip>

            <hr className="vertical" />

            <div className="slot gap-4">
                <ActionButton
                    type="link"
                    text="Copy"
                    className="tool-property"
                    actionName="copy-image-data"
                    trigger={ EditorEditedType.SELECTION_COPY }
                    triggerType={ "Edited" }

                    tooltip={ <span>Copy selection</span> }
                    tooltipPlacement="bottom"
                />
                <ActionButton
                    type="link"
                    text="Paste"
                    className="tool-property"
                    actionName="paste-image-data"
                    trigger={ EditorEditedType.SELECTION_PASTE }
                    triggerType={ "Edited" }
                    
                    tooltip={ <span>Paste selection</span> }
                    tooltipPlacement="bottom"
                />
            </div>
            
        </ToolSettingsContainer>
    );
};

export default SelectionToolSettings;