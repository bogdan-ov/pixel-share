import config from "../utils/config";
import { random, randomId } from "../utils/math";

function createId(key: string, customId?: string): string {
    return `${key}:${customId || randomId()}`;
}

export default class State<T = any> {
    private _value: T
    key: string

    listeners: {
        [id: string]: (value: T) => void
    }

    constructor(value: T, key: string) {
        this._value = value;
        this.key = key;
        this.listeners = {};
    }

    get value() {
        return this._value;
    }
    set value(value: T) {
        this._value = value;
        this.notify();
    }
    set(value: (value: T) => T, noNotify?: boolean) {
        this.value = value(this.value);
        if (!noNotify)
            this.notify();
    }

    listen(listener: State<T>["listeners"][1], customId?: string) {
        const id = createId(this.key, customId);

        if (!this.listeners[id]) {
            this.listeners[id] = listener;
        } else
            config.DEBUG && console.error("This id is already used! (State)", id);

        return () => this.unlisten(id);
    }
    unlisten(id: string) {
        delete this.listeners[id];
        // config.DEBUG && console.log(id, "State unlisten!");
    }

    notify() {
        const keys = Object.keys(this.listeners);
        for (let i = 0; i < keys.length; i++) {
            this.listeners[keys[i]](this._value)
        }

        config.DEBUG && console.log(`State "${ this.key }" notify all!`);
    }
}
export class Trigger<T = any, A = any> {
    key: string
    listeners: {
        [id: string]: (value: T, from: string) => void
    }

    constructor(key: string) {
        this.key = key;
        this.listeners = {};
    }

    listen(listener: (value: T, from: string) => void, customId?: string) {
        const id = createId(this.key, customId);

        if (!this.listeners[id]) {
            this.listeners[id] = listener;
        } else
            console.error("This id is already used! (Trigger)", id);

        return () => this.unlisten(id);
    }
    unlisten(id: string) {
        delete this.listeners[id];
    }

    trigger(value: T, from?: string) {
        const keys = Object.keys(this.listeners);
        for (let i = 0; i < keys.length; i++) {
            const listener = this.listeners[keys[i]];
            if (listener)
                listener(value, from || "");
            else
                config.DEBUG && console.error(`Cannot find listener! "${ keys[i] }"`);
        }
    }
}

export function state<T = any>(value: T, key: string): State<T> {
    return new State<T>(value, key);
}
export function trigger<T = any>(key: string): Trigger<T> {
    return new Trigger<T>(key);
}