import React, {  } from "react";
import useStateListener from "../src/hooks/useStateListener";
import State from "../states/State";

interface IJustStatesRenderer {
    states: (State)[]
    customId?: string
}

const JustStatesRenderer: React.FC<IJustStatesRenderer> = props=> {
    const _ = useStateListener(props.states[0]);
    
    return <div>{ props.children }</div>;
};

export default JustStatesRenderer;