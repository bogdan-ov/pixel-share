import React from "react";
import createClassName from "../../../../src/hooks/createClassName";
import { Anchor, ReactState } from "../../../../utils/types";
import Button from "../../../ui/buttons/Button";
import Tooltip from "../../../ui/windows/Tooltip";

interface IAnchorField {
    anchor: Anchor
    setAnchor: ReactState<Anchor>
}

const AnchorField: React.FC<IAnchorField> = props=> {
    return (
        <Tooltip
            tooltip={ <span>Anchor</span> }
            placement="bottom"
            offset={ -6 }
        >
            <div className="anchor">
                <AnchorCell type={ Anchor.TOP_LEFT } anchor={ props.anchor } setAnchor={ props.setAnchor } />
                <AnchorCell type={ Anchor.TOP_CENTER } anchor={ props.anchor } setAnchor={ props.setAnchor } />
                <AnchorCell type={ Anchor.TOP_RIGHT } anchor={ props.anchor } setAnchor={ props.setAnchor } />
                <AnchorCell type={ Anchor.CENTER_LEFT } anchor={ props.anchor } setAnchor={ props.setAnchor } />
                <AnchorCell type={ Anchor.CENTER_CENTER } anchor={ props.anchor } setAnchor={ props.setAnchor } />
                <AnchorCell type={ Anchor.CENTER_RIGHT } anchor={ props.anchor } setAnchor={ props.setAnchor } />
                <AnchorCell type={ Anchor.BOTTOM_LEFT } anchor={ props.anchor } setAnchor={ props.setAnchor } />
                <AnchorCell type={ Anchor.BOTTOM_CENTER } anchor={ props.anchor } setAnchor={ props.setAnchor } />
                <AnchorCell type={ Anchor.BOTTOM_RIGHT } anchor={ props.anchor } setAnchor={ props.setAnchor } />
            </div>
        </Tooltip>
    );
};

interface IAnchorCell {
    anchor: Anchor
    setAnchor: (v: Anchor)=> void
    type: Anchor
}
const AnchorCell: React.FC<IAnchorCell> = props=> {
    return (
        <Button
            onClick={ ()=> props.setAnchor(props.type) }
            className="anchor-cell"
            ghost
            active={ props.type == props.anchor }
            icon={ `arrow-${ Anchor[props.type].toLowerCase().replace("_", "-") }` as any }
        />
    );
};

AnchorField.displayName = "AnchorField";
export default AnchorField;