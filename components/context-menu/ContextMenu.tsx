import React, { createRef, useEffect, useState } from "react";
import ClickOutside from "../ui/utils/ClickOutside";
import Icon, { icons } from "../Icon";
import { EditorStates, EditorTriggers, IEditorContextMenuTrigger } from "../../states/editor-states";
import { vec } from "../../utils/math";
import Keyboard from "../../editor/managers/Keyboard";
import { HotkeysBuilder } from "../ui/Misc";
import ActionWorker from "../../editor/workers/ActionWorker";
import useStateListener from "../../src/hooks/useStateListener";

interface IContextMenu {
    
}
export interface IContextMenuButton {
    content: string | React.ReactElement

    sub?: string | React.ReactElement
    hotkeysName?: string
    icon?: keyof typeof icons
    disabled?: boolean
    handler?: ()=> void
    actionName?: string
}
export type IContextMenuButtonsGroup = IContextMenuButton[]

const ContextMenu: React.FC<IContextMenu> = ()=> {
    const ref = createRef<HTMLDivElement>();
    const [active, activeState] = useStateListener(EditorStates.ContextMenuIsActive);
    const [buttonsGroups, setButtonsGroups] = useState<IContextMenuButtonsGroup[]>([]);
    const [title, setTitle] = useState<React.ReactElement>(<></>);
    const [minWidth, setMinWidth] = useState<number>(220);

    const className = ["context-menu-wrapper", active ? "active" : ""].join(" ");

    useEffect(()=> {
        const unlistenContext = EditorTriggers.ContextMenu.listen(context=> {
            
            context.event.preventDefault();
            setButtonsGroups(context.buttonsGroups);
            setTitle(context.title || <></>);
            const width = context.minWidth || 220;
            setMinWidth(width);
            
            activeState.value = true;
            
            place(context.event, width);
        });

        return unlistenContext;
        
    }, [ref]);
    useEffect(()=>
        Keyboard.onEscape(closeHandler),
    []);

    function place(e: IEditorContextMenuTrigger["event"], width?: number) {
        const node = ref.current;
        if (!node) return;

        const bounds = node.getBoundingClientRect();
        const w = Math.max(width || 0, bounds.width);
        const pos = vec(e.clientX, e.clientY);

        if (pos.x + w + 10 > innerWidth) {
            pos.x = e.clientX - w;
        }
        
        pos.copy(pos.clamp(
            vec(10, 10),
            vec(innerWidth - w - 10, innerHeight - bounds.height - 10),
        ))

        node.style.left = pos.x + "px";
        node.style.top = pos.y + "px";
    }
    function closeHandler() {
        if (activeState.value)
            activeState.value = false;
    }
    
    return (
        <ClickOutside
            ref={ ref }
            onClickOutside={ closeHandler }
            className={ className }
        >
            <div
                onContextMenu={ e=> { e.preventDefault(); closeHandler} }
                className="context-menu flex flex-column gap-1"
                style={ { minWidth } }
            >
                { title }

                <main className="context-menu-content flex flex-column gap-2">
                    { buttonsGroups.map((group, gIndex)=> 
                        <div className="context-menu-buttons-group flex flex-column" key={ gIndex }>
                            { group.map((button, bIndex)=>
                                <ContextMenuButton setActive={ v=> activeState.value = v } key={ bIndex } { ...button } />
                            ) }
                        </div>    
                    ) }
                </main>
                
            </div>
        </ClickOutside>
    );
};

const ContextMenuButton: React.FC<IContextMenuButton & { setActive: (v: boolean)=> void }> = props=> {
    return (
        <button
            onClick={ ()=> {
                props.handler && props.handler();
                props.actionName && ActionWorker.registered[props.actionName]();
                props.setActive(false);
            } }
            disabled={ props.disabled }
            className="button color-transparent context-menu-button"
        >
            <div className="icon-wrapper">
                { props.icon && <Icon icon={ props.icon } /> }
            </div>
            <div className="width-fill slot justify-between">
                { props.content }
                { props.sub && <span className="text-muted">{ props.sub }</span> }
                { (props.hotkeysName || props.actionName) && <span className="text-muted">
                    <HotkeysBuilder justText variants={ props.actionName || props.hotkeysName || "" } />
                </span> }
            </div>
        </button>
    );
};

export default ContextMenu;