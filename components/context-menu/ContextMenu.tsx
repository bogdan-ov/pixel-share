import React, { createRef, useEffect, useState } from "react";
import ClickOutside from "../ui/utils/ClickOutside";
import { EditorStates, EditorTriggers, IEditorContextMenuTrigger } from "../../states/editor-states";
import { vec } from "../../utils/math";
import Keyboard from "../../editor/managers/Keyboard";
import useStateListener from "../../src/hooks/useStateListener";
import { DropdownMenuContent, IDropdownMenuButtonsGroup } from "../ui/windows/DropdownMenu";
import createClassName from "../../src/hooks/createClassName";

interface IContextMenu {
    
}

const ContextMenu: React.FC<IContextMenu> = ()=> {
    const ref = createRef<HTMLDivElement>();
    const [active, activeState] = useStateListener(EditorStates.ContextMenuIsActive);
    const [targetId, setTargetId] = useState<number | undefined>(undefined);
    const [buttonsGroups, setButtonsGroups] = useState<IDropdownMenuButtonsGroup[]>([]);
    const [header, setHeader] = useState<React.ReactElement>(<></>);
    const [minWidth, setMinWidth] = useState<number>(220);

    const className = createClassName([
        "context-menu-wrapper",
        active && "active"
    ]);

    useEffect(()=> {
        const unlistenContext = EditorTriggers.ContextMenu.listen(context=> {
            
            context.event.preventDefault();
            setButtonsGroups(context.buttonsGroups);
            setHeader(context.header || <></>);
            setTargetId(context.targetId);
            
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
        if (pos.y + bounds.height + 10 > innerHeight) {
            pos.y = e.clientY - bounds.height;
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
            <DropdownMenuContent
                active={ active }
                setActive={ v=> activeState.value = v }

                header={ header }
                buttonsGroups={ buttonsGroups }
                minWidth={ minWidth }
                targetId={ targetId }
            />
        </ClickOutside>
    );
};

export default ContextMenu;