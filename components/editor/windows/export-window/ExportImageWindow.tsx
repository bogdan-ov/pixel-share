import React, { useState } from "react";
import App from "../../../../editor/App";
import ExportWorker from "../../../../editor/workers/ExportWorker";
import { EditorWindowType } from "../../../../states/editor-states";
import config from "../../../../utils/config";
import Input from "../../../ui/inputs/Input";
import Window, { IWindowNeeds } from "../../../ui/windows/Window";
import ImagePreviewCanvas from "./ImagePreviewCanvas";

interface IExportImageWindow {
    
}

const ExportImageWindow: React.FC<IExportImageWindow & IWindowNeeds> = props=> {
    const [active, setActive] = useState<boolean>(false);
    const [imageScale, setImageScale] = useState<number>(1);
    
    function onExportHandler() {
        ExportWorker.exportAsPNG("super-ass-gay-nigga", imageScale);
    }
    function onCloseHandler() {
        setActive(false);
    }
    
    return (
        <Window
            active={ active }
            setActive={ setActive }

            trigger={ EditorWindowType.EXPORT_IMAGE_WINDOW }
            title={ <span>Export image</span> }
            constrainsRef={ props.constrainsRef }

            className="export-image-window"
            minWidth={ 260 }
        ><div className="flex flex-column gap-2">

            <ImagePreviewCanvas />

            <label className="slot justify-between">
                <span>Scale</span>
                <Input 
                    value={ imageScale }
                    onChange={ v=> setImageScale(Math.floor(+v)) }
                    onSubmit={ v=> setImageScale(Math.floor(+v)) }

                    width={ 60 }
                    type="number"
                    min={ config.MIN_EXPORT_IMAGE_SCALE }
                    max={ config.MAX_EXPORT_IMAGE_SCALE }
                />
            </label>

            <span className="text-muted">{ `${ App.CanvasWidth.value * imageScale }*${ App.CanvasHeight.value * imageScale }` }</span>
            
            <div className="slot gap-1 width-fill">
                <button onClick={ onExportHandler } className="button color-blue">
                    Export!
                </button>
                <button onClick={ onCloseHandler } className="button">
                    Cancel
                </button>
            </div>
            
        </div></Window>
    );
};

export default ExportImageWindow;