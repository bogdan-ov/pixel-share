import React, { createRef, useEffect, useState } from "react";
import ActionWorker from "../../../editor/workers/ActionWorker";
import createClassName from "../../../src/hooks/createClassName";
import config from "../../../utils/config";
import { vec } from "../../../utils/math";
import messages from "../../../utils/messages";
import { MyComponent } from "../../../utils/types";
import Icon, { icons } from "../../Icon";
import Button, { IButton } from "../buttons/Button";
import { HotkeysBuilder } from "../Misc";
import ClickOutside from "../utils/ClickOutside";

export interface IDropdownMenuButton {
    targetId?: number
    content: string | React.ReactElement
    
    sub?: string | React.ReactElement
    icon?: IButton["icon"]
    disabled?: boolean
    textColor?: "red" | "blue"
    
    handler?: ()=> void
    hotkeysName?: string
    actionName?: string
    actionParams?: any

    dropDownMenu?: IDropdownMenu
}
export type IDropdownMenuButtonsGroup = IDropdownMenuButton[]
export interface IDropdownMenu {
    buttonsGroups: IDropdownMenuButtonsGroup[]

    absolute?: boolean
    targetId?: number
    header?: string | React.ReactElement
    minWidth?: number
    leftPlacement?: boolean
}
export interface IDropdownMenuContent {
    buttonsGroups: IDropdownMenu["buttonsGroups"]

    active: boolean
    setActive: (v: boolean)=> void

    targetId?: IDropdownMenu["targetId"]
    header?: IDropdownMenu["header"]
    minWidth?: number
}

const DropdownMenu: React.FC<IDropdownMenu & MyComponent> = props=> {
    const ref = createRef<HTMLDivElement>();
    const wrapperRef = createRef<HTMLDivElement>();
    const [active, setActive] = useState<boolean>(false);

    function openHandler() {
        const node = ref.current;
        const wrapperNode = wrapperRef.current;
        if (!node || !wrapperNode) return;

        const offset = 10;
        const wrapperBounds = wrapperNode.getBoundingClientRect();
        const bounds = node.getBoundingClientRect();
        const offsetLeft = props.absolute ? wrapperBounds.left : 0;
        const offsetTop = props.absolute ? wrapperBounds.top : 0;
        const pos = vec(wrapperBounds.left + wrapperBounds.width+offset - offsetLeft, wrapperBounds.top + offset - offsetTop);

        if (pos.x + bounds.width + offset > innerWidth - offsetLeft || props.leftPlacement) {
            pos.x = wrapperBounds.left - bounds.width - offset - offsetLeft;
        }
        
        pos.copy(pos.clamp(
            vec(offset - offsetLeft, offset - offsetTop),
            vec(innerWidth - bounds.width - offset - offsetLeft, innerHeight - bounds.height - offset - offsetTop),
        ))

        node.style.left = (pos.x) + "px";
        node.style.top = (pos.y) + "px";

        setActive(true);
        
    }

    const wrapperClassName = createClassName([
        "dropdown-menu-wrapper",
        props.className,
        active && "active",
    ]);
    
    return (
        <div ref={ wrapperRef } style={ props.style } className={ wrapperClassName }>
            <div className="dropdown-menu-children" onClick={ openHandler }>{ props.children }</div>
            
            <ClickOutside 
                onClickOutside={ ()=> setActive(false) }
                ref={ ref }
                className="dropdown-menu-pos"
                style={ {
                    position: props.absolute ? "absolute" : "fixed"
                } }
            >
                <DropdownMenuContent
                    { ...props }
                    active={ active }
                    setActive={ setActive }
                />
            </ClickOutside>
        </div>
    );
};

export const DropdownMenuContent: React.FC<IDropdownMenuContent> = props=> {
    const className = createClassName([
        "dropdown-menu flex flex-column",
        props.active && "active"
    ]);
    
    return (
        <div
            className={ className }
            style={ { minWidth: props.minWidth || 200 } }
        >
            { props.header }
            
            <main className="dropdown-menu-content flex flex-column gap-2">
                { props.buttonsGroups.map((group, gIndex)=>
                    // Render buttons group
                    <DropdownMenuButtonsGroup key={ gIndex }>
                        { group.map((button, bIndex)=> {
                            // Render buttons

                            const btn = <DropdownMenuButton
                                targetId={ props.targetId }
                                setActive={ props.setActive }
                                key={ bIndex }
                                { ...button }
                            />

                            if (button.dropDownMenu)
                                return <DropdownMenu
                                    key={ bIndex }
                                    { ...button.dropDownMenu }
                                    absolute
                                >
                                    { btn }
                                </DropdownMenu>;

                            return btn;
                            
                        }) }
                    </DropdownMenuButtonsGroup>
                ) }
            </main>
        </div>
    );
};

export const DropdownMenuButtonsGroup: React.FC = props=> (
    <div className="dropdown-menu-buttons-group flex flex-column">{ props.children }</div>
);
export const DropdownMenuButton: React.FC<IDropdownMenuButton & { setActive: (v: boolean)=> void }> = props=> {
    function onClickHandler() {
        props.handler && props.handler();
        if (props.actionName) {
            const action = ActionWorker.registered[props.actionName];
            if (action)
                action(props.actionParams || props.targetId || undefined);
            else
                config.DEBUG && console.error(messages.err.actionName(props.actionName));
        }
        !props.dropDownMenu && props.setActive(false);
    }

    return (
        <Button
            onClick={ onClickHandler }
            disabled={ props.disabled }
            color="transparent"
            className={ createClassName([
                "dropdown-menu-button",
                props.textColor && `text-${ props.textColor }`,
                props.textColor && "fw-500"
            ]) }
            icon={ props.icon || true }
        >
            
            <div className="width-fill slot justify-between">
                { props.content }
                { props.sub && <span className="text-muted">{ props.sub }</span> }
                { (props.hotkeysName || props.actionName) && <span className="text-muted">
                    <HotkeysBuilder justText variants={ props.actionName || props.hotkeysName || "" } />
                </span> }
            </div>

        </Button>
    )
};

DropdownMenu.displayName = "DropdownMenu";
export default DropdownMenu;