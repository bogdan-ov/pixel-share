import React from "react";
import App from "../../../editor/App";
import { ToolType } from "../../../editor/tools";
import PaletteWorker from "../../../editor/workers/PaletteWorker";
import useStateListener from "../../../src/hooks/useStateListener";
import CheckerboardToolSettings from "./settings/CheckerboardToolSettings";
import FillToolSettings from "./settings/FillToolSettings";
import PenToolSettings from "./settings/PenToolSettings";
import RectangleToolSettings from "./settings/RectangleToolSettings";
import ResizableToolSettings from "./settings/ResizableToolSettings";
import SelectionToolSettings from "./settings/SelectionToolSettings";
import { CurrentColorsIndicator } from "./ToolSettingsContainer";

const ToolSettings: React.FC = (()=> {

    const [currentToolType] = useStateListener(App.CurrentToolType, "tool-settings-current-tool");
    const [] = useStateListener(PaletteWorker.CurrentPaletteColorId);
    
    return (
        <header className="tool-settings slot justify-between panel">

            <main className="tool-settings-content slot gap-4 pos-abs" key={ ToolType[currentToolType] }>
                <CurrentColorsIndicator 
                    alpha={ !App.currentTool.colorable }
                />
                <Settings currentToolType={ currentToolType } />
            </main>
            
        </header>
    );
});

const Settings: React.FC<{ currentToolType: ToolType, empty?: React.ReactElement }> = React.memo(props=> {

    const settingsComponents = [
        //? Resizable tools
        ()=> App.currentTool.resizable ? <ResizableToolSettings /> : undefined,
        // Tools
        ()=> {
            switch (props.currentToolType) {
                //? Pen tool
                case ToolType.PEN:
                    return <PenToolSettings />;
                //? Checkerboard tool
                case ToolType.CHECKERBOARD:
                    return <CheckerboardToolSettings />;
                //? Rectangle tool
                case ToolType.RECTANGLE:
                    return <RectangleToolSettings />
                //? Selection tool
                case ToolType.SELECTION:
                    return <SelectionToolSettings />
                //? Fill tool
                case ToolType.FILL:
                    return <FillToolSettings />
                default:
                    if (!App.currentTool.resizable)
                        return props.empty;
                    else 
                        return undefined;
            }
        }
    ]
    
    return <>{
        settingsComponents.map((Comp, index)=>
            // @ts-ignore
            Comp() && <Comp key={ index } />
        )
    }</>;
});

ToolSettings.displayName = "ToolSettings";
Settings.displayName = "Settings";
export { Settings }
export default ToolSettings;