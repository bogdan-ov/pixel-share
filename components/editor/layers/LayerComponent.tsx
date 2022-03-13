import { motion, Reorder, useAnimation, Variants } from "framer-motion";
import React, { useEffect, useState } from "react";
import Layer from "../../../editor/layers/Layer";
import ActionWorker from "../../../editor/workers/ActionWorker";
import LayersWorker from "../../../editor/workers/LayersWorker";
import createClassName from "../../../src/hooks/createClassName";
import { EditorWrongActionType, EditorActionType, EditorTriggers } from "../../../states/editor-states";
import { ActionButton } from "../../buttons/Buttons";
import Icon from "../../Icon";
import RenamableText from "../../ui/inputs/RenamableText";
import HistoryWorker, { HistoryItemType } from "../history/HistoryWorker";

interface ILayerComponent {
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
    const [blob, setBlob] = useState<string>("");
    const animation = useAnimation();
    const [pointerPressed, setPointerPressed] = useState<boolean>(false);
    
    const className = createClassName([
        "layer",
        LayersWorker.layerIsCurrent(props.id) ? "active" : "",
    ]);
    
    useEffect(()=> {

        editListener();
        const unlistenEdit = EditorTriggers.Edit.listen(editListener, `layer-component-edit-${ props.id }`);
        const unlistenWrongAction = EditorTriggers.WrongAction.listen(wrongActionListener, `layer-component-wrong-action-${ props.id }`);
        
        //
        createAnimation();

        return ()=> {
            // unlistenAction();
            unlistenWrongAction();
            unlistenEdit();
        };
    }, []);
    useEffect(()=> {

        function pointermove(e: PointerEvent) {
            if (!pointerPressed) return;
            // Move layers

            if (e.movementY > 3) {
                moveHandler(1);
                setPointerPressed(false);
            } else if (e.movementY < -3) {
                moveHandler(-1);
                setPointerPressed(false);
            }
        }
        function pointerup() {
            setPointerPressed(false);
        }

        window.addEventListener("pointermove", pointermove);
        window.addEventListener("pointerup", pointerup);

        return ()=> {
            window.removeEventListener("pointermove", pointermove);
            window.removeEventListener("pointerup", pointerup);
        }

    }, [pointerPressed]);

    function moveHandler(dir: number) {
        if (LayersWorker.layerIsEditable(props.id))
            LayersWorker.moveLayer(props.id, dir);
        else
            shakeAnimation();
    }
    function wrongActionListener(wrongAction: EditorWrongActionType) {
        // Cannot edit this layer
        if (wrongAction == EditorWrongActionType.LOCKED_LAYER && LayersWorker.layerIsCurrent(props.id)) {
            shakeAnimation();
        }
    }
    function editListener() {
        LayersWorker.getLayer(props.id)?.makeBlob()
            .then(res=> setBlob(res));
    }

    function chooseHandler() {
        LayersWorker.CurrentLayerId.value = props.id;
    }
    function onContextHandler(e: React.MouseEvent) {
        EditorTriggers.ContextMenu.trigger({
            title: <div className="slot justify-between">
                <span className="text-muted p-1">{ props.name }</span>
                <div className="slot">
                    <ActionButton 
                        ghost
                        title="Move up"
                        size="small"
                        icon="small-arrow-up"
                        onClick={ ()=> moveHandler(-1) }
                    />
                    <ActionButton 
                        ghost
                        title="Move down"
                        size="small"
                        icon="small-arrow-down"
                        onClick={ ()=> moveHandler(1) }
                    />
                </div>
            </div>,
            event: e,
            minWidth: 240,
            buttonsGroups: [[
                {
                    icon: "rename-layer",
                    content: <span>Rename layer</span>,
                    handler: ()=> ActionWorker.renameLayerTrigger(props.id),
                    hotkeysName: "rename-layer-trigger"
                },
                {
                    icon: "delete-layer",
                    content: <span>Delete layer</span>,
                    disabled: LayersWorker.normalLayers.length <= 1,
                    handler: ()=> ActionWorker.deleteLayerTrigger(props.id),
                    hotkeysName: "delete-layer-trigger"
                },
            ],
            [
                {
                    content: <span>Clear layer</span>,
                    handler: ()=> ActionWorker.clearLayerCanvasTrigger(props.id),
                    hotkeysName: "clear-layer-canvas-area-trigger"
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
            ]]
        });
    }
    function toggleVisibleHandler() {
        LayersWorker.toggleLayerVisible(props.id);
    }
    function toggleLockHandler() {
        LayersWorker.toggleLayerLock(props.id);
    }
    function renameHandler(newName: string) {
        HistoryWorker.save(HistoryItemType.LAYERS);
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