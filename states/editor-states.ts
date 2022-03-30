import React, { RefObject } from "react";
import { INotification } from "../components/editor/notification/Notification";
import { IDropdownMenuButtonsGroup } from "../components/ui/windows/DropdownMenu";
import { state, trigger } from "./State";

export enum EditorEditedType {
    NONE,
    UNDO,
    REDO,
    CANVAS_RESIZED,
    LAYERS_EDITED,
    PALETTE_EDITED
}
export enum EditorWrongActionType {
    UNEDITABLE_LAYER
}
export enum EditorActionType {
    ADD_LAYER,
    RENAME_LAYER,
    DELETE_LAYER,
    DUPLICATE_LAYER,
    CLEAR_LAYER_CANVAS,
    CLEAR_SELECTION,
    MERGE_VISIBLE_LAYERS,

    COPY_IMAGE_DATA,
    PASTE_IMAGE_DATA,
    CUT_IMAGE_DATA,
}
export enum EditorWindowType {
    COLOR_PICKER_POPOVER,
    TOOL_SETTINGS_POPOVER,
    EXPORT_IMAGE_WINDOW,
    RESIZE_CANVAS_WINDOW,

    GRID_CONFIG_WINDOW,

    OPEN_PROJECT_WINDOW,
    SAVE_PROJECT_WINDOW
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
    targetId?: number
    event: MouseEvent | PointerEvent | React.MouseEvent
    buttonsGroups: IDropdownMenuButtonsGroup[]
    
    header?: React.ReactElement
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
    PipetteColor: state<string | false>(false, "editor-pipette-color"),

    InputIsFocused: state<boolean>(false, "editor-input-focused"),
    IsDrawing: state<boolean>(false, "editor-is-drawing"),
    MovingSelection: state<boolean>(false, "editor-moving-selection"),
    ContextMenuIsActive: state<boolean>(false, "editor-context-menu-is-active")
}