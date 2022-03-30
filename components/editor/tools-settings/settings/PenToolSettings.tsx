import React from "react";
import App from "../../../../editor/App";
import PenTool from "../../../../editor/tools/drawing/PenTool";
import useStateListener from "../../../../src/hooks/useStateListener";
import Checkbox from "../../../ui/inputs/Checkbox";
import Tooltip from "../../../ui/windows/Tooltip";
import { ToolSettingsContainer, IToolSettingsContainer } from "../ToolSettingsContainer";

const PenToolSettings: React.FC<IToolSettingsContainer> = React.memo(()=> {
    const currentTool = App.currentTool as PenTool;
    const [pixelPerfect, pixelPerfectState] = useStateListener(currentTool.PixelPerfect);
    const [autoPick, autoPickState] = useStateListener(currentTool.AutoPick);
    
    return (
        <ToolSettingsContainer>

            <Tooltip
                placement="bottom"
                maxWidth={ 160 }
                tooltip={ <div className="text-center">Removes all sharp pixels from your line</div> }
            >
                <Checkbox className="tool-property" checked={ pixelPerfect } onChange={ v=> pixelPerfectState.value = v }>
                    <span>Pixel perfect</span>
                </Checkbox>
            </Tooltip>
            <Tooltip
                placement="bottom"
                maxWidth={ 160 }
                tooltip={ <div className="text-center">Auto pick color you click</div> }
            >
                <Checkbox className="tool-property" checked={ autoPick } onChange={ v=> autoPickState.value = v }>
                    <span>Auto pick</span>
                </Checkbox>
            </Tooltip>
            
        </ToolSettingsContainer>
    );
});

PenToolSettings.displayName = "PenToolSettings";
export default PenToolSettings;