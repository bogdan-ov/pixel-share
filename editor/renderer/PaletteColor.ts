import { HSLA } from "../../utils/types";
import { hexToHsl, hslToHex } from "../../utils/utils";

export default class PaletteColor {
    id: number
    hslaColor: HSLA
    
    constructor(id: PaletteColor["id"], color?: HSLA) {
        this.id = id;
        this.hslaColor = color || [0, 0, 0, 1];
    }

    fromHex(hex: string): PaletteColor {
        this.hslaColor = hexToHsl(hex);

        return this;
    }

    get hexColor(): string {
        return hslToHex(this.hslaColor);
    }
}