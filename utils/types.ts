import React, { Dispatch, SetStateAction } from "react";

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

// export type ReactState<T> = Dispatch<SetStateAction<T>>
export type ReactStateValue<T> = T | ((old: T)=> T)
export type ReactState<T> = (value: ReactStateValue<T>)=> void
export type ReactSimpleState<T> = (value: T)=> void

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