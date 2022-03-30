import { useState } from "react";
import ProjectWorker, { IProjectData } from "../../editor/workers/ProjectWorker";

export default function useFetchProjects(): { projects: IProjectData[], setProjects: (v: IProjectData[])=> void, fetch: ()=> void } {
    const [projects, setProjects] = useState<IProjectData[]>([]);
    
    function fetch() {
        setProjects(ProjectWorker.fetchProjects());
    }

    return { projects, setProjects, fetch };
}