import React, { useEffect, useState } from "react";
import ProjectWorker from "../../../../editor/workers/ProjectWorker";
import createClassName from "../../../../src/hooks/createClassName";
import useFetchProjects from "../../../../src/hooks/useFetchProjects";
import { ProjectsGrid } from "../../projects/Project";
import Button from "../../../ui/buttons/Button";
import AspectRatioField from "../../settings/AspectRatioField";
import { clamp } from "../../../../utils/math";
import config from "../../../../utils/config";
import Image from "next/image";
import PaletteWorker, { PalettePreset } from "../../../../editor/workers/PaletteWorker";
import useStateListener from "../../../../src/hooks/useStateListener";
import { hslaToString } from "../../../../utils/utils";
import { ReactSimpleState } from "../../../../utils/types";
import { EditorActionType, EditorTriggers, EditorWindowType } from "../../../../states/editor-states";
import Notification from "../../notification/Notification";
import FullWindow from "../../../ui/windows/FullWindow";

interface ISizeVariantButton {
    size: number
    canvasWidth: number
    canvasHeight: number
    createProject: (size: number)=> void
    setCanvasSize: (v: number)=> void
}

const WelcomeWindow: React.FC = props=> {
    const [active, setActive] = useState<boolean>(true);
    
    const [presetPalettes] = useStateListener(PaletteWorker.PresetPalettes);

    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const { projects, setProjects, fetch } = useFetchProjects();
    const [canvasWidth, setCanvasWidth] = useState<number>(64);
    const [canvasHeight, setCanvasHeight] = useState<number>(64);
    const [currentPalettePreset, setCurrentPalettePreset] = useState<PalettePreset>(presetPalettes[0]);

    const finalCanvasWidth = clamp(canvasWidth, config.MIN_CANVAS_WIDTH, config.MAX_CANVAS_WIDTH);
    const finalCanvasHeight = clamp(canvasHeight, config.MIN_CANVAS_HEIGHT, config.MAX_CANVAS_HEIGHT);
    
    useEffect(()=> {
        fetch();
    }, [])

    function createProjectHandler(size?: number) {
        ProjectWorker.newProject(size || finalCanvasWidth, size || finalCanvasHeight, currentPalettePreset);
        setActive(false);
    }
    function openProjectHandler(name: string) {
        ProjectWorker.openProject(name)
        setActive(false);
    }
    function deleteProjectHandler(name: string) {
        ProjectWorker.deleteProject(name);
        fetch();
    }

    return (
        <FullWindow 
            trigger={ EditorWindowType.WELCOME_WINDOW }
            active={ active }
            setActive={ setActive }
            className="welcome-window-wrapper"
            windowClassName="welcome-window"
        >

            <main className="content list gap-4 width-fill">
                
                <div className="flex gap-4 p-8">
                    {/* Content */}
                    <div className="list gap-4">

                        <div className="p-4">
                            <Notification color="blue">
                                <span className="badge light mr-1">Beta</span> out now! Have fun! :D
                            </Notification>
                        </div>

                        <div className="banner centered">
                            <span className="pos-abs center text-muted">Loading...</span>
                            <Image 
                                layout="fill"
                                objectFit="cover"
                                alt="Banner"
                                src="http://img2.safereactor.cc/pics/post/full/LapesDoc-Pixel-Art-7259296.png"
                            />
                            <main className="source slot justify-between">
                                <i>There also can be your art</i>
                                <a href="http://safereactor.cc/post/5126601" target="_blank" rel="noreferrer">Source</a>
                            </main>
                        </div>

                        <div className="flex">

                            <div className="list gap-8">
                                <div className="list gap-4">
                                    <h2 className="section-head">Start a project</h2>

                                    <div className="new-project-variants slot gap-2 ph-2">
                                        { [8, 16, 32, 64, 128].map((size, index)=>
                                            <SizeVariantButton
                                                size={ size }
                                                canvasWidth={ canvasWidth }
                                                canvasHeight={ canvasHeight }
                                                createProject={ createProjectHandler }
                                                setCanvasSize={ v=> { setCanvasWidth(v); setCanvasHeight(v) } }

                                                key={ size }
                                            />
                                        ) }
                                    </div>

                                    <div className="flex justify-between ph-2">
                                        
                                        <div className="list gap-2">
                                            <AspectRatioField
                                                width={ canvasWidth }
                                                height={ canvasHeight }
                                                setWidth={ setCanvasWidth }
                                                setHeight={ setCanvasHeight }
                                                style={ { maxWidth: "max-content" } }
                                            />
                                            <div className="palette-presets list gap-1">
                                                { presetPalettes.map((preset, index)=>
                                                    <PalettePreset 
                                                        currentPreset={ currentPalettePreset }
                                                        setCurrentPreset={ setCurrentPalettePreset }
                                                        colors={ preset }
                                                        key={ index }
                                                    />
                                                ) }
                                            </div>
                                        </div>

                                        <div className="list gap-1">
                                            <Button
                                                onClick={ ()=> createProjectHandler() }
                                                color="blue"
                                                size="fit"
                                                text="New project!"
                                            />
                                            <span className="text-muted">
                                                Final size { finalCanvasWidth }*{ finalCanvasHeight }
                                            </span>
                                        </div>
                                    </div>

                                </div>

                                <div className="list gap-4">
                                    <h2 className="section-head">Recent projects</h2>

                                    { projects.length > 0 ? <>
                                        <ProjectsGrid
                                            className="size-small"
                                            projects={ projects }
                                            selectedProjectId={ selectedProjectId }
                                            setSelectedProjectId={ setSelectedProjectId }
                                            onProjectSelect={ project=> setSelectedProjectId(project.id) }

                                            onProjectDoubleClick={ project=> openProjectHandler(project.name) }

                                            projectDropdownMenu={ project=> [[
                                                {
                                                    content: "Open",
                                                    handler: ()=> openProjectHandler(project.name)
                                                },
                                                {
                                                    content: "Delete",
                                                    icon: "trash",
                                                    handler: ()=> deleteProjectHandler(project.name)
                                                },
                                            ]] }
                                        />
                                    </> : <div className="no-projects m-2"><span className="text-muted">Is anyone here?...</span></div> }
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="list gap-2 p-8">

                        <div className="list gap-2">
                            <h2>Tips and tricks</h2>
                            <ul className="ml-4">
                                <li>Right-click everywhere!</li>
                                <li>Use hotkeys</li>
                                <li>Turn on music</li>
                                <li>And have fun! :D</li>
                            </ul>
                        </div>

                    </div>

                </div>
                
            </main>

            <footer className="footer list gap-2 ph-8 pb-8 mb-8">
                <span className="text-muted">(c) Pixel share - 2022-2022</span>
                <div className="slot gap-2">
                    <a href="https://vk.com/bbog908" target="_blank" rel="noreferrer" className="bogdanov">
                        <Image alt="Bogdanov" layout="fill" objectFit="cover" src="/img/bogdanov-logo.png" />
                    </a>
                    <span>- сделанно руками</span>
                </div>
            </footer>
                
        </FullWindow>
    );
};

const SizeVariantButton: React.FC<ISizeVariantButton> = props=> {
    const className = createClassName([
        "variant",
        (props.canvasWidth == props.size && props.canvasHeight == props.size) && "active"
    ])
    
    return (
        <div
            onClick={ ()=> props.setCanvasSize(props.size) }
            onDoubleClick={ ()=> props.createProject(props.size) } 
            className={ className }
        >
            <span>{ props.size }*{ props.size }</span>
        </div>
    );
};
const PalettePreset: React.FC<{ colors: PalettePreset, currentPreset: PalettePreset, setCurrentPreset: ReactSimpleState<PalettePreset> }> = props=> {

    const className = createClassName([
        "palette-preset auto-borders flex hor",
        JSON.stringify(props.colors) == JSON.stringify(props.currentPreset) && "active"
    ])
    
    return (
        <div 
            onClick={ ()=> props.setCurrentPreset(props.colors) }
            className={ className }
        >
            { props.colors.map((color, index)=>
                <div 
                    style={{ background: typeof color == "string" ? color : hslaToString(color) }}
                    className="color"
                    key={ index }
                />
            ) }
        </div>
    );
};

WelcomeWindow.displayName = "WelcomeWindow";
export default WelcomeWindow;