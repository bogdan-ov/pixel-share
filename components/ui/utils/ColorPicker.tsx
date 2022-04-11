import React, { createRef, useEffect, useState } from "react";
import PaletteWorker from "../../../editor/workers/PaletteWorker";
import useStateListener from "../../../src/hooks/useStateListener";
import { clamp, vec, Vector2 } from "../../../utils/math";
import { HSLA, ReactSimpleState, ReactState } from "../../../utils/types";
import { hexToHsl, hslaToString, hslToHex, safeValue } from "../../../utils/utils";
import { IPaletteColorComponent } from "../../editor/palette/PaletteColorComponent";
import { PalettePanelContent } from "../../editor/palette/PalettePanel";
import Input from "../inputs/Input";
import Tooltip from "../windows/Tooltip";

interface IColorPicker {
    newColor: HSLA
    setNewColor: ReactState<HSLA>
    lastColor: HSLA
    
    size?: number
    short?: boolean
    palette?: boolean
    onEnd?: ()=> void
}

const DEFAULT_SIZE = 240;

const ColorPicker: React.FC<IColorPicker> = props=> {
    const ref = createRef<HTMLDivElement>();
    const cursorRef = createRef<HTMLDivElement>();
    
    const sizes = { width: props.size || DEFAULT_SIZE, height: props.size || DEFAULT_SIZE };
    const hue = props.newColor[0];
    const saturation = props.newColor[1];
    const lightness = props.newColor[2];

    const [hex, setHex] = useState<string>("#000");
    const [palette, paletteState] = useStateListener(PaletteWorker.Palette);

    useEffect(()=> {

        setHex(hslToHex(props.lastColor));
        
        //
        const node = ref.current;
        const cursorNode = cursorRef.current;
        if (!node || !cursorNode) return;
        
        let mouseDown = false;
        const hsl: HSLA = [...props.lastColor] as HSLA;

        function onPointerDown(e: PointerEvent) {
            mouseDown = true;
            updateCursor(e);
        }
        function onPointerUp() {
            if (mouseDown) {
                props.onEnd && props.onEnd();
                mouseDown = false;
            }
        }
        function onPointerMove(e: PointerEvent) {
            if (!mouseDown) return;
            updateCursor(e);
        }

        function updateCursor(e?: PointerEvent) {
            if (!node || !cursorNode) return;
            
            const bounds = node.getBoundingClientRect();
    
            const width = bounds.width;
            const height = bounds.height;
            const pos = vec();
            
            if (e)
                pos.copy(
                    vec(e.clientX - bounds.left, e.clientY - bounds.top).clamp(vec(0, 0), vec(width, height))
                );
    
            hsl[1] = pos.x / width * 100;
            hsl[2] = (50 - pos.y / height * 50) + (50 - pos.x / width * 50) * (1 - pos.y / height);
            // hsl[2] = (50 - pos.y / height * 50) + (50 - pos.x / width * 50) * (1 - pos.y / height);
            
            setHsl([undefined, hsl[1], hsl[2]]);
        }
        
        node.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointermove", onPointerMove);

        return ()=> {
            node.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("pointerup", onPointerUp);
            window.removeEventListener("pointermove", onPointerMove);
        }

    }, [props.lastColor])
    useEffect(()=> {
        setHex(hslToHex([hue, saturation, lightness, 1]));
        // props.setNewColor([hue, saturation, lightness, 1]);

        const node = ref.current;
        const cursorNode = cursorRef.current;
        
        if (!node || !cursorNode) return;
        const bounds = node.getBoundingClientRect();
        
        const width = bounds.width;
        const height = bounds.height;

        cursorNode.style.left = `${ saturation / 100 * width }px`;
        cursorNode.style.top = `${ (((50 - lightness) / 50 * height)) * (saturation / 100) + ((1 - saturation / 100) * height) * clamp(1 - (lightness - 50) / 50, 0, 1) }px`;
    }, [hue, saturation, lightness]);

    //
    function setHslFromHexHandler() {
        const hsl = hexToHsl(hex.replace("#", ""));

        setHsl(hsl);
        props.onEnd && props.onEnd();
    }

    function setHsl(hsl: [number?, number?, number?, number?]) {
        props.setNewColor(v=> [
            safeValue(hsl[0], v[0]),
            safeValue(hsl[1], v[1]),
            safeValue(hsl[2], v[2]),
            safeValue(hsl[3], v[3]),
        ]);
    }
    // function setHslChanel(chanel: 0|1|2|3,  value: number) {
    //     props.setNewColor(v=> {
    //         const n: HSLA = [...v];
    //         n[chanel] = value;
    //         return n;
    //     });
    // }
    
    return (
        <div className="color-picker-wrapper flex gap-2">
            <div className="list gap-2 width-fill">
            
                {/* Field */}
                <div className="color-space" style={ sizes } ref={ ref }>
                    <div className="hue" style={ { background: `hsl(${ hue }, 100%, 50%)` } } />
                    <div className="saturation" />
                    <div className="lightness" />

                    <div className="cursor" ref={ cursorRef } style={ { background: hslaToString([hue, saturation, lightness, 1]) } } />
                </div>

                {/* Slider */}
                <div className="slot gap-1">
                    { props.short && <div className="color-bubble size-middle" style={{ background: hslaToString(props.newColor) }} /> }
                    <input 
                        className="hue-changer" type="range"
                        value={ hue } onChange={ e=> setHsl([+e.target.value]) }
                        // value={ hue } onChange={ e=> setHslChanel(0, +e.target.value) }
                        min={ 0 } max={ 360 }
                        style={ props.short ? { height: 16 } : {} }
                    />
                </div>
                
                {/* Inputs */}
                <div className="list gap-2">
                    <Tooltip 
                        tooltip={ <span>Hex</span> }
                        placement="top"
                        childrenClassName="slot width-fill"
                    >
                        <span className="mr-1 font-500 text-muted fs-medium">#</span>
                        <Input
                            className="hex-changer width-fill"
                        
                            minLength={ 1 }
                            maxLength={ 6 }
                        
                            value={ hex.replace("#", "") }
                            onChange={ value=> setHex(value.toString().replace("#", "")) }
                            onSubmit={ setHslFromHexHandler }
                        />
                    </Tooltip>

                    { !props.short && <div className="slot gap-2">
                        <Tooltip 
                            tooltip={ <span>Hue</span> }
                            placement="top"
                        >
                            <label className="slot gap-1">
                                <span className="text-muted">H</span>
                                <Input
                                    type="number"
                                    className="width-fill"
                                    value={ hue.toFixed(0) }
                                    onSubmitChange={ v=> {
                                        setHsl([+(+v).toFixed(0) % 360])
                                        props.onEnd && props.onEnd();
                                    } }

                                    min={ 0 }
                                    max={ 720 }
                                />
                            </label>
                        </Tooltip>
                        <Tooltip 
                            tooltip={ <span>Saturation</span> }
                            placement="top"
                        >
                            <label className="slot gap-1">
                                <span className="text-muted">S</span>
                                <Input
                                    type="number"
                                    className="width-fill"
                                    value={ saturation.toFixed(0) }
                                    onSubmitChange={ v=> {
                                        setHsl([undefined, +(+v).toFixed(0)])
                                        props.onEnd && props.onEnd();
                                    } }

                                    min={ 0 }
                                    max={ 100 }
                                />
                            </label>
                        </Tooltip>
                        <Tooltip 
                            tooltip={ <span>Lightness</span> }
                            placement="top"
                        >
                            <label className="slot gap-1">
                                <span className="text-muted">L</span>
                                <Input
                                    type="number"
                                    className="width-fill"
                                    value={ lightness.toFixed(0) }
                                    onSubmitChange={ v=> {
                                        setHsl([undefined, undefined, +(+v).toFixed(0)])
                                        props.onEnd && props.onEnd();
                                    } }

                                    min={ 0 }
                                    max={ 100 }
                                />
                            </label>
                        </Tooltip>
                    </div> }
                </div>

                { !props.short && <div className="flex auto-borders hor">
                    <div className="color after" style={ { background: hslaToString(props.newColor) } } />
                    <Tooltip
                        className="width-fill"
                        placement="top"
                        tooltip={ <span>Reset color</span> }
                    >
                        <div 
                            className="color before clickable"
                            style={ { background: hslaToString(props.lastColor) } }
                            onClick={ ()=> {
                                props.setNewColor(props.lastColor);
                                setHsl([...props.lastColor]);
                            } }
                        />
                    </Tooltip>
                </div> }

            </div>

            { props.palette && <div className="palette">
                <div className="list auto-borders">
                    { palette.map(color=>
                        <ColorPickerPaletteColor
                            key={ color.id }
                            onClick={ ()=> {
                                setHsl([...color.hslaColor]);
                                props.onEnd && props.onEnd();
                            } }
                            { ...color }
                        />
                    ) }
                </div>
            </div> }
            
        </div>
    );
};

const ColorPickerPaletteColor: React.FC<IPaletteColorComponent & { onClick: ()=> void }> = props=> {
    return (
        <div 
            className="palette-color"
            onClick={ props.onClick }
            style={ { background: hslaToString(props.hslaColor) } }
        />
    );
};

export default ColorPicker;