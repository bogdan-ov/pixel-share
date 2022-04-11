import React from "react";
import App from "../../../../editor/App";
import FillTool from "../../../../editor/tools/drawing/FillTool";
import useStateListener from "../../../../src/hooks/useStateListener";
import Checkbox from "../../../ui/inputs/Checkbox";
import { ToolSettingsContainer } from "../ToolSettingsContainer";

const FillToolSettings: React.FC = React.memo(()=> {
    const currentTool = App.currentTool as FillTool;
    const [fillSameColors, fillSameColorsState] = useStateListener(currentTool.FillSameColors);
    
    return (
        <ToolSettingsContainer>

            <Checkbox
                className="tool-property"
                checked={ fillSameColors }
                onChange={ v=> fillSameColorsState.value = v }
            >
                <span>Fill same colors</span>
            </Checkbox>
            
        </ToolSettingsContainer>
    );
});

FillToolSettings.displayName = "FillToolSettings";
export default FillToolSettings;