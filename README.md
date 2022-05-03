# lazyFileLRU
mount remote file by URL to Emscripten fillesystem, with LRU buffer

This project builds on the lazyFile implementation in https://github.com/phiresky/sql.js-httpvfs.
In that implementation, the chunks are inserted (sparsely) into a javascript Array as they are loaded.

Here an LRU buffer (from [typescript-lru-cache](https://www.npmjs.com/package/typescript-lru-cache)) 
is used instead of an Array, with user-specified max size.

The same caveats apply to this as the original: it must be run in a web worker as it relies on synchronous fetch operations.

An example worker is specified in [./src/adv_worker.ts](./src/adv_worker.ts), (and compiled in [./dist/adv_worker.js](./dist/adv_worker.js))
