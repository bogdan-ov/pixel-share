import { random, vec, Vector2 } from "./math";
import { HSLA, ReactState, ReactStateValue, RGBA } from "./types";
import converter from "color-convert";
import React from "react";

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
export function exists(value: any): boolean {
    return value !== null || value !== undefined;
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

export function drawImageData(context: CanvasRenderingContext2D, imageData: ImageData, offset: Vector2=new Vector2()) {
    const data = imageData.data;

    for (let i = 0; i < data.length; i ++) {
        const pos = vec(i % imageData.width, Math.floor(i / imageData.width)).add(offset);
        const color = `rgba(${ data[i*4] }, ${ data[i*4+1] }, ${ data[i*4+2] }, ${ data[i*4+3]/255 })`;

        context.fillStyle = color;
        context.fillRect(Math.floor(pos.x), Math.floor(pos.y), 1, 1);
    }
}

export function putItemAt<T>(array: T[], item: T, index: number): T[] {
    const arr = [...array];

    if (index >= 0)
        arr.splice(index, 0, item);
    else
        arr.push(item);

    return arr;
}