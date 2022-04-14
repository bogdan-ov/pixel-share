import HistoryWorker, { HistoryItemType } from "../../components/editor/history/HistoryWorker";
import { EditorEditedType, EditorTriggers } from "../../states/editor-states";
import State, { state } from "../../states/State";
import config from "../../utils/config";
import { HSLA } from "../../utils/types";
import { hexToHsl, hslaToString, hslToHex, rgbToHsl } from "../../utils/utils";
import PaletteColor from "../renderer/PaletteColor";

export interface IShortPaletteColorData {
    id: PaletteColor["id"]
    hslaColor: PaletteColor["hslaColor"]
}
export type PalettePreset = (HSLA | string)[]

class PaletteWorker {
    Palette: State<PaletteColor[]>
    CurrentPaletteColorId: State<PaletteColor["id"]>
    LastPaletteColorId: State<PaletteColor["id"]>
    PresetPalettes: State<PalettePreset[]>

    constructor() {

        this.Palette = state<PaletteColor[]>([], "palette");
        this.CurrentPaletteColorId = state<PaletteColor["id"]>(0, "current-palette-color-id");
        this.LastPaletteColorId = state<PaletteColor["id"]>(0, "last-palette-color-id");
        this.PresetPalettes = state<PalettePreset[]>([
            ["#430067", "#94216a", "#ff004d", "#ff8426", "#ffdd34", "#50e112", "#3fa66f", "#365987", "#000000", "#0033ff", "#29adff", "#00ffcc", "#fff1e8", "#c2c3c7", "#ab5236", "#5f574f"],
            ["#212b5e", "#636fb2", "#adc4ff", "#ffffff", "#ffccd7", "#ff7fbd", "#872450", "#e52d40", "#ef604a", "#ffd877", "#00cc8b", "#005a75", "#513ae8", "#19baff", "#7731a5", "#b97cff"],
            ["#93c7e3", "#5672e1", "#3a159c", "#0f0d11", "#d85452", "#eeb8b4"],
            ["#000000", "#1D2B53", "#7E2553", "#008751", "#AB5236", "#5F574F", "#C2C3C7", "#FFF1E8", "#FF004D", "#FFA300", "#FFEC27", "#00E436", "#29ADFF", "#83769C", "#FF77A8", "#FFCCAA"]
        ], "palette-worker-preset-palettes");
    }

    init() {
        this.setDefaultPalette();
        
        this.Palette.listen(()=> {
            EditorTriggers.Edited.trigger({
                type: EditorEditedType.PALETTE_EDITED
            })
        }, "palette-worker");
    }

    // Palette colors
    get palette(): PaletteColor[] {
        return this.Palette.value;
    }
    getPaletteColor(id?: PaletteColor["id"]): PaletteColor | null {
        return this.palette.find(p => p.id == (id || this.CurrentPaletteColorId.value)) || null;
    }
    get currentPaletteColor(): PaletteColor {
        return this.getPaletteColor() || new PaletteColor(0);
    }
    get lastPaletteColor(): PaletteColor {
        return this.getPaletteColor(this.LastPaletteColorId.value) || new PaletteColor(0);
    }
    colorIsCurrent(id: PaletteColor["id"]): boolean {
        return this.CurrentPaletteColorId.value == id;
    }
    colorIsLast(id: PaletteColor["id"]): boolean {
        return this.LastPaletteColorId.value == id;
    }
    private updatePalette(callback: (color: PaletteColor) => PaletteColor) {
        this.Palette.set(v => v.map(callback));
    }
    switchCurrentColors() {
        const cur = this.CurrentPaletteColorId.value;
        const last = this.LastPaletteColorId.value;
        this.CurrentPaletteColorId.value = this.getPaletteColor(last) ? last : this.Palette.value[0].id;
        this.LastPaletteColorId.value = cur;
    }
    setCurrentColor(id: PaletteColor["id"]) {
        this.CurrentPaletteColorId.value = id;
    }
    duplicateColor(id: number) {
        const color = this.getPaletteColor(id);
        if (!color) return;

        this.addPaletteColor(Date.now(), color.hslaColor);
    }
    deletePaletteColor(id: PaletteColor["id"]) {
        if (this.Palette.value.length <= config.MIN_PALETTE_COLORS) return;

        this.pushToHistory();

        const removedIndex = this.Palette.value.findIndex(c=> c.id == id);

        this.Palette.set(palette => palette.filter((color, index) => {
            if (color.id != id) {
                return true;
            }
            
            return false;
        }));

        if (this.colorIsCurrent(id)) {
            let nextColor = this.Palette.value[removedIndex]
            if (!nextColor)
                nextColor = this.Palette.value[removedIndex-1];
                
            this.CurrentPaletteColorId.value = (nextColor ? nextColor : this.Palette.value[0]).id;
        }
    }
    choosePaletteColorByColor(color: HSLA | string, useHex?: boolean, autoAddColor?: boolean): boolean {
        const paletteColor = this.Palette.value.find(c => !useHex ? (c.hslaColor == color) : c.hexColor == color);

        if (paletteColor) {
            this.CurrentPaletteColorId.value = paletteColor.id;
            return true;
        }

        if (autoAddColor) {
            const id = Date.now();
            const paletteColor = new PaletteColor(id, useHex ? hexToHsl(color as string) as HSLA : color as HSLA);
            this.putPaletteColor(paletteColor);
            this.CurrentPaletteColorId.value = id;

            EditorTriggers.Notification1.trigger({
                content: `<div class="color-bubble mr-1" style="background:${ useHex ? color : hslaToString(color as HSLA) };"></div> Added a new color to the palette!`
            });
        }

        return false;
    }
    updatePaletteColor(id: PaletteColor["id"], newColor: HSLA) {
        this.pushToHistory();
        
        this.updatePalette(color => {
            if (color.id == id) {
                color.hslaColor = newColor;
            }

            return color;
        });
    }
    getShortData(): IShortPaletteColorData[] {
        return this.Palette.value.map(color=> ({
            id: color.id,
            hslaColor: color.hslaColor
        }))
    }
    setFromShortData(data: IShortPaletteColorData[]) {
        const palette: PaletteColor[] = [];
        
        for (const item of data) {
            palette.push(new PaletteColor(item.id, item.hslaColor));
        }

        this.Palette.value = palette;
    }
    setDefaultPalette(preset?: PalettePreset) {
        this.Palette.value = (preset || this.PresetPalettes.value[0]).map((item, i)=> new PaletteColor(Date.now()+i).setAuto(item));
        this.CurrentPaletteColorId.value = this.Palette.value[0].id;
        this.LastPaletteColorId.value = this.Palette.value[1].id;
    }
    setPalette(palette: PaletteColor[]) {
        this.Palette.value = palette;

        if (!this.getPaletteColor(this.CurrentPaletteColorId.value)) {
            this.CurrentPaletteColorId.value = palette[0].id;
        }
    }
    putPaletteColor(paletteColor: PaletteColor) {
        this.Palette.set(v=> v.length < config.MAX_PALETTE_COLORS ? [...v, paletteColor] : v);
    }
    addPaletteColor(id?: number, hslaColor?: HSLA): boolean {
        if (this.palette.length < config.MAX_PALETTE_COLORS-1) {
            this.pushToHistory();
            
            const _id = id || Date.now();
            this.Palette.set(v=> [
                ...v,
                new PaletteColor(_id, hslaColor || [(Math.sin(v.length/5) + 1) / 2 * 360, 100, 50, 1])
            ]);
            this.CurrentPaletteColorId.value = _id;

            return true;
        }
        
        return false;
    }
    async pasteColorFromClipboard() {
        const data = await navigator.clipboard.readText();

        if (!(data.indexOf("#") == 0 || data.indexOf("rgb") == 0 || data.indexOf("hsl") == 0)) {
            EditorTriggers.Notification1.trigger({
                content: "🤷‍♂️ Cannot paste a color from clipboard (HEX, RGB or HSL)",
            })
            return;
        }

        const id = Date.now();
        // Hex
        if (data.indexOf("#") == 0) {
            this.addPaletteColor(id, hexToHsl(data));
        }
        else if (data.indexOf("rgb") == 0) {
            const rgbStr = data.replace("hsl", "").replace("(", "").replace(")", "").split(",");
            this.addPaletteColor(id, rgbToHsl([ parseInt(rgbStr[0]) || 0, parseInt(rgbStr[1]) || 0, parseInt(rgbStr[2]) || 0, 1 ]));
        }
        else if (data.indexOf("hsl") == 0) {
            const hslStr = data.replace("hsl", "").replace("(", "").replace(")", "").split(",");
            this.addPaletteColor(id, [ parseInt(hslStr[0]) || 0, parseInt(hslStr[1]) || 0, parseInt(hslStr[2]) || 0, 1 ]);
        }

        EditorTriggers.Notification1.trigger({
            content: `😎 Created a new color from clipboard! ${ data }`,
        });

    }

    pushToHistory() {
        EditorTriggers.History.trigger({
            type: HistoryItemType.PALETTE
        });
        // HistoryWorker.pushToPast1(HistoryItemType.PALETTE);
    }
}

class ToolColor {
    hsla: HSLA
    
    constructor(hsla: HSLA) {
        this.hsla = hsla;
    }

    get hex(): string {
        return hslToHex(this.hsla);
    }
}

export default new PaletteWorker();