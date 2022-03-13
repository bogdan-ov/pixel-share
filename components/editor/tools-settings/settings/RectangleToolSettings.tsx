import React from "react";
import App from "../../../../editor/App";
import RectangleTool from "../../../../editor/tools/drawing/RectangleTool";
import useStateListener from "../../../../src/hooks/useStateListener";
import Checkbox from "../../../ui/inputs/Checkbox";
import { IToolSettingsContainer, ToolSettingsContainer } from "../ToolSettingsContainer";

const RectangleToolSettings: React.FC<IToolSettingsContainer> = React.memo(props=> {
    const currentTool = App.currentTool as RectangleTool; 
    const [roundedCorners, roundedCornersState] = useStateListener(currentTool.RoundedCorners);
    
    return (
        <ToolSettingsContainer>

            <Checkbox className="tool-property" checked={ roundedCorners } onChange={ v=> roundedCornersState.value=v }>
                <span>Rounded corners</span>
            </Checkbox>
            
        </ToolSettingsContainer>
    );
});

RectangleToolSettings.displayName = "RectangleToolSettings";
export default RectangleToolSettings;