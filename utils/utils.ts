import { random } from "./math";
import { HSLA, RGBA } from "./types";
import converter from "color-convert";

export const coolLayerNames = [
    "New layer", "asdkcp", "Another layer", "It's layer!", "Name me, please...",
    "New layer 2", "My layer", "Layer!"
]

export function rgbaToString(rgba: RGBA): string {
    return `rgba(${ rgba[0] }, ${ rgba[1] }, ${ rgba[2] }, ${ rgba[3] })`;
}
export function hslaToString(hsla: HSLA): string {
    return `hsla(${ hsla[0] }, ${ hsla[1] }%, ${ hsla[2] }%, ${ hsla[3] })`;
}
export function capitalize(string: string): string {
    return string[0].toUpperCase() + string.slice(1, string.length).toLowerCase();
}
export function safeValue<T>(value: T | undefined | null, safe: T): T {
    return (value === undefined || value === null) ? safe : value;
}
export function isNull(value: any): boolean {
    return value === null || value === undefined;
}

export function rgbToHex(rgba: RGBA): string {
    return "#" + converter.rgb.hex([rgba[0], rgba[1], rgba[2]]);
}
export function rgbToHsl(rgba: RGBA): HSLA {
    return [...converter.rgb.hsl([rgba[0], rgba[1], rgba[2]]), 1];
}
export function hslToHex(hsla: HSLA=[0, 0, 0, 1]): string {
    return "#" + converter.hsl.hex([hsla[0], hsla[1], hsla[2]]);
}
export function hexToHsl(hex: string): HSLA {
    return [...converter.hex.hsl(hex.replace("#", "")), 1];
}
export function randomColor(): string {
    return `hsl(${ Math.round(random(0, 360)) }, 100%, 50%)`;
}

export function putItemAt<T>(array: T[], item: T, index: number): T[] {
    const arr = [...array];

    if (index >= 0)
        arr.splice(index, 0, item);
    else
        arr.push(item);

    return arr;
}