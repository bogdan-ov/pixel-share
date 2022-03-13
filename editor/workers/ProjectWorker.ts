import { EditorTriggers } from "../../states/editor-states";
import State, { state } from "../../states/State";
import App from "../App";
import LayersWorker from "./LayersWorker";
import PaletteWorker from "./PaletteWorker";

class ProjectWorker {
    Name: State<string>
    Saved: State<boolean>
    
    constructor() {
        this.Name = state<string>("pr", "project-name");
        this.Saved = state<boolean>(false, "project-saved");
    }

    init() {

    }

    resizeProjectCanvas(width: number, height: number) {
        if (width <= 0 || height <= 0) {
            EditorTriggers.Notification.trigger({
                content: "❌ Too small!",
                type: "danger"
            });
            return;
        }
        if (width >= 900 || height >= 900) {
            EditorTriggers.Notification.trigger({
                content: "❌ Too large!",
                type: "danger"
            });
            return;
        }

        App.canvasWidth = width;
        App.canvasHeight = height;

        LayersWorker.updateLayersAspect();
        LayersWorker.rerenderLayersElements();
    }
    saveProject() {
        const namePrompt = prompt("💾 Save project as...");
        if (!namePrompt)
            return;
        const projectName = namePrompt.toString();
        
        const data = {
            canvasWidth: App.canvasWidth,
            canvasHeight: App.canvasHeight,
            name: projectName,
            palette: PaletteWorker.getShortData(),
            layers: LayersWorker.getShortData(),
            currentLayerId: LayersWorker.CurrentLayerId.value,
            currentPaletteColorId: PaletteWorker.CurrentPaletteColorId.value
        };
        
        this.Name.value = projectName;

        if (localStorage[projectName])
            // Overwritten
            EditorTriggers.Notification.trigger({
                content: `💾 Project overwritten!`,
                type: "success"
            });
        else
            // Saved as new
            EditorTriggers.Notification.trigger({
                content: `💾 Project saved as "${ projectName }"!`,
                type: "success"
            });

        localStorage[projectName] = JSON.stringify(data);
    }
    loadProject() {
        const namePrompt = prompt("💾 Load project:");
        if (!namePrompt)
            return;
        const projectName = namePrompt.toString();

        if (!localStorage[projectName]) {
            EditorTriggers.Notification.trigger({
                content: `😪 Can't find project with name "${ projectName }"...`,
                type: "danger"
            });
            return;
        }

        const data = JSON.parse(localStorage[projectName]);

        App.canvasWidth = data.canvasWidth;
        App.canvasHeight = data.canvasHeight;
        LayersWorker.setFromShortData(data.layers);
        PaletteWorker.setFromShortData(data.palette);
        LayersWorker.CurrentLayerId.value = data.currentLayerId;
        PaletteWorker.CurrentPaletteColorId.value = data.currentPaletteColorId;
        LayersWorker.updateLayersAspect();
        
        EditorTriggers.Notification.trigger({
            content: `💾 Project loaded!`,
            type: "success"
        });
    }
}
export default new ProjectWorker();