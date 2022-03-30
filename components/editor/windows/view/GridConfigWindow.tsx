import React, { useState } from "react";
import App from "../../../../editor/App";
import ViewWorker from "../../../../editor/workers/ViewWorker";
import useStateListener from "../../../../src/hooks/useStateListener";
import { EditorWindowType } from "../../../../states/editor-states";
import Checkbox from "../../../ui/inputs/Checkbox";
import Input from "../../../ui/inputs/Input";
import Window, { IWindowNeeds } from "../../../ui/windows/Window";

const GridConfigWindow: React.FC<IWindowNeeds> = props=> {
    const [active, setActive] = useState<boolean>(false);

    const [gridEnabled, gridEnabledState] = useStateListener(ViewWorker.GridEnabled);
    const [gridWidth, gridWidthState] = useStateListener(ViewWorker.GridWidth);
    const [gridHeight, gridHeightState] = useStateListener(ViewWorker.GridHeight);
    const [gridColor, gridColorState] = useStateListener(ViewWorker.GridColor);

    const [canvasWidth] = useStateListener(App.CanvasWidth);
    const [canvasHeight] = useStateListener(App.CanvasHeight);
    
    return (
        <Window
            trigger={ EditorWindowType.GRID_CONFIG_WINDOW }

            title={ <span className="text-muted">Grid configuration</span> }
            custom
            active={ active }
            setActive={ setActive }

            constrainsRef={ props.constrainsRef }
        >
            <div className="list gap-2">
                <Checkbox
                    className="reversed width-fill justify-between"
                    checked={ gridEnabled }
                    onChange={ v=> gridEnabledState.value = v }
                >
                    <span>Enabled</span>
                </Checkbox>

                <div className="slot width-fill justify-between">
                    <span>Color</span>
                    <input 
                        type="color"
                        value={ gridColor }
                        onChange={ e=> gridColorState.value = e.target.value }
                    />
                </div>

                <div className="list gap-1">
                    <span className="text-muted">Width / height</span>
                    <div className="slot width-fill gap-1">
                        <Input 
                            className="width-fill"
                            
                            type="number"
                            min={ 1 }
                            max={ canvasWidth }
                            value={ gridWidth }
                            onSubmitChange={ v=> gridWidthState.value = +v }
                        />
                        <Input 
                            className="width-fill"
                        
                            type="number"
                            min={ 1 }
                            max={ canvasHeight }
                            value={ gridHeight }
                            onSubmitChange={ v=> gridHeightState.value = +v }
                        />
                    </div>
                </div>
                
            </div>
        </Window>
    );
};

GridConfigWindow.displayName = "GridConfigWindow";
export default GridConfigWindow;