import HistoryWorker, { HistoryItemType } from "../../components/editor/history/HistoryWorker";
import State, { state } from "../../states/State";
import config from "../../utils/config";
import { HSLA } from "../../utils/types";
import { hslToHex } from "../../utils/utils";
import Keyboard from "../managers/Keyboard";
import PaletteColor from "../renderer/PaletteColor";

export interface IShortPaletteColorData {
    id: PaletteColor["id"]
    hslaColor: PaletteColor["hslaColor"]
}

class PaletteWorker {
    Palette: State<PaletteColor[]>
    CurrentPaletteColorId: State<PaletteColor["id"]>

    FrontToolColor: State<ToolColor>
    BackToolColor: State<ToolColor>

    constructor() {

        this.Palette = state<PaletteColor[]>([], "palette");
        this.CurrentPaletteColorId = state<PaletteColor["id"]>(0, "current-palette-color-id");

        this.FrontToolColor = state<ToolColor>(new ToolColor([0, 0, 0, 1]), "front-color");
        this.BackToolColor = state<ToolColor>(new ToolColor([0, 0, 0, 1]), "back-color");

    }

    init() {
        this.Palette.value = [
            new PaletteColor(0).fromHex("#430067"),
            new PaletteColor(1).fromHex("#94216a"),
            new PaletteColor(2).fromHex("#ff004d"),
            new PaletteColor(3).fromHex("#ff8426"),
            new PaletteColor(4).fromHex("#ffdd34"),
            new PaletteColor(5).fromHex("#50e112"),
            new PaletteColor(6).fromHex("#3fa66f"),
            new PaletteColor(7).fromHex("#365987"),
            new PaletteColor(8).fromHex("#000000"),
            new PaletteColor(9).fromHex("#0033ff"),
            new PaletteColor(10).fromHex("#29adff"),
            new PaletteColor(11).fromHex("#00ffcc"),
            new PaletteColor(12).fromHex("#fff1e8"),
            new PaletteColor(13).fromHex("#c2c3c7"),
            new PaletteColor(14).fromHex("#ab5236"),
            new PaletteColor(15).fromHex("#5f574f"),
        ];
        this.CurrentPaletteColorId.value = this.Palette.value[2].id;

        this.FrontToolColor.value.hsla = this.Palette.value[0].hslaColor;
        this.BackToolColor.value.hsla = this.Palette.value[1].hslaColor;
        this.FrontToolColor.notify();
        this.BackToolColor.notify();

        Keyboard.onKeyDown(e=> {
            if (e.code == "KeyX")
                this.switchToolColors();
        })
    }

    setFrontToolColor(hsla: HSLA) {
        this.FrontToolColor.value.hsla = hsla;
        this.FrontToolColor.notify();
    }
    setBackToolColor(hsla: HSLA) {
        this.BackToolColor.value.hsla = hsla;
        this.BackToolColor.notify();
    }
    switchToolColors() {
        const back = this.BackToolColor.value.hsla;
        this.setBackToolColor(this.FrontToolColor.value.hsla);
        this.setFrontToolColor(back);
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
    private updatePalette(callback: (color: PaletteColor) => PaletteColor) {
        this.Palette.set(v => v.map(callback));
    }
    deletePaletteColor(id: PaletteColor["id"]) {
        if (this.Palette.value.length <= config.MIN_PALETTE_COLORS) return;

        this.pushToHistory();

        let removedIndex = 0;

        this.Palette.set(palette => palette.filter((color, index) => {
            if (color.id != id) {
                return true;
            }

            removedIndex = index;
            return false;
        }));

        const nextColor = this.Palette.value[removedIndex]
        this.CurrentPaletteColorId.value = (nextColor ? nextColor : this.Palette.value[0]).id;
    }
    choosePaletteColorByColor(color: HSLA | string, useHex?: boolean): boolean {
        const paletteColor = this.Palette.value.find(c => !useHex ? (c.hslaColor == color) : c.hexColor == color);

        if (paletteColor) {
            this.CurrentPaletteColorId.value = paletteColor.id;
            return true;
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

    pushToHistory() {
        HistoryWorker.pushType(HistoryItemType.PALETTE);
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