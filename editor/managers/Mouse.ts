import { vec, Vector2 } from "../../utils/math";
import App from "../App";

export class Mouse {
    // app: Application
    
    pos: Vector2
    screenPos: Vector2
    movement: Vector2
    oldPos: Vector2
    startPos: Vector2
    // Set pos on click
    lastPos: Vector2
    
    isDown: boolean
    button: number

    inited: boolean
    
    constructor() {
        this.pos = vec();
        this.screenPos = vec();
        this.movement = vec();
        this.oldPos = vec();
        this.startPos = vec();
        this.lastPos = vec();
        
        this.isDown = false;
        this.button = 0;

        this.inited = false;
    }

    init() {
        if (this.inited) return;

        window.addEventListener("mousemove", e=> {
            
            this.pos.copy(this.calculatePosition(vec(e.clientX, e.clientY)));
            
            this.screenPos.set(e.clientX, e.clientY);
            this.movement.set(e.movementX, e.movementY);
        });
        
        App.workspaceElement.addEventListener("mousedown", e=> {
            this.isDown = true;
            this.button = e.button;

            this.startPos.copy(this.calculatePosition(vec(e.clientX, e.clientY)));
        })
        window.addEventListener("mouseup", e=> {
            this.isDown = false;
            this.lastPos.copy(this.calculatePosition(vec(e.clientX, e.clientY)));
        })

        this.inited = false;
    }
    
    onDown(listener: ()=> void, listenElement?: HTMLElement | Window) {
        (listenElement || App.workspaceElement).addEventListener("mousedown", listener);
        return ()=> (listenElement || App.workspaceElement).removeEventListener("mousedown", listener);
    }
    onUp(listener: ()=> void, listenElement?: HTMLElement | Window) {
        (listenElement || App.workspaceElement).addEventListener("mouseup", listener);
        return ()=> (listenElement || App.workspaceElement).removeEventListener("mouseup", listener);
    }
    onMove(listener: (pos: Vector2)=> void, listen?: HTMLElement | Window) {
        const lis = ()=> {
            listener(this.pos);
        }
        
        (listen || App.workspaceElement).addEventListener("mousemove", lis);
        return ()=> (listen || App.workspaceElement).removeEventListener("mousemove", lis);
    }
    onWheel(listener: (delta: Vector2, e: WheelEvent)=> void, listenElement?: HTMLElement | Window) {
        const lis = (e: WheelEvent)=> {
            listener(vec(e.deltaX, e.deltaY), e);
        }
        (listenElement || App.workspaceElement).addEventListener("wheel", lis as any);
        return ()=> (listenElement || App.workspaceElement).removeEventListener("wheel", lis as any);
    }
    
    //
    calculatePosition(vec: Vector2): Vector2 {
        const bounds = App.canvasLayersElement.getBoundingClientRect();
        
        return new Vector2(
            Math.floor((vec.x - bounds.left) / App.zoom + ((App.currentToolSize+1)%2)/2) - Math.floor(App.currentToolSize/2),
            Math.floor((vec.y - bounds.top) / App.zoom + ((App.currentToolSize+1)%2)/2) - Math.floor(App.currentToolSize/2)
        );
    }
}

export default new Mouse();