import ArrayModifier from "../modifiers/ArrayModifier";
import DecayModifier from "../modifiers/DecayModifier";
import Modifier, { ModifierType } from "../modifiers/Modifier";

class ModifiersWorker {
    modifiers!: {
        [type: number]: Modifier
    }
    
    constructor() {
        
    }

    init() {
        this.modifiers = {
            [ModifierType.ARRAY]: new ArrayModifier().init(),
            [ModifierType.STROKE]: new ArrayModifier().init(),
            [ModifierType.DECAY]: new DecayModifier().init(),
        }
    }

    renderModifier(type: ModifierType, props: any[]) {
        this.modifiers[type].render(props);
    }
    getModifier(type: ModifierType): Modifier {
        return this.modifiers[type];
    }
}
export default new ModifiersWorker();