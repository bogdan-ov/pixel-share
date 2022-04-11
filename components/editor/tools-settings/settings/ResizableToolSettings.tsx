import App from "../../../../editor/App";
import useStateListener from "../../../../src/hooks/useStateListener";
import Range from "../../../ui/inputs/Range";
import Tooltip from "../../../ui/windows/Tooltip";
import { IToolSettingsContainer, ToolSettingsContainer } from "../ToolSettingsContainer";

const ResizableToolSettings: React.FC<IToolSettingsContainer> = ()=> {
    const [size, sizeState] = useStateListener(App.ToolsSize);
    
    return (
        <ToolSettingsContainer>
            <Tooltip
                style={ { height: "100%" } }
                tooltip={ <span>Tool size</span> }
                placement="bottom"
                offset={ 20 }
            >
                <Range
                    min={ 1 }
                    max={ 32 }
                    inputMax={ 100 }
                
                    className="tool-property"
                    rangeStyle={ { width: 120 } }
                
                    value={ size }
                    onInputSubmit={ v=> sizeState.set(()=> +v) }
                    onChange={ value=> sizeState.value = +value }
                />
            </Tooltip>
        </ToolSettingsContainer>
    );
};

export default ResizableToolSettings;