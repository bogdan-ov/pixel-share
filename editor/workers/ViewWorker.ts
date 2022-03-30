import State, { state } from "../../states/State";

class ViewWorker {
    GridEnabled: State<boolean>
    GridWidth: State<number>
    GridHeight: State<number>
    GridColor: State<string>
    
    constructor() {
        this.GridEnabled = state<boolean>(false, "view-grid-enabled");
        this.GridWidth = state<number>(8, "view-grid-width")
        this.GridHeight = state<number>(8, "view-grid-height")
        this.GridColor = state<string>("#000", "view-grid-color");
    }

    init() {
        
    }
}
export default new ViewWorker();