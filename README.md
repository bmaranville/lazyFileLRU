# lazyFileLRU
mount remote file by URL to Emscripten fillesystem, with LRU buffer

This project builds on the lazyFile implementation in https://github.com/phiresky/sql.js-httpvfs.
In that implementation, the chunks are inserted (sparsely) into a javascript Array as they are loaded.

Here an LRU buffer (from [typescript-lru-cache](https://www.npmjs.com/package/typescript-lru-cache)) 
is used instead of an Array, with user-specified max size.

The same caveats apply to this as the original: it must be run in a web worker as it relies on synchronous fetch operations.

An example worker is specified in [./src/adv_worker.ts](./src/adv_worker.ts), (and compiled in [./dist/adv_worker.js](./dist/adv_worker.js))

## Demo
The example can be tried at https://bmaranville.github.io/lazyFileLRU/
(the HDF5 file to be loaded must be on a server with range requests enabled, and compression disabled)

1. Enter a URL into the ```File URL:``` field
2. Click ```load```
3. Enter an HDF5 path into the ```path``` field
4. Click ```get```

(look at the network requests in the developer panel to see all the chunks being loaded)
