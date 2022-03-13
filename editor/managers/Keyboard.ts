import { trigger, Trigger } from "../../states/State";

export class Keyboard {

    isCtrl: boolean
    isShift: boolean
    isAlt: boolean
    isEsc: boolean
    isEnter: boolean
    keysPressed: { [key: string]: boolean }

    private OnKeyDownTrigger: Trigger<KeyboardEvent>
    private OnKeyUpTrigger: Trigger<KeyboardEvent>
    private OnKeyUpDownTrigger: Trigger<KeyboardEvent>
    private OnEscapeTrigger: Trigger

    constructor() {
        this.isCtrl = false;
        this.isShift = false;
        this.isAlt = false;
        this.isEsc = false;
        this.isEnter = false;
        this.keysPressed = {};

        this.OnKeyDownTrigger = trigger("keyboard-key-down");
        this.OnKeyUpTrigger = trigger("keyboard-key-up");
        this.OnKeyUpDownTrigger = trigger("keyboard-key-up-down");
        this.OnEscapeTrigger = trigger("keyboard-escape");
    }

    init() {
        window.addEventListener("keydown", e => {
            if (e.altKey)
                e.preventDefault();

            this.keysPressed[e.code.toLowerCase()] = true;

            this.isCtrl = e.ctrlKey;
            this.isShift = e.shiftKey;
            this.isAlt = e.altKey;
            this.isEsc = e.code == "Escape";
            this.isEnter = e.code == "Enter";

            this.OnKeyDownTrigger.trigger(e);
            this.OnKeyUpDownTrigger.trigger(e);
            if (e.code == "Escape")
                this.OnEscapeTrigger.trigger(true);
        });
        window.addEventListener("keyup", e => {
            if (e.altKey)
                e.preventDefault();
    
            this.isCtrl = false;
            this.isShift = false;
            this.isAlt = false;
            
            this.OnKeyUpTrigger.trigger(e);
            this.OnKeyUpDownTrigger.trigger(e);

            delete this.keysPressed[e.code.toLowerCase()];
        });
        window.addEventListener("pointerdown", e => {
            if (e.button == 0)
                this.keysPressed["m0"] = true;
            else if (e.button == 2)
                this.keysPressed["m2"] = true;
        });
        window.addEventListener("pointerup", e => {
            if (e.button == 0)
                delete this.keysPressed["m0"];
            else if (e.button == 2)
                delete this.keysPressed["m2"];
        });
    }

    onKeyDown(callback: (event: KeyboardEvent) => void, customId?: string): () => void {
        return this.OnKeyDownTrigger.listen(callback, customId);
    }
    onKeyUp(callback: (event: KeyboardEvent) => void, customId?: string): () => void {
        return this.OnKeyUpTrigger.listen(callback, customId);
    }
    onKeyUpDown(callback: (event: KeyboardEvent) => void, customId?: string): () => void {
        return this.OnKeyUpDownTrigger.listen(callback, customId);
    }
    onEscape(callback: ()=> void, customId?: string): ()=> void {
        return this.OnEscapeTrigger.listen(callback, customId);
    }
}

export default new Keyboard();