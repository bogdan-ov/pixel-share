import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import ProjectWorker from "../../../../editor/workers/ProjectWorker";
import useFetchProjects from "../../../../src/hooks/useFetchProjects";
import { EditorWindowType } from "../../../../states/editor-states";
import Icon from "../../../Icon";
import Button from "../../../ui/buttons/Button";
import { FullWindowContent, FullWindowFooter } from "../../../ui/windows/FullWindow";
import Tooltip from "../../../ui/windows/Tooltip";
import { ProjectsGrid } from "../../projects/Project";
import BrowseProjectsWindow from "./BrowseProjectsWindow";

const OpenProjectWindow: React.FC = ()=> {
    const [active, setActive] = useState<boolean>(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const { projects, setProjects, fetch } = useFetchProjects();

    const selectedProject = projects.find(p=> p.id == selectedProjectId);;

    function openProjectHandler(name: string) {
        ProjectWorker.openProject(name);
        setActive(false);
    }
    function deleteProjectHandler(name: string) {
        ProjectWorker.deleteProject(name);
        fetch();
    }
    function createNewProjectHandler() {
        ProjectWorker.newProject();
        setActive(false);
    }
    
    return (
        <BrowseProjectsWindow
            projects={ projects }
            fetchProjects={ fetch }
            
            active={ active }
            setActive={ setActive }

            setSelectedProjectId={ setSelectedProjectId }
            
            trigger={ EditorWindowType.OPEN_PROJECT_WINDOW }
        >

            <FullWindowContent>
                { active && <ProjectsGrid
                    projects={ projects }
                    projectTitle="Double click to open!"
                    
                    selectedProjectId={ selectedProjectId }
                    setSelectedProjectId={ setSelectedProjectId }
                    
                    onProjectDoubleClick={ (project)=> openProjectHandler(project.name) }
                    onProjectSelect={ (project)=> setSelectedProjectId(project.id) }

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
                >
                    <Tooltip
                        className="height-fill p-4"
                        tooltip={ <span>New project!</span> }
                        placement="bottom"
                        color="blue"
                        offset={ 1 }
                    >
                        <article 
                            onClick={ createNewProjectHandler }
                            className="project new-project centered"
                        >
                            <Icon icon="add" />
                        </article>
                    </Tooltip>
                </ProjectsGrid> }
            </FullWindowContent>
            
            <FullWindowFooter>

                <div>
                    <AnimatePresence>
                        <motion.span 
                            key={ selectedProject?.name || "aaa" }
                            className="fs-middle pos-abs no-wrap"
                            initial={ {
                                y: -16,
                                opacity: 0
                            } }
                            animate={ {
                                y: 0,
                                opacity: 1
                            } }
                            exit={ {
                                y: 16,
                                opacity: 0
                            } }
                            transition={ { 
                                ease: "easeInOut",
                                duration: .1
                            } }
                        >
                            { selectedProject?.name || <i className="text-muted">Select any project</i> }
                        </motion.span>
                    </AnimatePresence>
                </div>

                <div className="slot gap-1">
                    <Button
                        onClick={ ()=> {
                            selectedProject && openProjectHandler(selectedProject.name);
                        } }
                        color="blue"
                        disabled={ !!!projects.find(p=> p.id == selectedProjectId) }
                        text="Open"
                    />
                    <Button
                        onClick={ ()=> {
                            selectedProject && deleteProjectHandler(selectedProject.name);
                        } }
                        color="red"
                        disabled={ !!!projects.find(p=> p.id == selectedProjectId) }
                        text="Delete"
                    />
                    <Button
                        onClick={ ()=> setActive(false) }
                        text="Cancel"
                    />
                </div>
            </FullWindowFooter>
            
        </BrowseProjectsWindow>
    );
};

OpenProjectWindow.displayName = "OpenProjectWindow";
export default OpenProjectWindow;