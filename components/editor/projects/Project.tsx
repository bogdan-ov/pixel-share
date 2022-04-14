import React, { useEffect, useState } from "react";
import { IProjectData } from "../../../editor/workers/ProjectWorker";
import createClassName from "../../../src/hooks/createClassName";
import { MyComponent, ReactState } from "../../../utils/types";
import Button from "../../ui/buttons/Button";
import DropdownMenu, { IDropdownMenu } from "../../ui/windows/DropdownMenu";
import Tooltip from "../../ui/windows/Tooltip";
import ProjectPreviewCanvas from "./ProjectPreviewCanvas";

interface IProject {
    active: boolean
    highlight?: boolean

    onSelect: (project: IProjectData)=> void
    onDoubleClick?: (project: IProjectData)=> void

    title?: string
    dropdownMenuButtonsGroups?: IDropdownMenu["buttonsGroups"]
};
interface IProjectsGrid {
    projects: IProjectData[]

    selectedProjectId: number | null
    setSelectedProjectId: ReactState<number | null>
    highlightProjectId?: IProjectData["id"]

    onProjectSelect: IProject["onSelect"]
    onProjectDoubleClick?: IProject["onDoubleClick"]
    
    projectTitle?: string
    projectDropdownMenu?: (project: IProjectData)=> IProject["dropdownMenuButtonsGroups"]
}

const Project: React.FC<IProjectData & IProject> = props=> {
    const [imageWeight, setWeight] = useState<number>(0);
    
    const className = createClassName([
        "project list gap-2 show-on-hover-trigger",
        props.active && "active"
    ]);
    
    useEffect(()=> {

        for (const layer of props.layers) {
            const w = layer.imageData.width*layer.imageData.height
            setWeight(+(w / 8 / 1024).toFixed(2))
        }
        // 540/1024=
    }, []);
    
    return (
        <article onClick={ ()=> props.onSelect(props) } className={ className }>
            
            <div 
                title={ props.title }
                onDoubleClick={ ()=> props.onDoubleClick && props.onDoubleClick(props) }
                className="project-preview centered text-center"
            >
                <ProjectPreviewCanvas project={ props } />
            </div>

            <main className="project-content pl-2 slot justify-between">

                <div className="list">
                    {/* Name */}
                    <span className={ createClassName(["fs-middle", props.highlight && "text-underline fw-500"]) }>{ props.name }</span>
                    {/* Date */}
                    { props.date ? <div className="slot gap-1">
                        <span>{ props.date && new Date(+props.date).toLocaleDateString(undefined, { dateStyle:"long" }) }</span>
                        <span>{ props.date && new Date(+props.date).toLocaleTimeString(undefined, { timeStyle: "short" }) }</span>
                    </div> : <i className="text-muted">No date</i> }

                    <Tooltip
                        tooltip={ <p>
                            <span><span className="text-muted">Image weight</span> { imageWeight } kB</span><br/>
                            <span><span className="text-muted">Project weight</span> { imageWeight*props.layers.length } kB</span>
                        </p> }
                        placement="bottom"
                        style={{ width: "max-content" }}
                    >
                        <span className="text-muted">{ imageWeight*props.layers.length } kB</span>
                    </Tooltip>
                </div>

                { props.dropdownMenuButtonsGroups && <DropdownMenu
                    leftPlacement
                    absolute
                    buttonsGroups={ props.dropdownMenuButtonsGroups }
                >
                    <Button
                        className="show-on-hover"
                        type="fab"
                        size="middle"
                        icon="menu-dots"
                    />
                </DropdownMenu> }
                
            </main>
            
        </article>
    );
};

export const ProjectsGrid: React.FC<IProjectsGrid & MyComponent> = props=> {
    const className = createClassName([
        "projects-grid",
        props.className
    ])
    
    return (
        <div className={ className } style={ props.style }>

            { props.children }
            
            { props.projects.sort((a, b)=> (+(b.date || 0) - +(a.date || 0))).map(project=>
                <Project
                    { ...project }

                    onSelect={ props.onProjectSelect }
                    onDoubleClick={ props.onProjectDoubleClick }
                    dropdownMenuButtonsGroups={ props.projectDropdownMenu ? props.projectDropdownMenu(project) : undefined }
                    active={ props.selectedProjectId == project.id }
                    highlight={ props.highlightProjectId == project.id }
                    title={ props.projectTitle }
                    key={ project.id }
                />
            ) }

        </div>
    );
};

Project.displayName = "Project";
export default Project;