import React from "react";
import { IProjectData } from "../../../editor/workers/ProjectWorker";
import createClassName from "../../../src/hooks/createClassName";
import { ReactState } from "../../../utils/types";
import Button from "../../ui/buttons/Button";
import DropdownMenu, { IDropdownMenu } from "../../ui/windows/DropdownMenu";
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
    const className = createClassName([
        "project list gap-2 show-on-hover-trigger",
        props.active && "active"
    ]);
    
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
                </div>

                { props.dropdownMenuButtonsGroups && <DropdownMenu
                    leftPlacement
                    absolute
                    buttonsGroups={ props.dropdownMenuButtonsGroups }
                >
                    <Button
                        className="show-on-hover"
                        fab
                        size="middle"
                        icon="menu-bars"
                    />
                </DropdownMenu> }
                
            </main>
            
        </article>
    );
};

export const ProjectsGrid: React.FC<IProjectsGrid> = props=> {
    return (
        <div className="projects-grid">

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