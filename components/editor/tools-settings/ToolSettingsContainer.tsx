import React from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface IToolSettingsContainer {
    
}
interface IToolColorsIndicator {
    alpha?: boolean
    frontColor?: string
    backColor?: string
}

export const ToolSettingsContainer: React.FC = props=> (
    <div className="tool-settings-container slot gap-4"><hr className="vertical" />{ props.children }</div>
);
export const ToolColorsIndicator: React.FC<IToolColorsIndicator> = props=> {
    return (
        <div className="tool-colors">
            { props.alpha ?
                <div className="tool-color alpha" />
                :
                <div 
                    className="tool-color"
                    style={ { background: props.frontColor } }
                />
                /* <>
                   <div
                        className="tool-color back"
                        style={ { background: props.backColor } }
                    />
                </> */
            }
        </div>
    )
};