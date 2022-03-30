import React from "react";

export interface MyComponent {
    className?: string
    style?: React.CSSProperties
}
export enum Direction {
    LEFT, RIGHT,
    UP, DOWN
}
export enum ViewMode {
    GRID,
    LIST,
    SHORT_LIST
}
export enum Anchor {
    TOP_LEFT,
    TOP_CENTER,
    TOP_RIGHT,

    CENTER_LEFT,
    CENTER_CENTER,
    CENTER_RIGHT,

    BOTTOM_LEFT,
    BOTTOM_CENTER,
    BOTTOM_RIGHT,
}

export type ReactState<T> = React.Dispatch<React.SetStateAction<T>>

export type RGBA = [red: number, green: number, blue: number, alpha: number];
export type HSLA = [hue: number, saturation: number, lightness: number, alpha: number];

export const Keys = {
    CTRL: "Ctrl",
    SHIFT: "Shift",
    ALT: "Alt",
    LEFT_MB: "LMB",
    RIGHT_MB: "RMB",
    M_WHEEL: "Wheel",

    F2: "f2",
    DEL: "Del",
    ESC: "Escape",
}