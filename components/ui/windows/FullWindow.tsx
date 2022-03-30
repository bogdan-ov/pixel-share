import React, { useEffect, useState } from "react";
import Keyboard from "../../../editor/managers/Keyboard";
import createClassName from "../../../src/hooks/createClassName";
import { EditorTriggers, EditorWindowType } from "../../../states/editor-states";
import { MyComponent } from "../../../utils/types";
import Button from "../buttons/Button";

export interface IFullWindow {
    trigger: EditorWindowType

    custom?: boolean
    active?: boolean
    setActive?: (v: boolean)=> void

    minWidth?: number

    windowClassName?: string
}

const FullWindow = React.forwardRef<HTMLDivElement, React.PropsWithChildren<IFullWindow & MyComponent>>((props, ref)=> {
    const [active, setActive] = useState<boolean>(false);

    const _active = props.custom ? props.active! : active;
    const _setActive = props.custom ? props.setActive! : setActive;
    
    const wrapperClassName = createClassName([
        "full-window-wrapper",
        props.className,
        _active && "active"
    ]);

    useEffect(()=> {

        const unlistenKeyboard = Keyboard.onEscape(()=> {
            _setActive(false);
        });
        const unlistenWindow = EditorTriggers.Window.listen(window=> {
            if (window.type == props.trigger) {
                _setActive(true);
                console.log("Window called!");
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
                    { _active && props.children }
                </div>
                
                <Button 
                    ghost
                    size="middle"
                    icon="cross"
                    onClick={ ()=> _setActive(false) }
                />
            </div>
            
        </div>
    );
});

export const FullWindowHeader: React.FC = props=> (
    <header className="full-window-header slot justify-between">
        { props.children }
    </header>
);
export const FullWindowFooter: React.FC = props=> (
    <footer className="full-window-footer slot justify-between">
        { props.children }
    </footer>
);
export const FullWindowContent: React.FC = props=> (
    <main className="list gap-2 full-window-content">
        { props.children }
    </main>
);

FullWindow.displayName = "FullWindow";
export default FullWindow;