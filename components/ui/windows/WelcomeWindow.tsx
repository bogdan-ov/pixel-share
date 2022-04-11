import React, { useEffect, useState } from "react";
import ProjectWorker from "../../../editor/workers/ProjectWorker";
import createClassName from "../../../src/hooks/createClassName";
import useFetchProjects from "../../../src/hooks/useFetchProjects";
import { ProjectsGrid } from "../../editor/projects/Project";
import logo_img from "../../../public/img/logo.png";
import bogdanovLogo_img from "../../../public/img/bogdanov-logo.png";
import Input from "../inputs/Input";
import Button from "../buttons/Button";
import AspectRatioField from "../../editor/settings/AspectRatioField";
import { clamp } from "../../../utils/math";
import config from "../../../utils/config";
import Image from "next/image";

interface ISizeVariantButton {
    size: number
    canvasWidth: number
    canvasHeight: number
    createProject: (size: number)=> void
    setCanvasSize: (v: number)=> void
}

const WelcomeWindow: React.FC = ()=> {
    const [active, setActive] = useState<boolean>(true);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const { projects, setProjects, fetch } = useFetchProjects();
    const [canvasWidth, setCanvasWidth] = useState<number>(64);
    const [canvasHeight, setCanvasHeight] = useState<number>(64);

    const wrapperClassName = createClassName([
        "welcome-window-wrapper",
    ]);

    const finalCanvasWidth = clamp(canvasWidth, config.MIN_CANVAS_WIDTH, config.MAX_CANVAS_WIDTH);
    const finalCanvasHeight = clamp(canvasHeight, config.MIN_CANVAS_HEIGHT, config.MAX_CANVAS_HEIGHT);
    
    useEffect(()=> {
        fetch();
    }, [])

    function createProjectHandler(size?: number) {
        ProjectWorker.newProject(size || finalCanvasWidth, size || finalCanvasHeight);
        setActive(false);
    }
    function openProjectHandler(name: string) {
        ProjectWorker.openProject(name)
        setActive(false);
    }

    return active ? (
        <div className={ wrapperClassName }>

            <div className="welcome-window">

                <main className="content list gap-4">
                    <div className="logos slot">
                        <div className="logo">
                            <Image alt="Logo" src={ logo_img } layout="fill" objectFit="cover" />
                        </div>
                        <span>Pixel share! <span className="text-muted">
                            <a href="https://vk.com/bbog908" target="_blank" rel="noreferrer">Bogdanov</a> made it :D
                        </span></span>
                    </div>
                    
                    <div className="list gap-4">

                        <div className="banner centered">
                            <i>There can be your art...</i>
                        </div>

                        <div className="flex">

                            <div className="list gap-8">
                                <div className="list gap-4 p-2">
                                    <h2>Start project</h2>

                                    <div className="new-project-variants slot gap-2">
                                        { [8, 16, 32, 64, 128].map(size=>
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

                                    <div className="flex justify-between">
                                        
                                        <AspectRatioField
                                            width={ canvasWidth }
                                            height={ canvasHeight }
                                            setWidth={ setCanvasWidth }
                                            setHeight={ setCanvasHeight }
                                            style={ { maxWidth: "max-content" } }
                                        />

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
                                    <h2 className="ph-2">Recent projects</h2>

                                    { projects.length > 0 ? <>
                                        <ProjectsGrid
                                            className="size-small"
                                            projects={ projects }
                                            selectedProjectId={ selectedProjectId }
                                            setSelectedProjectId={ setSelectedProjectId }
                                            onProjectSelect={ project=> setSelectedProjectId(project.id) }

                                            onProjectDoubleClick={ project=> openProjectHandler(project.name) }
                                        />
                                    </> : <div className="no-projects m-2"><span className="text-muted">Is anyone here?...</span></div> }
                                </div>
                            </div>

                        </div>

                    </div>
                    
                </main>

                <footer className="footer list gap-2 mt-8">
                    <span className="text-muted" style={{ transform: "translateX(6px)" }}>(c) Pixel share - i don't have any rights</span>
                    <div className="bogdanov">
                        <Image alt="Bogdanov" layout="fill" objectFit="cover" src={ bogdanovLogo_img } />
                    </div>
                </footer>
                
            </div>

        </div>
    ) : <></>;
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

WelcomeWindow.displayName = "WelcomeWindow";
export default WelcomeWindow;