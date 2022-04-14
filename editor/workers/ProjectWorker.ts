import HistoryWorker from "../../components/editor/history/HistoryWorker";
import { EditorActionType, EditorTriggers, EditorWindowType } from "../../states/editor-states";
import State, { state } from "../../states/State";
import config from "../../utils/config";
import { Anchor } from "../../utils/types";
import { validateName } from "../../utils/utils";
import App from "../App";
import Layer from "../layers/Layer";
import PaletteColor from "../renderer/PaletteColor";
import { ToolType } from "../tools";
import LayersWorker, { IShortLayerData } from "./LayersWorker";
import PaletteWorker, { IShortPaletteColorData, PalettePreset } from "./PaletteWorker";
import SelectionWorker from "./SelectionWorker";

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
        window.addEventListener("beforeunload", (e)=> {
            if (!this.Saved.value && !config.DEBUG) {
                e.preventDefault();
                e.returnValue = "Close/reload page? You didn't save your changes";
            }
        });
        EditorTriggers.Edited.listen(()=> {
            this.Saved.value = false;
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
        const projectName = validateName(name || this.Name.value);
        if (!projectName) return;

        const storageProjectName = config.PROJECT_NAME_PREFIX + projectName;
        
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
            EditorTriggers.Notification1.trigger({
                content: `💾 Project "${ projectName }" saved!`,
                color: "blue"
            });
        else
            // Saved as new
            EditorTriggers.Notification1.trigger({
                content: `💾 Project saved as "${ projectName }"!`,
                color: "blue"
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
            EditorTriggers.Notification1.trigger({
                content: `💾 Project "${ projectName }" overwritten!`,
            });
        else
            // Save as new
            this.saveProject(projectName);
    }
    openProject(name: string) {
        const storageProjectName = config.PROJECT_NAME_PREFIX + name.trim();

        if (!this.projectExists(name.trim())) {
            EditorTriggers.Notification1.trigger({
                content: `😪 Can't find project with name "${ name.trim() }"...`,
                color: "red"
            });
            return;
        }

        const data: IProjectData | null = JSON.parse(localStorage[storageProjectName]) || null;
        if(!data) {
            EditorTriggers.Notification1.trigger({
                content: `🤔 Something went wrong...`,
                color: "red"
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
        
        EditorTriggers.Action.trigger({
            type: EditorActionType.START_APP
        })
        EditorTriggers.Notification1.trigger({
            content: `💾 "${ projectName }" opened!`,
            color: "blue"
        });
    }
    deleteProject(name: string) {
        const sure = confirm(`Are you sure to delete "${ name }"?`);

        if (sure)
            localStorage.removeItem(config.PROJECT_NAME_PREFIX + name);
    }
    newProject(canvasWidth?: number, canvasHeight?: number, palettePreset?: PalettePreset) {
        LayersWorker.setDefaultLayers();
        PaletteWorker.setDefaultPalette(palettePreset);
        App.CurrentToolType.value = ToolType.PEN;
        SelectionWorker.selection.active = false;

        App.resizeCanvas(
            canvasWidth || config.INIT_CANVAS_WIDTH,
            canvasHeight || config.INIT_CANVAS_HEIGHT,
            Anchor.TOP_LEFT, false
        );
        
        App.initHistory();
        
        this.Name.value = "";
        EditorTriggers.Action.trigger({
            type: EditorActionType.START_APP
        })
        EditorTriggers.Notification1.trigger({
            content: `💾 New project created!`,
            color: "blue"
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