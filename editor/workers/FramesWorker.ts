import { EditorEditedType, EditorTriggers } from "../../states/editor-states";
import State, { state } from "../../states/State";
import { safeValue } from "../../utils/utils";
import Frame from "../frames/Frame";
import LayersWorker from "./LayersWorker";

class FramesWorker {    
    Frames: State<Frame[]>
    CurrentFrameId: State<Frame["id"]>
    
    constructor() {
        this.Frames = state<Frame[]>([], "frames-worker-frames");
        this.CurrentFrameId = state<Frame["id"]>(0, "frames-worker-current-frame-id");
    }

    init() {
        this.setDefaultFrames();

        EditorTriggers.Edited.listen(()=> {
            if (!this.currentFrame) return;
            const layers = LayersWorker.normalLayers;
            
            this.Frames.set(v=> v.map(frame=> {
                if (this.frameIsCurrent(frame.id)) {
                    frame.layersData = layers.map(layer=> ({
                        id: layer.id,
                        dataUrl: layer.getDataUrl()
                    }));
                }
                
                return frame;
            }))

        });
    }

    // Control
    setCurrentFrame(id: number) {
        this.CurrentFrameId.value = id;

        if (!this.currentFrame) return;

        // Clear layers if frame's layers data is empty
        if (this.currentFrame.layersData.length <= 0) {
            for (const layer of LayersWorker.normalLayers)
                layer?.clearCanvas();
        }
        
        for (const layerData of this.currentFrame.layersData) {
            const layer = LayersWorker.getLayer(layerData.id);
            if (!layer)
                this.currentFrame.layersData = this.currentFrame.layersData.filter(l=> l.id != layerData.id);
            
            // Set image data from frame's layers data
            layer?.replaceDataUrl(layerData.dataUrl);
        }

        EditorTriggers.Edited.trigger(true);
    }

    // Frames
    addFrame() {
        this.Frames.set(v=> [...v, new Frame(Date.now())]);
    }
    get currentFrame(): Frame | null {
        return this.getFrame();
    }
    getFrame(id?: number): Frame | null {
        return this.Frames.value.find(f=> f.id == safeValue(id, this.CurrentFrameId.value)) || null;
    }
    
    // Utils
    frameIsCurrent(id: number): boolean {
        return this.CurrentFrameId.value == id;
    }
    setDefaultFrames() {
        this.Frames.value = [
            new Frame(Date.now()),
            new Frame(Date.now()+100),
        ];
        this.CurrentFrameId.value = this.Frames.value[0].id;
    }
}
export default new FramesWorker();