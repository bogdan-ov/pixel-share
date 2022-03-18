import CheckerboardTool from "./drawing/CheckerboardTool";
import EllipseTool from "./drawing/EllipseTool";
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
    ELLIPSE,
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
    [ToolType.ELLIPSE]: new EllipseTool(),
    [ToolType.CHECKERBOARD]: new CheckerboardTool(),
}