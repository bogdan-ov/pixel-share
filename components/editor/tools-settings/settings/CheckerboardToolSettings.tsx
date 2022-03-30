import React from "react";
import App from "../../../../editor/App";
import CheckerboardTool from "../../../../editor/tools/drawing/CheckerboardTool";
import useStateListener from "../../../../src/hooks/useStateListener";
import Checkbox from "../../../ui/inputs/Checkbox";
import Input from "../../../ui/inputs/Input";
import { ToolSettingsContainer, IToolSettingsContainer } from "../ToolSettingsContainer";

const CheckerboardToolSettings: React.FC<IToolSettingsContainer> = props=> {
    const currentTool = App.currentTool as CheckerboardTool;
    const [offset, offsetState] = useStateListener(currentTool.Offset);
    const [erase, eraseState] = useStateListener(currentTool.Erase);
    const [cellsSize, cellsSizeState] = useStateListener(currentTool.CellsSize);
    
    return (
        <ToolSettingsContainer>

            <Checkbox className="tool-property" checked={ offset } onChange={ v=> offsetState.value=v }>
                <span>Offset</span>
            </Checkbox>
            <Checkbox className="tool-property" checked={ erase } onChange={ v=> eraseState.value=v }>
                <span>Erase</span>
            </Checkbox>
            <hr className="vertical" />
            <label className="tool-property slot gap-2 group-box">
                <span>Cells size</span>
                <Input
                    type="number"
                
                    value={ cellsSize }
                    onChange={ v=> cellsSizeState.value = +v }
                    onSubmit={ v=> cellsSizeState.value = +v }
                    min={ 1 }
                    max={ 20 }
                    width={ 60 }
                />
            </label>

        </ToolSettingsContainer>
    );
};

export default CheckerboardToolSettings;