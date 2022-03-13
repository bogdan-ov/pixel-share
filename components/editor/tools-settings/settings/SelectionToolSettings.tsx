import React from "react";
import App from "../../../../editor/App";
import SelectionTool from "../../../../editor/tools/editing/SelectionTool";
import useStateListener from "../../../../src/hooks/useStateListener";
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
                className="tool-property"
                tooltip={ <div className="text-center">Alpha of darkness in unselected area</div> }
            >
                <div className="slot gap-2">
                    <span>Dark alpha</span>
                    <Range
                        min={ 0 }
                        max={ 100 }

                        value={ darkAlpha }
                        onChange={ v=> darkAlphaState.value = +v }
                        onInputSubmit={ v=> darkAlphaState.value = +v }
                    />
                </div>
            </Tooltip>
            
        </ToolSettingsContainer>
    );
};

export default SelectionToolSettings;