import { motion, useAnimation, Variants } from "framer-motion";
import React, { useEffect, useState } from "react";
import Layer from "../../../editor/layers/Layer";
import LayersWorker from "../../../editor/workers/LayersWorker";
import createClassName from "../../../src/hooks/createClassName";
import { EditorWrongActionType, EditorActionType, EditorTriggers, EditorStates, IEditorWrongActionTrigger } from "../../../states/editor-states";
import Icon from "../../Icon";
import Button from "../../ui/buttons/Button";
import RenamableText from "../../ui/inputs/RenamableText";
import HistoryWorker, { HistoryItemType } from "../history/HistoryWorker";

export interface ILayerComponent {
    id: Layer["id"]
    name: Layer["name"]
    visible: boolean
    locked: boolean

    value: Layer
}

const variants: Variants = {
    initial: {},
    animate: {},
    shake: {
        x: [0, -20, 20, -15, 10, -5, 2, -2, 0],
        transition: {
            ease: "easeInOut",
            duration: .5
        }
    },
};

const LayerComponent: React.FC<ILayerComponent> = props=> {
    const animation = useAnimation();
    const [blob, setBlob] = useState<string>("");
    const [pointerPressed, setPointerPressed] = useState<boolean>(false);
    const [selected, setSelected] = useState<boolean>(false);
    
    const className = createClassName([
        "layer",
        LayersWorker.layerIsCurrent(props.id) && "active",
        selected && "selected"
    ]);
    
    useEffect(()=> {

        editedListener();
        const unlistenEdit = EditorTriggers.Edited.listen(editedListener, `layer-component-edited-${ props.id }`);
        const unlistenWrongAction = EditorTriggers.WrongAction.listen(wrongActionListener, `layer-component-wrong-action-${ props.id }`);
        const unlistenContextIsActive = EditorStates.ContextMenuIsActive.listen(active=> {
            if (!active)
                setSelected(false);
        })
        
        //
        createAnimation();

        return ()=> {
            unlistenWrongAction();
            unlistenEdit();
            unlistenContextIsActive();
        };
    }, []);
    useEffect(()=> {

        let movementY = 0;

        function pointermove(e: PointerEvent) {
            if (!pointerPressed || e.button != 0) return;
            movementY = e.movementY;
        }
        function pointerup() {
            // Move layer
            if (!pointerPressed) return;

            if (movementY > 1) {
                move(1);
            } else if (movementY < -1) {
                move(-1);
            }
            
            setPointerPressed(false);
        }

        window.addEventListener("pointermove", pointermove);
        window.addEventListener("pointerup", pointerup);

        return ()=> {
            window.removeEventListener("pointermove", pointermove);
            window.removeEventListener("pointerup", pointerup);
        }

    }, [pointerPressed]);

    function move(dir: number) {
        if (LayersWorker.layerIsEditable(props.id))
            LayersWorker.moveLayer(props.id, dir);
        else
            shakeAnimation();
    }
    function wrongActionListener(wrongAction: IEditorWrongActionTrigger) {
        // Cannot edit this layer
        if (wrongAction.type == EditorWrongActionType.UNEDITABLE_LAYER && LayersWorker.layerIsCurrent(props.id)) {
            shakeAnimation();
        }
    }
    function editedListener() {
        const data = LayersWorker.getLayer(props.id)?.getDataUrl();
        if (data)
            setBlob(data);
    }

    function chooseHandler() {
        LayersWorker.CurrentLayerId.value = props.id;
    }
    function onContextHandler(e: React.MouseEvent) {
        setSelected(true);
        
        EditorTriggers.ContextMenu.trigger({
            targetId: props.id,
            header: <div className="slot justify-between p-1">
                <span className="text-muted">{ props.name }</span>
                <div className="slot">
                    <Button
                        ghost
                        title="Move up"
                        size="small"
                        icon="small-arrow-up"
                        onClick={ ()=> move(-1) }
                    />
                    <Button 
                        ghost
                        title="Move down"
                        size="small"
                        icon="small-arrow-down"
                        onClick={ ()=> move(1) }
                    />
                </div>
            </div>,
            event: e,
            minWidth: 240,
            buttonsGroups: [[
                {
                    icon: "add-layer",
                    content: <span>Add layer below</span>,
                    actionName: "add-layer-trigger"
                },
                {
                    icon: "rename-layer",
                    content: <span>Rename layer</span>,
                    actionName: "rename-layer-trigger",
                },
                {
                    icon: "delete-layer",
                    content: <span>Delete layer</span>,
                    disabled: LayersWorker.normalLayers.length <= 1,
                    actionName: "delete-layer-trigger",
                },
            ],
            [
                {
                    content: <span>Clear layer</span>,
                    actionName: "clear-layer-canvas-area-trigger",
                },
                {
                    content: <span>Duplicate layer</span>,
                    actionName: "duplicate-layer-trigger",
                },
                {
                    content: <span>Merge visible layers</span>,
                    actionName: "merge-visible-layers-trigger",
                },
                {
                    icon: props.locked ? "lock" : "unlock",
                    content: <span>Toggle lock</span>,
                    handler: ()=> toggleLockHandler(),
                },
                {
                    icon: props.visible ? "visible" : "hidden",
                    content: <span>Toggle visible</span>,
                    handler: ()=> toggleVisibleHandler(),
                },
            ]],
        });
    }
    function toggleVisibleHandler() {
        LayersWorker.toggleLayerVisible(props.id);
    }
    function toggleLockHandler() {
        LayersWorker.toggleLayerLock(props.id);
    }
    function renameHandler(newName: string) {
        HistoryWorker.pushToPast(HistoryItemType.LAYERS);
        // EditorTriggers.History.trigger(HistoryItemType.LAYERS, "layer-worker")

        LayersWorker.renameLayer(props.id, newName);
    }

    // Animations
    function shakeAnimation() {
        animation.start("shake");
    }
    function createAnimation() {
        animation.start("animate")
    }
    
    return (
        <motion.div
            onContextMenu={ onContextHandler }
            onPointerDown={ ()=> setPointerPressed(true) }
            className={ className }
        
            variants={ variants }
            initial="initial"
            animate={ animation }
        >
            <main
                onClick={ chooseHandler }
                className="layer-content flex items-center gap-2 width-fill"
            >

                <div className="layer-blob-wrapper">
                    { blob && <img className="layer-blob" alt="Layer blob" src={ blob } />}
                </div>
                <RenamableText 
                    value={ props.name }
                    onSubmit={ renameHandler }
                    allow={ trigger=>
                        trigger.type == EditorActionType.RENAME_LAYER && trigger.targetId == props.id
                    }
                    maxLength={ 30 }
                />
                
            </main>

            <div className="layer-action-buttons flex flex-column">
                <button 
                    className={ ["button ghost small", props.locked ? "show" : ""].join(" ") }
                    onClick={ toggleLockHandler }
                    title={ props.locked ? "Unlock layer" : "Lock layer" }
                ><Icon icon={ props.locked ? "lock" : "unlock" } /></button>
                <button 
                    className={ ["button ghost small", !props.visible ? "show" : ""].join(" ") }
                    onClick={ toggleVisibleHandler }
                    title={ props.visible ? "Hide layer" : "Show layer" }
                ><Icon icon={ props.visible ? "visible" : "hidden" } /></button>
            </div>

        </motion.div>
    );
};

export default LayerComponent;