import { EditorStates } from "../../states/editor-states";
import config from "../../utils/config";
import Keyboard from "../managers/Keyboard";
import ActionWorker from "./ActionWorker";

class HotkeysWorker {
    keysBinds: {
        [bindName: string]: {
            variants: string[]
            actionName?: string
        }
    }

    constructor() {
        // Variants use `e.code`
        this.keysBinds = {
            // Tool
            "pen-switch": { variants: ["P", "digit1"] },
            "erase-switch": { variants: ["E", "digit2"] },
            "line-switch": { variants: ["L", "digit3"] },
            "selection-switch": { variants: ["S", "digit4"] },
            "fill-switch": { variants: ["F", "digit5"] },
            "rectangle-switch": { variants: ["R", "digit6"] },
            "checkerboard-switch": { variants: ["digit7"] },

            // Layers
            "rename-layer-trigger": { variants: ["f2"] },
            "clear-layer-canvas-area-trigger": { variants: ["delete"] },
            "delete-layer-trigger": { variants: ["shift+delete"] },

            // Selection
            "select-all": { variants: ["ctrl+A"] },
            "deselect-all": { variants: ["ctrl+shift+A"] },
            "copy-image-data": { variants: ["ctrl+c"] },
            "paste-image-data": { variants: ["ctrl+v"] },
            "cut-image-data": { variants: ["ctrl+x"] },

            // Mics
            "pick-color": { variants: ["ctrl+m0"] },

            // History
            "undo": { variants: ["ctrl+Z"] },
        };
    }

    init() {
        let pressed = false;
        
        Keyboard.onKeyDown(e=> {
            if (!pressed) {
                pressed = this.hotkeysInit(e);
            }
        }, "hotkeys-down")
        Keyboard.onKeyUp(e=> {
            pressed = false;
        }, "hotkeys-up")
    }

    hotkeysInit(e: KeyboardEvent): boolean {
        if (EditorStates.InputIsFocused.value || EditorStates.IsDrawing.value)
            return false;
        
        let pressed = false;

        const keysBindsNames = Object.keys(this.keysBinds);

        // For all key binds...
        for (const bindName of keysBindsNames) {
            const bind = this.keysBinds[bindName];

            for (const variant of bind.variants) {
                const keys = variant.split("+");

                // Get ctrl or shift key index in variant
                const ctrlIndex = keys.indexOf("ctrl");
                const shiftIndex = keys.indexOf("shift");

                // Check if ctrl/shift key pressed or not
                if (
                    (ctrlIndex >= 0 ? Keyboard.isCtrl : !Keyboard.isCtrl) &&
                    (shiftIndex >= 0 ? Keyboard.isShift : !Keyboard.isShift)
                ) {
                    // Get last key in variant(key like A or 4)
                    const lastKey = keys.at(-1);

                    if (
                        lastKey &&
                        e.code.toLowerCase().replace("key", "") == lastKey.toLowerCase().replace("key", "") &&
                        !pressed
                    ) {
                        const actionName = bind.actionName || bindName;
                        const action = ActionWorker.registered[actionName];

                        if (action) {
                            e.preventDefault();
                            action();
                            return true;
                        } else
                            // ? DEBUG
                            config.DEBUG && console.error(`Action with name "${ actionName }" not found!`);
                        
                        pressed = true;
                        return false;
                    }
                }

            }

        }

        return false;
    
    }
}

export default new HotkeysWorker();