import { HSLA } from "../../utils/types";
import { hexToHsl, hslToHex } from "../../utils/utils";

export default class PaletteColor {
    id: number
    hslaColor: HSLA
    
    constructor(id: PaletteColor["id"], color?: HSLA) {
        this.id = id;
        this.hslaColor = color || [0, 0, 0, 1];
    }

    setHex(hex: string): PaletteColor {
        this.hslaColor = hexToHsl(hex);

        return this;
    }
    setAuto(hexOrHsl: string | HSLA): PaletteColor {
        if (typeof hexOrHsl == "string")
            this.setHex(hexOrHsl);
        else
            this.hslaColor = hexOrHsl;
        
        return this;
    }

    get hexColor(): string {
        return hslToHex(this.hslaColor);
    }
}