import React, { useEffect, useState } from "react";
import Keyboard from "../../../editor/managers/Keyboard";
import { EditorStates, EditorTriggers, IEditorAction } from "../../../states/editor-states";

interface IRenamableText {
    value: string
    onSubmit: (value: string)=> void
    allow: (action: IEditorAction)=> boolean 
    
    maxLength?: number
    onEdit?: ()=> void
}

const RenamableText: React.FC<IRenamableText> = props=> {
    const [isRenaming, setIsRenaming] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>(props.value);
    
    useEffect(()=> {
        const unlistenAction = EditorTriggers.Action.listen(action=> {
            if (props.allow(action))
                setIsRenaming(true);
        });
        const unlistenKeyboard = Keyboard.onEscape(()=> {
            setIsRenaming(false);
        });

        return ()=> {
            unlistenAction();
            unlistenKeyboard();
        }
    }, []);
    useEffect(()=> {
        if (isRenaming && props.onEdit)
            props.onEdit();
            
        setNewName(props.value);
        
    }, [isRenaming]);
    
    function renameHandler() {
        const result = newName.trim();
        props.onSubmit(result ? result : props.value);

        setIsRenaming(false);
        EditorStates.InputIsFocused.value = false;
    }
    function onFocusHandler() {
        EditorStates.InputIsFocused.value = true;
    }

    return isRenaming ? (
        <form className="rename-input-wrapper" onSubmit={ e=> { e.preventDefault(); renameHandler() } }>
            <input 
                autoFocus
                type="text" className="rename-input"
                value={ newName }
                onChange={ e=> setNewName(e.target.value) }
                onFocus={ onFocusHandler }
                onBlur={ renameHandler }
                maxLength={ props.maxLength }
            />
        </form>
    ) : <span title={ props.value } className="renamable-text" onDoubleClick={ ()=> setIsRenaming(true) }>
        { props.value }
    </span>
};

export default RenamableText;