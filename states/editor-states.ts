import React, { RefObject } from "react";
import { HistoryItemType, IHistoryItem } from "../components/editor/history/HistoryWorker";
import { IEditorNotification } from "../components/editor/notification/Notification";
import { IDropdownMenuButtonsGroup } from "../components/ui/windows/DropdownMenu";
import { state, trigger } from "./State";

export enum EditorEditedType {
    NONE,
    UNDO,
    REDO,
    CANVAS_RESIZED,
    LAYERS_EDITED,
    PALETTE_EDITED,

    SELECTION_COPY,
    SELECTION_PASTE,
    SELECTION_CUT,
}
export enum EditorWrongActionType {
    UNEDITABLE_LAYER
}
export enum EditorActionType {
    START_APP,
    
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
    SAVE_PROJECT_WINDOW,
    PALETTE_WINDOW,

    ARRAY_MODIFIER_WINDOW,
    DECAY_MODIFIER_WINDOW,
    STROKE_MODIFIER_WINDOW,

    WELCOME_WINDOW
}

export type IEditorEditedTrigger = {
    type: EditorEditedType
} | true;
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
export interface IEditorHistoryTrigger {
    type: HistoryItemType | null
    targetId?: number
    items?: IHistoryItem[]
}

export const EditorTriggers = {
    // Was done
    Edited: trigger<IEditorEditedTrigger>("editor-edited"),

    // To call something
    Notification1: trigger<IEditorNotification>("editor-notification"),
    Window: trigger<IEditorWindowTrigger>("editor-window"),
    ContextMenu: trigger<IEditorContextMenuTrigger>("editor-context-menu"),
    History: trigger<IEditorHistoryTrigger>("editor-history"),

    // Was wrong...
    WrongAction: trigger<IEditorWrongActionTrigger>("editor-wrong-action"),
    // Will be done
    Action: trigger<IEditorActionTrigger>("editor-action"),
}
export const EditorStates = {
    HelperText: state<string>("", "editor-helper-text"),
    PipetteColor: state<string | false>(false, "editor-pipette-color"),

    InputIsFocused: state<boolean>(false, "editor-input-focused"),
    IsDrawing: state<boolean>(false, "editor-is-drawing"),
    MovingSelection: state<boolean>(false, "editor-moving-selection"),
    ContextMenuIsActive: state<boolean>(false, "editor-context-menu-is-active")
}