import { useEffect, useState } from "react";
import State, { Trigger } from "../../states/State";

export default function useStateListener<T>(state: State<T>, customId?: string): [T, State<T>] {
    const [value, setValue] = useState<number>(0);

    useEffect(()=> 
        // Auto unlisten
        state.listen(()=> {
            setValue(Date.now());
        }, customId),
    []);
    
    return [state.value, state];
}
export function useJustStatesListener(states: (State | Trigger)[], customId: string) {
    const [value, setValue] = useState<number>(0);

    useEffect(()=> {
        for (const state of states)
            state.listen(()=> {
                setValue(Date.now());
            }, customId, true);
        return ()=> {
            for (const state of states)
                state.unlisten(customId);
        }
    }, []);
    // const a = useStateListener
}