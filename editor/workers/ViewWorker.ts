import State, { state } from "../../states/State";
import config from "../../utils/config";
import { HSLA } from "../../utils/types";

class ViewWorker {
    GridEnabled: State<boolean>
    GridWidth: State<number>
    GridHeight: State<number>
    GridColor: State<HSLA>
    
    constructor() {
        this.GridEnabled = state<boolean>(false, "view-grid-enabled");
        this.GridWidth = state<number>(config.INIT_GRID_WIDTH, "view-grid-width")
        this.GridHeight = state<number>(config.INIT_GRID_HEIGHT, "view-grid-height")
        this.GridColor = state<HSLA>(config.INIT_GRID_COLOR, "view-grid-color");
    }

    init() {
        
    }
}
export default new ViewWorker();