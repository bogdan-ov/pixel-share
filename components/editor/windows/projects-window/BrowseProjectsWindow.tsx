import React, { useEffect, useState } from "react";
import FullWindow, { FullWindowHeader, IFullWindow } from "../../../ui/windows/FullWindow";
import { ReactState } from "../../../../utils/types";
import { IProjectData } from "../../../../editor/workers/ProjectWorker";

interface IBrowseProjectsWindow {
    active: boolean
    setActive: ReactState<boolean>

    // selectedProjectId: number | null
    setSelectedProjectId: ReactState<number | null>

    projects: IProjectData[]
    fetchProjects: ()=> void
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
            custom
            active={ props.active }
            setActive={ props.setActive }
            className="projects-window"
            style={ { width: "max-content" } }
            trigger={ props.trigger }
        >
            <div className="scrollable p-4">
            
                <FullWindowHeader>
                    <span className="text-muted">Browse your awesome projects! { loading && "(Loading...)" }</span>
                </FullWindowHeader>
                
                { props.children && (props.children as any)[0] }
            
            </div>

            { props.children && (props.children as any)[1] }

        </FullWindow>
    );
};

BrowseProjectsWindow.displayName = "BrowseProjectsWindow";
export default BrowseProjectsWindow;