import CheckerboardTool from "./drawing/CheckerboardTool";
import EraseTool from "./drawing/EraseTool";
import FillTool from "./drawing/FillTool";
import LineTool from "./drawing/LineTool";
import PenTool from "./drawing/PenTool";
import RectangleTool from "./drawing/RectangleTool";
import SelectionTool from "./editing/SelectionTool";

export enum ToolType {
    PEN,
    ERASE,
    LINE,
    RECTANGLE,
    FILL,
    SELECTION,
    CHECKERBOARD,
}

export default {
    [ToolType.PEN]: new PenTool(),
    [ToolType.ERASE]: new EraseTool(),
    [ToolType.LINE]: new LineTool(),
    [ToolType.SELECTION]: new SelectionTool(),
    [ToolType.FILL]: new FillTool(),
    [ToolType.RECTANGLE]: new RectangleTool(),
    [ToolType.CHECKERBOARD]: new CheckerboardTool(),
}