import React, { useEffect, useState } from "react";
import App from "../../../../editor/App";
import ExportWorker from "../../../../editor/workers/ExportWorker";
import ProjectWorker from "../../../../editor/workers/ProjectWorker";
import useStateListener from "../../../../src/hooks/useStateListener";
import { EditorWindowType } from "../../../../states/editor-states";
import config from "../../../../utils/config";
import { Extension } from "../../../../utils/types";
import { ellipsis, validateName } from "../../../../utils/utils";
import Button from "../../../ui/buttons/Button";
import Input from "../../../ui/inputs/Input";
import Window, { IWindowNeeds } from "../../../ui/windows/Window";
import ImagePreviewCanvas from "./ImagePreviewCanvas";

interface IExportImageWindow {
    
}

const ExportImageWindow: React.FC<IExportImageWindow & IWindowNeeds> = props=> {
    const [active, setActive] = useState<boolean>(false);
    const [imageScale, setImageScale] = useState<number>(1);
    const [fileName, setFileName] = useState<string>("");
    const [extension, setExtension] = useState<Extension>("png");
    const [projectName] = useStateListener(ProjectWorker.Name);
    
    const name = validateName(fileName || projectName);
    const finalWidth = Math.floor(App.CanvasWidth.value * imageScale);
    const finalHeight = Math.floor(App.CanvasHeight.value * imageScale);
    const weight: number = +(finalWidth*finalHeight/8/1024).toFixed(2);
    const nameIsValid = !!name;
    
    function onExportHandler() {
        ExportWorker.exportAsPNG(nameIsValid ? fileName : undefined, extension, imageScale);
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
        >
            <div className="flex gap-4">
                <div className="list gap-4">

                    <div className="flex gap-4">
                        <ImagePreviewCanvas />

                        <div className="list gap-2">
                            <span>Settings</span>

                            <label className="slot gap-2 justify-between">
                                <span>Scale</span>
                                <Input
                                    type="number"
                                    width={ 60 }
                                    
                                    value={ imageScale }
                                    onSubmitChange={ v=> setImageScale(+v) }

                                    min={ config.MIN_EXPORT_IMAGE_SCALE }
                                    max={ config.MAX_EXPORT_IMAGE_SCALE }
                                />
                            </label>
                            <label className="slot gap-2 justify-between">
                                <span>Extension</span>
                                <select className="select" value={ extension } onChange={ v=> setExtension(v.target.value as Extension) }>
                                    <option value="png">png</option>
                                    <option value="jpg">jpg</option>
                                </select>
                            </label>

                        </div>
                    </div>

                    <label className="list gap-1">
                        <span>File name</span>
                        <Input
                            value={ fileName }
                            onSubmitChange={ v=> setFileName(v.toString()) }
                            style={{ width: "100%" }}
                            placeholder={ name }
                        />
                    </label>

                </div>

                <div className="list gap-4 justify-between">
                    <div className="list gap-2">
                        <span>Info</span>
                        <div className="list">
                            <span>
                                <span>{ ellipsis(name || ":D", 14) }</span>
                                <span className="text-muted">.{ extension }</span>
                            </span>
                            <span className="text-muted">Weight { weight } kB</span>
                            <span className="text-muted">Final size { finalWidth }px*{ finalHeight }px</span>
                        </div>
                    </div>
                    <div className="slot gap-1">
                        <Button 
                            onClick={ onExportHandler }
                            color="blue"
                            size="fit"
                            disabled={ !nameIsValid }
                        >
                            Export!
                        </Button>
                        <Button 
                            onClick={ onCloseHandler }
                            size="fit"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
                
            </div>
        </Window>
    );
};

export default ExportImageWindow;