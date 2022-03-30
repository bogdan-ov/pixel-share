import HistoryWorker from "../../components/editor/history/HistoryWorker";
import { EditorTriggers, EditorWindowType } from "../../states/editor-states";
import State, { state } from "../../states/State";
import config from "../../utils/config";
import { Anchor } from "../../utils/types";
import App from "../App";
import Layer from "../layers/Layer";
import PaletteColor from "../renderer/PaletteColor";
import LayersWorker, { IShortLayerData } from "./LayersWorker";
import PaletteWorker, { IShortPaletteColorData } from "./PaletteWorker";

export interface IProjectData {
    id: number
    name: string
    date: string
    
    canvasWidth: number
    canvasHeight: number
    
    palette: IShortPaletteColorData[],
    layers: IShortLayerData[],
    currentLayerId: Layer["id"],
    currentPaletteColorId: PaletteColor["id"]
    lastPaletteColorId: PaletteColor["id"]
}

class ProjectWorker {
    Name: State<string>
    Saved: State<boolean>
    
    constructor() {
        this.Name = state<string>("", "project-name");
        this.Saved = state<boolean>(false, "project-saved");
    }

    init() {
        let i = 0;
        window.addEventListener("beforeunload", (e)=> {
            if (!this.Saved.value) {
                e.preventDefault();
                e.returnValue = "Close/reload page? You didn't save your changes";
            }
        });
        EditorTriggers.Edited.listen((edited, from)=> {
            this.Saved.value = false;
            config.DEBUG && console.log(`Edited, but unsaved ${ i } ${ from }`);
            i ++;
        })
    }
    
    tryToSave() {
        if (!this.Name.value) {
            EditorTriggers.Window.trigger({
                type: EditorWindowType.SAVE_PROJECT_WINDOW
            });
        } else {
            this.saveProject(this.Name.value);
        }
    }
    
    saveProject(name: string) {
        const projectName = name.trim();
        if (!projectName) return;

        const storageProjectName = config.PROJECT_NAME_PREFIX + projectName.trim();
        
        const data: IProjectData = {
            id: Date.now(),
            name: projectName,
            date: Date.now().toString(),

            canvasWidth: App.CanvasWidth.value,
            canvasHeight: App.CanvasHeight.value,
            
            palette: PaletteWorker.getShortData(),
            layers: LayersWorker.getShortData(),
            currentLayerId: LayersWorker.CurrentLayerId.value,
            currentPaletteColorId: PaletteWorker.CurrentPaletteColorId.value,
            lastPaletteColorId: PaletteWorker.LastPaletteColorId.value
        };

        if (this.projectExists(projectName))
            // Save
            EditorTriggers.Notification.trigger({
                content: `💾 Project "${ projectName }" saved!`,
                type: "success"
            });
        else
            // Saved as new
            EditorTriggers.Notification.trigger({
                content: `💾 Project saved as "${ projectName }"!`,
                type: "success"
            });

        localStorage[storageProjectName] = JSON.stringify(data);
        this.Saved.value = true;
        this.Name.value = projectName;
    }
    saveProjectAs(name: string) {
        const projectName = name.trim();
        if (!projectName) return;

        if (this.projectExists(projectName))
            // Overwrite
            EditorTriggers.Notification.trigger({
                content: `💾 Project "${ projectName }" overwritten!`,
                type: "success"
            });
        else
            // Save as new
            this.saveProject(projectName);
    }
    openProject(name: string) {
        const storageProjectName = config.PROJECT_NAME_PREFIX + name.trim();

        if (!this.projectExists(name.trim())) {
            EditorTriggers.Notification.trigger({
                content: `😪 Can't find project with name "${ name.trim() }"...`,
                type: "danger"
            });
            return;
        }

        const data: IProjectData | null = JSON.parse(localStorage[storageProjectName]) || null;
        if(!data) {
            EditorTriggers.Notification.trigger({
                content: `🤔 Something went wrong...`,
                type: "danger"
            });

            return;
        }
        
        const projectName = data.name.trim();

        LayersWorker.setFromShortData(data.layers);
        PaletteWorker.setFromShortData(data.palette);
        LayersWorker.CurrentLayerId.value = data.currentLayerId;
        PaletteWorker.CurrentPaletteColorId.value = data.currentPaletteColorId;
        PaletteWorker.LastPaletteColorId.value = data.lastPaletteColorId || data.palette[0].id;
        App.resizeCanvas(data.canvasWidth, data.canvasHeight, Anchor.TOP_LEFT, false);

        App.initHistory();
        
        this.Name.value = projectName;
        this.Saved.value = true;
        
        EditorTriggers.Notification.trigger({
            content: `💾 "${ projectName }" opened!`,
            type: "success"
        });
    }
    deleteProject(name: string) {
        const allow = confirm(`Are you sure to delete "${ name }"?`);

        if (allow)
            localStorage.removeItem(config.PROJECT_NAME_PREFIX + name);
    }
    newProject() {
        LayersWorker.setDefaultLayers();
        PaletteWorker.setDefaultPalette();
        App.resizeCanvas(config.CANVAS_WIDTH, config.CANVAS_HEIGHT, Anchor.TOP_LEFT, false);

        App.initHistory();
        
        this.Name.value = "";
        EditorTriggers.Notification.trigger({
            content: `💾 New project created!`,
            type: "success"
        });
    }

    fetchProjects(): IProjectData[] {
        const projects = [];
        
        const keys = Object.keys(localStorage);
        for (const key of keys) {
            if (key.indexOf(config.PROJECT_NAME_PREFIX) >= 0) {
                const project: IProjectData | null = JSON.parse(localStorage[key]) || null;
                if (project) {
                    projects.push(project);
                }
            }
        }

        return projects;
    }
    
    private projectExists(name: string): boolean {
        return localStorage[config.PROJECT_NAME_PREFIX + name];
    }
}
export default new ProjectWorker();