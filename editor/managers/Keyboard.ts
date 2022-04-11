import { trigger, Trigger } from "../../states/State";

export class Keyboard {

    isCtrl: boolean
    isShift: boolean
    isAlt: boolean
    isEsc: boolean
    isEnter: boolean
    keysPressed: { [key: string]: boolean }

    private OnKeyDownTrigger: Trigger<KeyboardEvent>
    private OnKeyPressTrigger: Trigger<KeyboardEvent>
    private OnKeyUpTrigger: Trigger<KeyboardEvent>
    private OnKeyUpPressTrigger: Trigger<KeyboardEvent>
    private OnEscapeTrigger: Trigger

    private pressed: boolean
    private released: boolean

    constructor() {
        this.isCtrl = false;
        this.isShift = false;
        this.isAlt = false;
        this.isEsc = false;
        this.isEnter = false;
        this.keysPressed = {};

        this.OnKeyDownTrigger = trigger("keyboard-key-down");
        this.OnKeyPressTrigger = trigger("keyboard-key-press");
        this.OnKeyUpTrigger = trigger("keyboard-key-up");
        this.OnKeyUpPressTrigger = trigger("keyboard-key-up-down");
        this.OnEscapeTrigger = trigger("keyboard-escape");

        this.pressed = false;
        this.released = false;
    }

    init() {
        window.addEventListener("keydown", e => {
            this.released = false;
                
            this.keysPressed[e.code.toLowerCase()] = true;

            this.isAlt = e.altKey;
            this.isCtrl = e.ctrlKey;
            this.isShift = e.shiftKey;
            this.isEsc = e.code == "Escape";
            this.isEnter = e.code == "Enter";

            this.OnKeyDownTrigger.trigger(e);
            if (!this.pressed) {
                this.OnKeyUpPressTrigger.trigger(e);
                this.OnKeyPressTrigger.trigger(e);
                if (e.code == "Escape")
                    this.OnEscapeTrigger.trigger(true);
                this.pressed = true;
            }
        });
        window.addEventListener("keyup", e => {
            if (e.altKey)
                e.preventDefault();
    
            this.pressed = false;
                
            this.isCtrl = false;
            this.isShift = false;
            this.isEnter = false;
            this.isEsc = false;
            this.isAlt = false;
            
            this.OnKeyUpTrigger.trigger(e);
            if (!this.released) {
                this.OnKeyUpPressTrigger.trigger(e);
                this.released = true;
            }

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
    onKeyPress(callback: (event: KeyboardEvent) => void, customId?: string): () => void {
        return this.OnKeyPressTrigger.listen(callback, customId);
    }
    onKeyUp(callback: (event: KeyboardEvent) => void, customId?: string): () => void {
        return this.OnKeyUpTrigger.listen(callback, customId);
    }
    onKeyUpPress(callback: (event: KeyboardEvent) => void, customId?: string): () => void {
        return this.OnKeyUpPressTrigger.listen(callback, customId);
    }
    onEscape(callback: ()=> void, customId?: string): ()=> void {
        return this.OnEscapeTrigger.listen(callback, customId);
    }
}

export default new Keyboard();