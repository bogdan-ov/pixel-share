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

class PaletteWorker {
    Palette: State<PaletteColor[]>
    CurrentPaletteColorId: State<PaletteColor["id"]>
    LastPaletteColorId: State<PaletteColor["id"]>

    constructor() {

        this.Palette = state<PaletteColor[]>([], "palette");
        this.CurrentPaletteColorId = state<PaletteColor["id"]>(0, "current-palette-color-id");
        this.LastPaletteColorId = state<PaletteColor["id"]>(0, "last-palette-color-id");
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

            EditorTriggers.Notification.trigger({
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
    setDefaultPalette() {
        this.Palette.value = [
            new PaletteColor(1).setHex("#430067"),
            new PaletteColor(2).setHex("#94216a"),
            new PaletteColor(3).setHex("#ff004d"),
            new PaletteColor(4).setHex("#ff8426"),
            new PaletteColor(5).setHex("#ffdd34"),
            new PaletteColor(6).setHex("#50e112"),
            new PaletteColor(7).setHex("#3fa66f"),
            new PaletteColor(8).setHex("#365987"),
            new PaletteColor(9).setHex("#000000"),
            new PaletteColor(10).setHex("#0033ff"),
            new PaletteColor(11).setHex("#29adff"),
            new PaletteColor(12).setHex("#00ffcc"),
            new PaletteColor(13).setHex("#fff1e8"),
            new PaletteColor(14).setHex("#c2c3c7"),
            new PaletteColor(15).setHex("#ab5236"),
            new PaletteColor(16).setHex("#5f574f"),
        ];
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
    addPaletteColor(hslaColor: HSLA) {
        const id = Date.now();
        this.putPaletteColor(
            new PaletteColor(id, hslaColor)
        );
        this.CurrentPaletteColorId.value = id;
    }
    async fastAddPaletteColor() {
        const data = await navigator.clipboard.readText();

        if (!(data.indexOf("#") == 0 || data.indexOf("rgb") == 0 || data.indexOf("hsl") == 0)) {
            EditorTriggers.Notification.trigger({
                content: "🤷‍♂️ Cannot paste a color from clipboard (HEX, RGB or HSL)",
                type: "danger"
            })
            return;
        }

        // Hex
        if (data.indexOf("#") == 0) {
            this.addPaletteColor(hexToHsl(data));
        }
        else if (data.indexOf("rgb") == 0) {
            const rgbStr = data.replace("hsl", "").replace("(", "").replace(")", "").split(",");
            this.addPaletteColor(rgbToHsl([ parseInt(rgbStr[0]) || 0, parseInt(rgbStr[1]) || 0, parseInt(rgbStr[2]) || 0, 1 ]));
        }
        else if (data.indexOf("hsl") == 0) {
            const hslStr = data.replace("hsl", "").replace("(", "").replace(")", "").split(",");
            this.addPaletteColor([ parseInt(hslStr[0]) || 0, parseInt(hslStr[1]) || 0, parseInt(hslStr[2]) || 0, 1 ]);
        }

        EditorTriggers.Notification.trigger({
            content: `😎 Created a new color from clipboard! ${ data }`,
            type: "success"
        });

    }

    pushToHistory() {
        HistoryWorker.pushToPast(HistoryItemType.PALETTE);
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