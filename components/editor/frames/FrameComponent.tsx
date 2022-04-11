import React, { useEffect, useState } from "react";
import Frame from "../../../editor/frames/Frame";
import FramesWorker from "../../../editor/workers/FramesWorker";
import LayersWorker from "../../../editor/workers/LayersWorker";
import createClassName from "../../../src/hooks/createClassName";
import { EditorEditedType, EditorTriggers, IEditorEditedTrigger } from "../../../states/editor-states";

interface IFrameComponent {
    id: Frame["id"]
    layersData: Frame["layersData"]
    index: number
}

const FrameComponent: React.FC<IFrameComponent> = props=> {
    const [blob, setBlob] = useState<string>("");
    const className = createClassName([
        "frame flex",
        FramesWorker.frameIsCurrent(props.id) && "active"
    ]);

    useEffect(()=> {

        const unlistenEdited = EditorTriggers.Edited.listen(editedListener);

        return ()=> {
            unlistenEdited();
        }
        
    }, []);

    function editedListener(edited: IEditorEditedTrigger) {
        const frame = FramesWorker.getFrame(props.id);
        if (frame)
            LayersWorker.makeBlobFromDataUrls(frame.layersData.map(l=> l.dataUrl))
                .then(b=> setBlob(b));
    }

    function onClickHandler() {
        FramesWorker.setCurrentFrame(props.id);
    }
    
    return (
        <div className={ className } onClick={ onClickHandler }>
            <div className="frame-blob-wrapper">
                { blob && <img className="frame-blob" src={ blob } /> }
            </div>
            <div className="index fs-small">{ props.index }</div>
        </div>
    );
};

FrameComponent.displayName = "FrameComponent";
export default FrameComponent;