export default {
    get DEBUG(): boolean {
        return process.env.NODE_ENV.toLowerCase() == "development";
    },
    LOG_TRIGGERS: false,
    LOG_STATES: false,
    
    MAX_CANVAS_WIDTH: 960,
    MAX_CANVAS_HEIGHT: 960,
    CANVAS_WIDTH: 64,
    CANVAS_HEIGHT: 64,
    UI_SCALE: 12,
    
    EMPTY_PIXEL_COLOR: "rgba(0,0,0,0)",
    POINTER_COLOR: "rgba(255, 255, 255, .2)",
    SELECTION_COLOR: "rgba(255, 255, 255, .2)",
    MAX_TOOL_SIZE: 100,
    MIN_TOOL_SIZE: 1,

    IMAGE_DATA_PREFIX: "<IMAGE_DATA>",
    PROJECT_NAME_PREFIX: "project:",

    MIN_PALETTE_COLORS: 3,
    MAX_PALETTE_COLORS: 56,

    MAX_EXPORT_IMAGE_SCALE: 30,
    MIN_EXPORT_IMAGE_SCALE: 1,
    MAX_CANVAS_SCALE: 4,
    MAX_HISTORY_LENGTH: 80,

    MAX_ZOOM: 26,
    CHECKERBOARD_DENSITY: 32
} as const;