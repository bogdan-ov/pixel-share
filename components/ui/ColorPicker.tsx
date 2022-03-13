import React, { createRef, useEffect, useState } from "react";
import { vec, Vector2 } from "../../utils/math";
import { HSLA } from "../../utils/types";
import { hexToHsl, hslaToString, hslToHex } from "../../utils/utils";
import Input from "./inputs/Input";
import Tooltip from "./windows/Tooltip";

interface IColorPicker {
    newColor: HSLA
    lastColor: HSLA
    setNewColor: (value: HSLA)=> void
    
    size?: number
}

const DEFAULT_SIZE = 240;

const ColorPicker: React.FC<IColorPicker> = props=> {

    const ref = createRef<HTMLDivElement>();
    const cursorRef = createRef<HTMLDivElement>();
    
    const sizes = { width: props.size || DEFAULT_SIZE, height: props.size || DEFAULT_SIZE };
    const [hue, setHue] = useState<number>(0);
    const [saturation, setSaturation] = useState<number>(0);
    const [lightness, setLightness] = useState<number>(0);

    const [hex, setHex] = useState<string>("#000");

    useEffect(()=> {

        setHue(props.lastColor[0]);
        setSaturation(props.lastColor[1]);
        setLightness(props.lastColor[2]);

        setHex(hslToHex(props.lastColor));
        
        //
        const node = ref.current;
        const cursorNode = cursorRef.current;
        if (!node || !cursorNode) return;

        const size = props.size || DEFAULT_SIZE;
        
        let mouseDown = false;
        const hsl: HSLA = props.lastColor.slice(0) as HSLA; // Like [...props.lastColor], but more faster

        function onPointerDown(e: PointerEvent) {
            mouseDown = true;
            updateCursor(e);
        }
        function onPointerUp() {
            mouseDown = false;
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
    
            hsl[1] = (pos.x / width) * 100;
            hsl[2] = (50 - pos.y / height * 50) + (50 - pos.x / width * 50) * (1 - pos.y / height);
            
            setSaturation(hsl[1]);
            setLightness(hsl[2]);
            
            cursorNode.style.left = `${ pos.x }px`;
            cursorNode.style.top = `${ pos.y }px`;
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
        props.setNewColor([hue, saturation, lightness, 1]);
    }, [hue, saturation, lightness]);

    //
    function onHexColorChangeHandler() {
        let hexOutput = "000000";

        if (hex.length == 3) {
            hexOutput = hex[0]+hex[0] + hex[1]+hex[1] + hex[2]+hex[2]
        } else if (hex.length == 6) {
            hexOutput = hex;
        } else {
            for (let i = 0; i < 6 - hex.length; i ++)
                hexOutput += hex[0];
            hexOutput += hex;
        }
        
        const hsl = hexToHsl(hexOutput);

        setHue(hsl[0]);
        setSaturation(hsl[1]);
        setLightness(hsl[2]);
    }
    
    return (
        <div className="color-picker-wrapper flex flex-column gap-2">

            <div className="color-space" style={ sizes } ref={ ref }>
                <div className="hue" style={ { background: `hsl(${ hue }, 100%, 50%)` } } />
                <div className="saturation" />
                <div className="lightness" />

                <div className="cursor" ref={ cursorRef } style={ { background: hslaToString([hue, saturation, lightness, 1]) } } />
            </div>

            <input 
                className="hue-changer" type="range"
                value={ hue } onChange={ e=> setHue(+e.target.value) }
                min={ 0 } max={ 360 }
            />
            <div className="slot width-fill">
                <span className="mr-1 font-500 text-muted fs-medium">#</span>
                <Input 
                    className="hex-changer width-fill"
                
                    minLength={ 1 }
                    maxLength={ 6 }
                
                    value={ hex.replace("#", "") }
                    onChange={ value=> setHex(value.toString().replace("#", "")) }
                    onSubmit={ onHexColorChangeHandler }
                />
            </div>

            <div className="flex auto-borders hor">
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
                            setHue(props.lastColor[0]);
                            setSaturation(props.lastColor[1]);
                            setLightness(props.lastColor[2]);
                        } }
                    />
                </Tooltip>
            </div>

        </div>
    );
};

export default ColorPicker;