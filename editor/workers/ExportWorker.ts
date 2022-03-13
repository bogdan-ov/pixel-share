import LayersWorker from "./LayersWorker";

class ExportWorker {
    constructor() {

    }

    async exportAsPNG(name: string="gay-ass-nigga", scale: number=1) {
        const url = await LayersWorker.makeBlobFromAllLayers(scale);

        const downloader = document.createElement("a");
        downloader.download = `${ name }.png`;
        downloader.href = url;
        downloader.click();
    }
}

export default new ExportWorker();