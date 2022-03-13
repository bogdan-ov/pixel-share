import React, { RefObject } from "react";
import { IContextMenuButtonsGroup } from "../components/context-menu/ContextMenu";
import { INotification } from "../components/editor/notification/Notification";
import { state, trigger } from "./State";

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
    UNDO
}
export interface IEditorAction {
    targetId: number
    type: EditorActionType
}
export enum EditorWindowType {
    TEST_WINDOW,

    EDIT_COLOR,
    TOOL_SETTINGS,
    EXPORT_IMAGE
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
}

export const EditorTriggers = {
    Edit: trigger<boolean>("editor-edit"),

    Notification: trigger<Omit<INotification, "id">>("editor-notification"),
    Window: trigger<IEditorWindowTrigger>("editor-window"),
    ContextMenu: trigger<IEditorContextMenuTrigger>("editor-context-menu"),

    WrongAction: trigger<EditorWrongActionType>("editor-wrong-action"),
    Action: trigger<IEditorAction>("editor-action"),

    // History: trigger<HistoryItemType>("editor-history-trigger"),
}
export const EditorStates = {
    HelperText: state<string>("", "editor-helper-text"),

    InputIsFocused: state<boolean>(false, "editor-input-focused"),
    IsDrawing: state<boolean>(false, "editor-is-drawing"),
    MovingSelection: state<boolean>(false, "editor-moving-selection")
}