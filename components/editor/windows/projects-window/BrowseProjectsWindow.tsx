import React, { useEffect, useState } from "react";
import FullWindow, { FullWindowHeader, IFullWindow } from "../../../ui/windows/FullWindow";
import { ReactState } from "../../../../utils/types";
import { IProjectData } from "../../../../editor/workers/ProjectWorker";

interface IBrowseProjectsWindow {
    active: boolean
    setActive: ReactState<boolean>

    setSelectedProjectId: ReactState<number | null>

    projects: IProjectData[]
    fetchProjects: ()=> void
    title: React.ReactElement
}

const BrowseProjectsWindow: React.FC<Pick<IFullWindow, "trigger"> & IBrowseProjectsWindow> = props=> {
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(()=> {
        setLoading(true);
        
        const t = setTimeout(()=> {
            if (props.active) {
                props.fetchProjects();
                setLoading(false);
            }
        }, 500);

        props.setSelectedProjectId(null);

        return ()=> clearTimeout(t);
    }, [props.active]);
    
    return (
        <FullWindow
            active={ props.active }
            setActive={ props.setActive }
            className="projects-window"
            style={ { width: "max-content" } }
            trigger={ props.trigger }
        >
            <div className="scrollable">
            
                <FullWindowHeader>
                    <span className="text-muted">{ props.title } { loading && "(Loading...)" }</span>
                </FullWindowHeader>
                
                { props.children && (props.children as any)[0] }
            
            </div>

            { props.children && (props.children as any)[1] }

        </FullWindow>
    );
};

BrowseProjectsWindow.displayName = "BrowseProjectsWindow";
export default BrowseProjectsWindow;