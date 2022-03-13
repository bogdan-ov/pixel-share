import React from "react";
import App from "../../../../editor/App";
import CheckerboardTool from "../../../../editor/tools/drawing/CheckerboardTool";
import useStateListener from "../../../../src/hooks/useStateListener";
import Checkbox from "../../../ui/inputs/Checkbox";
import { ToolSettingsContainer, IToolSettingsContainer } from "../ToolSettingsContainer";

const CheckerboardToolSettings: React.FC<IToolSettingsContainer> = props=> {
    const currentTool = App.currentTool as CheckerboardTool;
    const [offset, offsetState] = useStateListener(currentTool.Offset);
    
    return (
        <ToolSettingsContainer>

            <Checkbox className="tool-property" checked={ offset } onChange={ v=> offsetState.value=v }>
                <span>Offset</span>
            </Checkbox>

        </ToolSettingsContainer>
    );
};

export default CheckerboardToolSettings;