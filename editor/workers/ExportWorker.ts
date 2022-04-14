import { Extension } from "../../utils/types";
import LayersWorker from "./LayersWorker";

class ExportWorker {
    constructor() {

    }

    async exportAsPNG(name: string="new-picture", extension: Extension="png", scale: number=1) {
        const url = await LayersWorker.makeBlobFromAllLayers(scale);

        const downloader = document.createElement("a");
        downloader.download = `${ name }.${ extension }`;
        downloader.href = url;
        downloader.click();
    }
}

export default new ExportWorker();