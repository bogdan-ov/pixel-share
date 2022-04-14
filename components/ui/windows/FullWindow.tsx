import React, { useEffect, useState } from "react";
import Keyboard from "../../../editor/managers/Keyboard";
import createClassName from "../../../src/hooks/createClassName";
import useSafeState from "../../../src/hooks/useSafeState";
import { EditorTriggers, EditorWindowType } from "../../../states/editor-states";
import { MyComponent } from "../../../utils/types";
import Button from "../buttons/Button";

export interface IFullWindow {
    trigger: EditorWindowType

    active?: boolean
    setActive?: (v: boolean)=> void

    minWidth?: number | string

    windowClassName?: string
}

const FullWindow = React.forwardRef<HTMLDivElement, React.PropsWithChildren<IFullWindow & MyComponent>>((props, ref)=> {
    const [active, setActive] = useSafeState<boolean>(false, props.active, props.setActive);
    
    const wrapperClassName = createClassName([
        "full-window-wrapper",
        props.className,
        active && "active"
    ]);

    useEffect(()=> {

        const unlistenKeyboard = Keyboard.onEscape(()=> {
            setActive(false);
        });
        const unlistenWindow = EditorTriggers.Window.listen(window=> {
            if (window.type == props.trigger) {
                setActive(true);
            }
        });

        return ()=> {
            unlistenWindow();
            unlistenKeyboard();
        }

    }, []);
    
    return (
        <div className={ wrapperClassName }>

            <div className="flex gap-2">
                {/* Space */}
                <div style={ { width: 40 } } />
                
                <div
                    ref={ ref }
                    className={ createClassName(["full-window flex flex-column", props.windowClassName]) }
                    style={ { minWidth: props.minWidth, ...props } }
                >
                    { active && props.children }
                </div>
                
                <Button 
                    ghost
                    size="middle"
                    icon="cross"
                    onClick={ ()=> setActive(false) }
                />
            </div>
            
        </div>
    );
});

export const FullWindowHeader: React.FC<MyComponent> = props=> (
    <header className={ createClassName(["full-window-header slot justify-between", props.className]) } style={ props.style }>
        { props.children }
    </header>
);
export const FullWindowFooter: React.FC<MyComponent> = props=> (
    <footer className={ createClassName(["full-window-footer slot justify-between", props.className]) } style={ props.style }>
        { props.children }
    </footer>
);
export const FullWindowContent: React.FC<MyComponent> = props=> (
    <main className={ createClassName(["full-window-content", props.className])} style={ props.style }>
        { props.children }
    </main>
);

FullWindow.displayName = "FullWindow";
export default FullWindow;