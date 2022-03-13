import React, { createRef } from "react";
import PaletteColor from "../../../editor/renderer/PaletteColor";
import PaletteWorker from "../../../editor/workers/PaletteWorker";
import { EditorTriggers, EditorWindowType } from "../../../states/editor-states";
import config from "../../../utils/config";
import { HSLA } from "../../../utils/types";
import { hslToHex } from "../../../utils/utils";
import Tooltip from "../../ui/windows/Tooltip";

interface IPaletteColorComponent {
    color: HSLA
    id: PaletteColor["id"]
};

const PaletteColorComponent: React.FC<IPaletteColorComponent> = props=> {
    const ref = createRef<HTMLDivElement>();
    
    const className = ["palette-color-wrapper", PaletteWorker.currentPaletteColor.id == props.id ? "active" : ""].join(" ");

    function selectHandler() {
        // PaletteWorker.setFrontToolColor(props.color);
        PaletteWorker.CurrentPaletteColorId.value = props.id;
    }
    function deleteHandler() {
        PaletteWorker.deletePaletteColor(props.id);
    }
    function editHandler() {
        EditorTriggers.Window.trigger({
            type: EditorWindowType.EDIT_COLOR,
            targetId: props.id,
            targetRef: ref
        });
    }
    
    function onContextHandler(e: React.MouseEvent) {
        EditorTriggers.ContextMenu.trigger({
            title: <div className="p-1"><div
                className="width-fill"
                style={ {
                    height: 6,
                    borderRadius: 10,
                    background: hslToHex(props.color)
                } }
            /></div>,
            event: e,
            buttonsGroups: [[
                {
                    icon: "pen",
                    content: <span>Edit color</span>,
                    handler: editHandler
                },
                {
                    icon: "cross",
                    content: <span>Delete color</span>,
                    disabled: PaletteWorker.palette.length <= config.MIN_PALETTE_COLORS,
                    handler: deleteHandler
                }
            ]]
        });
    }
    
    return (
        <Tooltip
            delay={ .6 }
            placement="left"
            tooltip={ <div className="slot flex-column">
                <span>Double tap to edit!</span>
                <span className="text-muted">{ hslToHex(props.color) }</span>
            </div> }
        >
            <div className={ className } ref={ ref }>
                <div 
                    onClick={ selectHandler }
                    onDoubleClick={ editHandler }
                    onContextMenu={ onContextHandler }
                    className="palette-color"
                    style={ { background: hslToHex(props.color) } } 
                />
            </div>
        </Tooltip>
    );
};

export default PaletteColorComponent;