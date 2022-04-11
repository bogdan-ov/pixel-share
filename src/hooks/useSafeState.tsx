import { useState } from "react";
import { ReactSimpleState, ReactState } from "../../utils/types";

export default function useSafeState<T>(initialValue: T, state: T | undefined, setState: ReactState<T> | ReactSimpleState<T> | undefined): [T, ReactState<T> | ReactSimpleState<T>] {
    if (state !== undefined && setState !== undefined)
        return [state, setState];
    else
        return useState<T>(initialValue);
}