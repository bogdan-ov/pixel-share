import React, { useState } from "react";
import App from "../../../../editor/App";
import ViewWorker from "../../../../editor/workers/ViewWorker";
import useStateListener from "../../../../src/hooks/useStateListener";
import { EditorWindowType } from "../../../../states/editor-states";
import config from "../../../../utils/config";
import { clamp } from "../../../../utils/math";
import { HSLA, ReactState } from "../../../../utils/types";
import Button from "../../../ui/buttons/Button";
import Checkbox from "../../../ui/inputs/Checkbox";
import Input from "../../../ui/inputs/Input";
import ColorPicker from "../../../ui/utils/ColorPicker";
import Window, { IWindowNeeds } from "../../../ui/windows/Window";
import AspectRatioField from "../../settings/AspectRatioField";

const GridConfigWindow: React.FC<IWindowNeeds> = props=> {
    const [active, setActive] = useState<boolean>(false);

    const [gridEnabled, gridEnabledState] = useStateListener(ViewWorker.GridEnabled);
    const [gridWidth, gridWidthState] = useStateListener(ViewWorker.GridWidth);
    const [gridHeight, gridHeightState] = useStateListener(ViewWorker.GridHeight);
    const [gridColor, gridColorState] = useStateListener(ViewWorker.GridColor);
    const [lastGridColor, setLastGridColor] = useState<HSLA>(ViewWorker.GridColor.value);
    const [aspect, setAspect] = useState<number>(ViewWorker.GridWidth.value / ViewWorker.GridHeight.value);

    const [canvasWidth] = useStateListener(App.CanvasWidth);
    const [canvasHeight] = useStateListener(App.CanvasHeight);
    
    function resetHandler() {
        setAspect(1)
        gridWidthState.value = config.INIT_GRID_WIDTH;
        gridHeightState.value = config.INIT_GRID_HEIGHT;
        gridColorState.value = config.INIT_GRID_COLOR;
    }
    
    return (
        <Window
            trigger={ EditorWindowType.GRID_CONFIG_WINDOW }

            title={ <span className="text-muted">Grid configuration (Preview)</span> }
            active={ active }
            setActive={ setActive }

            constrainsRef={ props.constrainsRef }
        >
            <div className="flex gap-4 pt-1 height-fill">
                <div className="list justify-between">
                    <div className="list gap-4">
                        <Checkbox
                            className=""
                            checked={ gridEnabled }
                            onChange={ v=> gridEnabledState.value = v }
                        >
                            <span>Enabled</span>
                        </Checkbox>

                        <AspectRatioField
                            width={ gridWidth }
                            height={ gridHeight }
                            setWidth={ v=> gridWidthState.value = Math.floor(clamp(v, 1, canvasWidth)) }
                            setHeight={ v=> gridHeightState.value = Math.floor(clamp(v as number, 1, canvasHeight)) }

                            aspect={ aspect }
                            setAspect={ setAspect }
                        />
                        
                    </div>

                    <div className="slot gap-1">
                        <Button
                            onClick={ ()=> setActive(false) }
                            className="fit"
                            color="blue"
                        >
                            Apply
                        </Button>
                        <Button
                            onClick={ resetHandler }
                        >
                            Reset
                        </Button>
                    </div>
                </div>

                <div className="">
                    <ColorPicker
                        size={ 120 }
                        short
                        lastColor={ lastGridColor }
                        newColor={ gridColor }
                        setNewColor={ v=> {
                            if (typeof v == "function")
                                gridColorState.value = v(gridColorState.value);
                            else
                                gridColorState.value = v;
                        } }
                    />
                </div>

            </div>
        </Window>
    );
};

GridConfigWindow.displayName = "GridConfigWindow";
export default GridConfigWindow;