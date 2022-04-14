import React, { useEffect, useState } from "react";
import ProjectWorker, { IProjectData } from "../../../../editor/workers/ProjectWorker";
import useFetchProjects from "../../../../src/hooks/useFetchProjects";
import { EditorWindowType } from "../../../../states/editor-states";
import Button from "../../../ui/buttons/Button";
import Input from "../../../ui/inputs/Input";
import { FullWindowContent, FullWindowFooter } from "../../../ui/windows/FullWindow";
import { ProjectsGrid } from "../../projects/Project";
import BrowseProjectsWindow from "./BrowseProjectsWindow";

const SaveProjectWindow: React.FC = ()=> {
    const [active, setActive] = useState<boolean>(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [projectName, setProjectName] = useState<string>(ProjectWorker.Name.value);
    const { projects, fetch } = useFetchProjects();

    const selectedProject: IProjectData | undefined = projects.find(p=> p.id == selectedProjectId);
    const projectToOverwrite: IProjectData | undefined = projects.find(p=> p.name.trim() == projectName.trim());

    useEffect(()=> {
        if (active)
            setProjectName(ProjectWorker.Name.value);
    }, [active]);
    useEffect(()=> {
        if (selectedProject)
            setProjectName(selectedProject.name);
    }, [selectedProjectId]);
    useEffect(()=> {
        if (projectToOverwrite)
            setSelectedProjectId(projectToOverwrite.id);
    }, [projectName]);
    
    function deleteProjectHandler(name: string) {
        ProjectWorker.deleteProject(name);
        fetch();
    }
    function saveProjectHandler() {
        ProjectWorker.saveProject(projectName);
        setActive(false);
    }
    function overwriteProjectHandler(name: string) {
        const sure = confirm(`Are you sure to overwrite "${ name }"?`);
        if (sure) {
            ProjectWorker.saveProject(name);
            setActive(false);
        }
    }
    
    return (
        <BrowseProjectsWindow
            trigger={ EditorWindowType.SAVE_PROJECT_WINDOW }

            title={ <span>Save or overwrite project</span> }
            active={ active }
            setActive={ setActive }
            
            projects={ projects }
            fetchProjects={ fetch }
            setSelectedProjectId={ setSelectedProjectId }
        >

            <FullWindowContent className="list gap-2">
                { active && <ProjectsGrid
                    projects={ projects }
                    projectTitle="Double click to overwrite!"

                    onProjectSelect={ project=> setSelectedProjectId(project.id) }
                    onProjectDoubleClick={ project=> overwriteProjectHandler(project.name) }

                    selectedProjectId={ selectedProjectId }
                    setSelectedProjectId={ setSelectedProjectId }
                    highlightProjectId={ projectToOverwrite?.id }

                    projectDropdownMenu={ project=> [[
                        {
                            content: "Overwrite",
                            handler: ()=> overwriteProjectHandler(project.name)
                        },
                        {
                            content: "Delete",
                            icon: "trash",
                            handler: ()=> deleteProjectHandler(project.name)
                        },
                    ]] }
                /> }
            </FullWindowContent>

            <FullWindowFooter>
                
                <Input
                    type="text"

                    value={ projectName }
                    onChange={ v=> setProjectName(v.toString()) }
                    onSubmit={ v=> {
                        setProjectName(v.toString())
                        saveProjectHandler();
                    } }

                    width={ 400 }
                    placeholder="Enter name or select one of your project to overwrite"
                    inputClassName="fs-middle"
                />

                <div className="slot gap-1">
                    <Button
                        onClick={ !!projectToOverwrite ? ()=> overwriteProjectHandler(projectName) : saveProjectHandler }
                        color="blue"
                        disabled={ !projectName }
                        text={ !!projectToOverwrite ? "Overwrite" : "Save"}
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

SaveProjectWindow.displayName = "SaveProjectWindow";
export default SaveProjectWindow;