import React, { createRef, useEffect, useState } from "react";
import ClickOutside from "../ui/ClickOutside";
import Icon, { icons } from "../Icon";
import { EditorTriggers, IEditorContextMenuTrigger } from "../../states/editor-states";
import { vec } from "../../utils/math";
import Keyboard from "../../editor/managers/Keyboard";
import { HotkeysBuilder } from "../ui/Misc";

interface IContextMenu {
    
}
export interface IContextMenuButton {
    content: string | React.ReactElement

    sub?: string | React.ReactElement
    hotkeysName?: string
    icon?: keyof typeof icons
    disabled?: boolean
    handler?: ()=> void
}
export type IContextMenuButtonsGroup = IContextMenuButton[]

const ContextMenu: React.FC<IContextMenu> = ()=> {
    const ref = createRef<HTMLDivElement>();
    const [active, setActive] = useState<boolean>(false);
    const [buttonsGroups, setButtonsGroups] = useState<IContextMenuButtonsGroup[]>([]);
    const [title, setTitle] = useState<React.ReactElement>(<></>);
    const [minWidth, setMinWidth] = useState<number>(220);

    const className = ["context-menu-wrapper", active ? "active" : ""].join(" ");

    useEffect(()=> {
        const unlistenContext = EditorTriggers.ContextMenu.listen(action=> {
            action.event.preventDefault();
            setButtonsGroups(action.buttonsGroups);
            setTitle(action.title || <></>);
            const width = action.minWidth || 220;
            setMinWidth(width);
            
            setActive(true);
            
            place(action.event, width);
        });

        return unlistenContext;
        
    }, [ref]);
    useEffect(()=>
        Keyboard.onEscape(()=> {
            setActive(false);
        }),
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

        console.log(bounds.height);
    }
    
    return (
        <ClickOutside
            ref={ ref }
            onClickOutside={ ()=> setActive(false) }
            className={ className }
        >
            <div
                onContextMenu={ e=> { e.preventDefault(); setActive(false)} }
                className="context-menu flex flex-column gap-1"
                style={ { minWidth } }
            >
                { title }

                <main className="context-menu-content flex flex-column gap-2">
                    { buttonsGroups.map((group, gIndex)=> 
                        <div className="context-menu-buttons-group flex flex-column" key={ gIndex }>
                            { group.map((button, bIndex)=>
                                <ContextMenuButton setActive={ setActive } key={ bIndex } { ...button } />
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
                { props.hotkeysName && <span className="text-muted">
                    <HotkeysBuilder justText variants={ props.hotkeysName } />
                </span> }
            </div>
        </button>
    );
};

export default ContextMenu;