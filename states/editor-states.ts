import React, { RefObject } from "react";
import { IContextMenuButtonsGroup } from "../components/context-menu/ContextMenu";
import { HistoryItemType } from "../components/editor/history/HistoryWorker";
import { INotification } from "../components/editor/notification/Notification";
import { state, trigger } from "./State";

export enum EditorEditedType {
    NONE,
    UNDO
}
export enum EditorWrongActionType {
    LOCKED_LAYER
}
export enum EditorActionType {
    RENAME_LAYER,
    DELETE_LAYER,
    CLEAR_LAYER_CANVAS,
    CLEAR_SELECTION,

    COPY_IMAGE_DATA,
    PASTE_IMAGE_DATA,
    CUT_IMAGE_DATA,
}
export enum EditorWindowType {
    TEST_WINDOW,

    EDIT_COLOR,
    TOOL_SETTINGS,
    EXPORT_IMAGE
}

export interface IEditorEditedTrigger {
    type: EditorEditedType
}
export interface IEditorWindowTrigger {
    type: EditorWindowType
    targetId?: number
    targetRef?: RefObject<HTMLDivElement>
}
export interface IEditorContextMenuTrigger {
    event: MouseEvent | PointerEvent | React.MouseEvent
    buttonsGroups: IContextMenuButtonsGroup[]
    
    title?: React.ReactElement
    minWidth?: number
    onClose?: ()=> void
}
export interface IEditorActionTrigger {
    type: EditorActionType
    targetId?: number
}
export interface IEditorWrongActionTrigger {
    type: EditorWrongActionType
}

export const EditorTriggers = {
    // Was done
    Edited: trigger<IEditorEditedTrigger | true>("editor-edited"),

    // To call notification
    Notification: trigger<Omit<INotification, "id">>("editor-notification"),
    // To call window
    Window: trigger<IEditorWindowTrigger>("editor-window"),
    // To call context menu
    ContextMenu: trigger<IEditorContextMenuTrigger>("editor-context-menu"),

    // Was wrong...
    WrongAction: trigger<IEditorWrongActionTrigger>("editor-wrong-action"),
    // Will be done
    Action: trigger<IEditorActionTrigger>("editor-action"),

    // History: trigger<HistoryItemType>("editor-history-trigger"),
}
export const EditorStates = {
    HelperText: state<string>("", "editor-helper-text"),

    InputIsFocused: state<boolean>(false, "editor-input-focused"),
    IsDrawing: state<boolean>(false, "editor-is-drawing"),
    MovingSelection: state<boolean>(false, "editor-moving-selection"),
    ContextMenuIsActive: state<boolean>(false, "editor-context-menu-is-active")
}