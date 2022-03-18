import React from "react";
import App from "../../../editor/App";
import ActionWorker from "../../../editor/workers/ActionWorker";
import ProjectWorker from "../../../editor/workers/ProjectWorker";
import { EditorTriggers, EditorWindowType } from "../../../states/editor-states";
import { IContextMenuButtonsGroup } from "../../context-menu/ContextMenu";

interface IMenubarButton {
    title: string
    contextButtonsGroups: IContextMenuButtonsGroup[]
    
    // icon: keyof typeof icons
    // onClick: ()=> void
    // tooltip?: React.ReactElement

    // trigger?: EditorActionType
};

const Menubar: React.FC = React.memo(()=> {

    function pngExportHandler() {
        EditorTriggers.Window.trigger({
            type: EditorWindowType.EXPORT_IMAGE
        }, "menubar");
    }
    function undoHandler() {
        ActionWorker.undo()
    }

    function loadProjectHandler() {
        ProjectWorker.openProject();
    }
    function saveProjectHandler() {
        ProjectWorker.saveProject();
    }

    function resizeCanvas() {
        const sizePrompt = prompt("🔳 Canvas size (width*height):", `${ App.canvasWidth }*${ App.canvasHeight }`)
        if (!sizePrompt) {
            return;
        }
        const size = sizePrompt.toString().split("*");
        if (size.length != 2 || typeof (+size[0]) != "number" || typeof (+size[1]) != "number") {
            EditorTriggers.Notification.trigger({
                content: "😛 Incorrect syntax"
            })
            return;
        }

        ProjectWorker.resizeProjectCanvas(+size[0], +size[1]);
    }
    
    return (
        <div className="menubar slot gap-4">

            <div className="menubar-buttons slot height-fill gap-1">

                <MenubarButton
                    title="Project"
                    contextButtonsGroups={ [[
                        {
                            content: "Save",
                            icon: "save",
                            actionName: "save-project",
                        },
                        {
                            content: "Open",
                            icon: "open",
                            actionName: "open-project"
                        },
                    ]] }
                />
                <MenubarButton
                    title="Edit"
                    contextButtonsGroups={ [[
                        {
                            content: "Undo",
                            icon: "undo",
                            actionName: "undo",
                        }
                    ]] }
                />

                {/* // ? Resize canvas
                <MenubarButton
                    icon="rectangle"
                    tooltip={ <span>Resize canvas</span> }
                    onClick={ resizeCanvas }
                />
                // ? Open project
                <MenubarButton
                    icon="load"
                    tooltip={ <span>Load project</span> }
                    onClick={ loadProjectHandler }
                />
                // ? Save project
                <MenubarButton
                    icon="save"
                    tooltip={ <span>Save project</span> }
                    onClick={ saveProjectHandler }
                />
                // ? Undo
                <MenubarButton
                    icon="cross"
                    tooltip={ <span>Undo</span> }
                    onClick={ undoHandler }
                    trigger={ EditorActionType.UNDO }
                />
                // ? Export
                <MenubarButton
                    icon="checkmark"
                    tooltip={ <span>Export PNG</span> }
                    onClick={ pngExportHandler }
                /> */}

            </div>

        </div>
    );
});

const MenubarButton: React.FC<IMenubarButton> = props=> {

    // const controls = useAnimation();

    // useEffect(()=> {
    //     if (!props.trigger) return;

    //     EditorTriggers.Action.listen(action=> {
            
    //         if (action.type == props.trigger)
    //             controls.start({
    //                 y: [0, -2, 1, 0],
    //                 transition: {
    //                     ease: "easeInOut",
    //                     duration: .3
    //                 }
    //             });

    //     });
        
    // }, []);

    function onClickHandler(e: React.MouseEvent) {
        EditorTriggers.ContextMenu.trigger({
            title: <span className="text-muted p-1">{ props.title }</span>,
            event: e,
            buttonsGroups: props.contextButtonsGroups
        });
    }
    
    return (
        <button
            onClick={ onClickHandler }
            className="menubar-button button color-transparent"
        >
            { props.children || props.title }
        </button>
    );
};

Menubar.displayName = "Menubar";
export default Menubar;