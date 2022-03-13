import HotkeysWorker from "../../editor/workers/HotkeysWorker";
import createClassName from "../../src/hooks/createClassName";
import { MyComponent } from "../../utils/types";
import { capitalize } from "../../utils/utils";

interface IHotkeysBuilder {
    justText?: boolean
    variants: string | string[]
}

export const Key: React.FC<{ keys: string[] } & MyComponent> = props=> (
    <span className={ createClassName(["key", props.className]) }>{ props.keys.map(keyName=>
        capitalize(keyName)
    ).join("+") }</span>
);
export const HotkeysBuilder: React.FC<IHotkeysBuilder> = props=> {
    const variants: string[] = typeof props.variants == "string" ? HotkeysWorker.keysBinds[props.variants].variants : props.variants;
    
    return <>{
        variants.map((variant, i)=> {
            const text = variant.split("+").map(key=> {
                const outKey = key.toLowerCase().replace("digit", "").replace("key", "");
                return capitalize(outKey);
            }).join("+");
            
            if (props.justText)
                return text;
            return <Key key={ i } keys={ [ text ] } />
        })
    }</>;
};