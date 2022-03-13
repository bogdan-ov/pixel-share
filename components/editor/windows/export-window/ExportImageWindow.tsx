import React, { useState } from "react";
import ExportWorker from "../../../../editor/workers/ExportWorker";
import { EditorWindowType } from "../../../../states/editor-states";
import config from "../../../../utils/config";
import Input from "../../../ui/inputs/Input";
import Window from "../../../ui/windows/Window";
import ImagePreviewCanvas from "./ImagePreviewCanvas";

interface IExportImageWindow {
    constrainsRef: React.RefObject<HTMLDivElement>
}

const ExportImageWindow: React.FC<IExportImageWindow> = props=> {
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
            custom
            active={ active }
            setActive={ setActive }

            trigger={ EditorWindowType.EXPORT_IMAGE }
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
                    onSubmit={ v=> setImageScale(+v) }

                    width={ 60 }
                    type="number"
                    min={ config.MIN_EXPORT_IMAGE_SCALE }
                    max={ config.MAX_EXPORT_IMAGE_SCALE }
                />
            </label>
            
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