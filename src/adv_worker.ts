import { File, ready, Group, Dataset, BrokenSoftLink, ExternalLink } from "h5wasm";
import  { createLazyFile } from './lazyFileLRU';

export type {};

declare var self: MyWorkerGlobalScope;
interface MyWorkerGlobalScope extends Worker {
    file: File;
    import: object;
}
var file: File;

const DEMO_FILEPATH="https://ncnr.nist.gov/pub/ncnrdata/ngbsans/202009/nonims294/data/sans114140.nxs.ngb?gzip=false";

self.onmessage = async function (event) {
    const { action, payload } = event.data;
    if (action === "load") {
        const url = payload?.url ?? DEMO_FILEPATH;
        const requestChunkSize = payload?.requestChunkSize ?? 1024 * 1024;
        const LRUSize = payload?.LRUSize ?? 50;
        const { FS } = await ready;
        const config = {
            rangeMapper: (fromByte: number, toByte: number) => ({url, fromByte, toByte}),
            requestChunkSize,
            LRUSize
        }
        //hdf5.FS.createLazyFile('/', "current.h5", DEMO_FILEPATH, true, false);
        createLazyFile(FS, '/', 'current.h5', true, false, config);
        file = new File("current.h5");
    }
    else if (action === "get") {
        await ready;
        if (file) {
            const path = payload?.path ?? "entry";
            const item = file.get(path);
            if (item instanceof Group) {
                self.postMessage({
                    type: item.type,
                    attrs: item.attrs,
                    children: [...item.keys()] 
                });
            } else if (item instanceof Dataset) {
                const value = (payload.slice) ? item.slice(payload.slice) : item.value;
                self.postMessage({
                    type: item.type,
                    attrs: item.attrs,
                    value
                });
            } else if (item instanceof BrokenSoftLink || item instanceof ExternalLink) {
                self.postMessage(item);
            }
            else {
                self.postMessage({
                    type: "error",
                    value: `item ${path} not found`
                })
            }
        }
    }
  };
