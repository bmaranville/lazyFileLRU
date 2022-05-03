(() => {
  // node_modules/h5wasm/dist/esm/hdf5_util.js
  var import_meta = {};
  var Module = (() => {
    var _scriptDir = import_meta.url;
    return function(Module3) {
      Module3 = Module3 || {};
      var Module3 = typeof Module3 !== "undefined" ? Module3 : {};
      var objAssign = Object.assign;
      var readyPromiseResolve, readyPromiseReject;
      Module3["ready"] = new Promise(function(resolve, reject) {
        readyPromiseResolve = resolve;
        readyPromiseReject = reject;
      });
      var moduleOverrides = objAssign({}, Module3);
      var arguments_ = [];
      var thisProgram = "./this.program";
      var quit_ = (status, toThrow) => {
        throw toThrow;
      };
      var ENVIRONMENT_IS_WEB = typeof window === "object";
      var ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
      var ENVIRONMENT_IS_NODE = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";
      var scriptDirectory = "";
      function locateFile(path) {
        if (Module3["locateFile"]) {
          return Module3["locateFile"](path, scriptDirectory);
        }
        return scriptDirectory + path;
      }
      var read_, readAsync, readBinary, setWindowTitle;
      if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
        if (ENVIRONMENT_IS_WORKER) {
          scriptDirectory = self.location.href;
        } else if (typeof document !== "undefined" && document.currentScript) {
          scriptDirectory = document.currentScript.src;
        }
        if (_scriptDir) {
          scriptDirectory = _scriptDir;
        }
        if (scriptDirectory.indexOf("blob:") !== 0) {
          scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
        } else {
          scriptDirectory = "";
        }
        {
          read_ = (url) => {
            try {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, false);
              xhr.send(null);
              return xhr.responseText;
            } catch (err2) {
              var data = tryParseAsDataURI(url);
              if (data) {
                return intArrayToString(data);
              }
              throw err2;
            }
          };
          if (ENVIRONMENT_IS_WORKER) {
            readBinary = (url) => {
              try {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, false);
                xhr.responseType = "arraybuffer";
                xhr.send(null);
                return new Uint8Array(xhr.response);
              } catch (err2) {
                var data = tryParseAsDataURI(url);
                if (data) {
                  return data;
                }
                throw err2;
              }
            };
          }
          readAsync = (url, onload, onerror) => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";
            xhr.onload = () => {
              if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                onload(xhr.response);
                return;
              }
              var data = tryParseAsDataURI(url);
              if (data) {
                onload(data.buffer);
                return;
              }
              onerror();
            };
            xhr.onerror = onerror;
            xhr.send(null);
          };
        }
        setWindowTitle = (title) => document.title = title;
      } else {
      }
      var out = Module3["print"] || console.log.bind(console);
      var err = Module3["printErr"] || console.warn.bind(console);
      objAssign(Module3, moduleOverrides);
      moduleOverrides = null;
      if (Module3["arguments"])
        arguments_ = Module3["arguments"];
      if (Module3["thisProgram"])
        thisProgram = Module3["thisProgram"];
      if (Module3["quit"])
        quit_ = Module3["quit"];
      var wasmBinary;
      if (Module3["wasmBinary"])
        wasmBinary = Module3["wasmBinary"];
      var noExitRuntime = Module3["noExitRuntime"] || true;
      if (typeof WebAssembly !== "object") {
        abort("no native wasm support detected");
      }
      var wasmMemory;
      var ABORT = false;
      var EXITSTATUS;
      function assert(condition, text) {
        if (!condition) {
          abort(text);
        }
      }
      function getCFunc(ident) {
        var func = Module3["_" + ident];
        return func;
      }
      function ccall(ident, returnType, argTypes, args, opts) {
        var toC = { "string": function(str) {
          var ret2 = 0;
          if (str !== null && str !== void 0 && str !== 0) {
            var len = (str.length << 2) + 1;
            ret2 = stackAlloc(len);
            stringToUTF8(str, ret2, len);
          }
          return ret2;
        }, "array": function(arr) {
          var ret2 = stackAlloc(arr.length);
          writeArrayToMemory(arr, ret2);
          return ret2;
        } };
        function convertReturnValue(ret2) {
          if (returnType === "string")
            return UTF8ToString(ret2);
          if (returnType === "boolean")
            return Boolean(ret2);
          return ret2;
        }
        var func = getCFunc(ident);
        var cArgs = [];
        var stack = 0;
        if (args) {
          for (var i = 0; i < args.length; i++) {
            var converter = toC[argTypes[i]];
            if (converter) {
              if (stack === 0)
                stack = stackSave();
              cArgs[i] = converter(args[i]);
            } else {
              cArgs[i] = args[i];
            }
          }
        }
        var ret = func.apply(null, cArgs);
        function onDone(ret2) {
          if (stack !== 0)
            stackRestore(stack);
          return convertReturnValue(ret2);
        }
        ret = onDone(ret);
        return ret;
      }
      function cwrap(ident, returnType, argTypes, opts) {
        argTypes = argTypes || [];
        var numericArgs = argTypes.every(function(type) {
          return type === "number";
        });
        var numericRet = returnType !== "string";
        if (numericRet && numericArgs && !opts) {
          return getCFunc(ident);
        }
        return function() {
          return ccall(ident, returnType, argTypes, arguments, opts);
        };
      }
      var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : void 0;
      function UTF8ArrayToString(heap, idx, maxBytesToRead) {
        var endIdx = idx + maxBytesToRead;
        var endPtr = idx;
        while (heap[endPtr] && !(endPtr >= endIdx))
          ++endPtr;
        if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
          return UTF8Decoder.decode(heap.subarray(idx, endPtr));
        } else {
          var str = "";
          while (idx < endPtr) {
            var u0 = heap[idx++];
            if (!(u0 & 128)) {
              str += String.fromCharCode(u0);
              continue;
            }
            var u1 = heap[idx++] & 63;
            if ((u0 & 224) == 192) {
              str += String.fromCharCode((u0 & 31) << 6 | u1);
              continue;
            }
            var u2 = heap[idx++] & 63;
            if ((u0 & 240) == 224) {
              u0 = (u0 & 15) << 12 | u1 << 6 | u2;
            } else {
              u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63;
            }
            if (u0 < 65536) {
              str += String.fromCharCode(u0);
            } else {
              var ch = u0 - 65536;
              str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
            }
          }
        }
        return str;
      }
      function UTF8ToString(ptr, maxBytesToRead) {
        return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
      }
      function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
        if (!(maxBytesToWrite > 0))
          return 0;
        var startIdx = outIdx;
        var endIdx = outIdx + maxBytesToWrite - 1;
        for (var i = 0; i < str.length; ++i) {
          var u = str.charCodeAt(i);
          if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023;
          }
          if (u <= 127) {
            if (outIdx >= endIdx)
              break;
            heap[outIdx++] = u;
          } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx)
              break;
            heap[outIdx++] = 192 | u >> 6;
            heap[outIdx++] = 128 | u & 63;
          } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx)
              break;
            heap[outIdx++] = 224 | u >> 12;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63;
          } else {
            if (outIdx + 3 >= endIdx)
              break;
            heap[outIdx++] = 240 | u >> 18;
            heap[outIdx++] = 128 | u >> 12 & 63;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63;
          }
        }
        heap[outIdx] = 0;
        return outIdx - startIdx;
      }
      function stringToUTF8(str, outPtr, maxBytesToWrite) {
        return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
      }
      function lengthBytesUTF8(str) {
        var len = 0;
        for (var i = 0; i < str.length; ++i) {
          var u = str.charCodeAt(i);
          if (u >= 55296 && u <= 57343)
            u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
          if (u <= 127)
            ++len;
          else if (u <= 2047)
            len += 2;
          else if (u <= 65535)
            len += 3;
          else
            len += 4;
        }
        return len;
      }
      function AsciiToString(ptr) {
        var str = "";
        while (1) {
          var ch = HEAPU8[ptr++ >> 0];
          if (!ch)
            return str;
          str += String.fromCharCode(ch);
        }
      }
      var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : void 0;
      function UTF16ToString(ptr, maxBytesToRead) {
        var endPtr = ptr;
        var idx = endPtr >> 1;
        var maxIdx = idx + maxBytesToRead / 2;
        while (!(idx >= maxIdx) && HEAPU16[idx])
          ++idx;
        endPtr = idx << 1;
        if (endPtr - ptr > 32 && UTF16Decoder) {
          return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
        } else {
          var str = "";
          for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
            var codeUnit = HEAP16[ptr + i * 2 >> 1];
            if (codeUnit == 0)
              break;
            str += String.fromCharCode(codeUnit);
          }
          return str;
        }
      }
      function stringToUTF16(str, outPtr, maxBytesToWrite) {
        if (maxBytesToWrite === void 0) {
          maxBytesToWrite = 2147483647;
        }
        if (maxBytesToWrite < 2)
          return 0;
        maxBytesToWrite -= 2;
        var startPtr = outPtr;
        var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
        for (var i = 0; i < numCharsToWrite; ++i) {
          var codeUnit = str.charCodeAt(i);
          HEAP16[outPtr >> 1] = codeUnit;
          outPtr += 2;
        }
        HEAP16[outPtr >> 1] = 0;
        return outPtr - startPtr;
      }
      function lengthBytesUTF16(str) {
        return str.length * 2;
      }
      function UTF32ToString(ptr, maxBytesToRead) {
        var i = 0;
        var str = "";
        while (!(i >= maxBytesToRead / 4)) {
          var utf32 = HEAP32[ptr + i * 4 >> 2];
          if (utf32 == 0)
            break;
          ++i;
          if (utf32 >= 65536) {
            var ch = utf32 - 65536;
            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
          } else {
            str += String.fromCharCode(utf32);
          }
        }
        return str;
      }
      function stringToUTF32(str, outPtr, maxBytesToWrite) {
        if (maxBytesToWrite === void 0) {
          maxBytesToWrite = 2147483647;
        }
        if (maxBytesToWrite < 4)
          return 0;
        var startPtr = outPtr;
        var endPtr = startPtr + maxBytesToWrite - 4;
        for (var i = 0; i < str.length; ++i) {
          var codeUnit = str.charCodeAt(i);
          if (codeUnit >= 55296 && codeUnit <= 57343) {
            var trailSurrogate = str.charCodeAt(++i);
            codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023;
          }
          HEAP32[outPtr >> 2] = codeUnit;
          outPtr += 4;
          if (outPtr + 4 > endPtr)
            break;
        }
        HEAP32[outPtr >> 2] = 0;
        return outPtr - startPtr;
      }
      function lengthBytesUTF32(str) {
        var len = 0;
        for (var i = 0; i < str.length; ++i) {
          var codeUnit = str.charCodeAt(i);
          if (codeUnit >= 55296 && codeUnit <= 57343)
            ++i;
          len += 4;
        }
        return len;
      }
      function allocateUTF8(str) {
        var size = lengthBytesUTF8(str) + 1;
        var ret = _malloc(size);
        if (ret)
          stringToUTF8Array(str, HEAP8, ret, size);
        return ret;
      }
      function writeArrayToMemory(array, buffer2) {
        HEAP8.set(array, buffer2);
      }
      function writeAsciiToMemory(str, buffer2, dontAddNull) {
        for (var i = 0; i < str.length; ++i) {
          HEAP8[buffer2++ >> 0] = str.charCodeAt(i);
        }
        if (!dontAddNull)
          HEAP8[buffer2 >> 0] = 0;
      }
      function alignUp(x, multiple) {
        if (x % multiple > 0) {
          x += multiple - x % multiple;
        }
        return x;
      }
      var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
      var HEAP64, HEAPU64;
      function updateGlobalBufferAndViews(buf) {
        buffer = buf;
        Module3["HEAP8"] = HEAP8 = new Int8Array(buf);
        Module3["HEAP16"] = HEAP16 = new Int16Array(buf);
        Module3["HEAP32"] = HEAP32 = new Int32Array(buf);
        Module3["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
        Module3["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
        Module3["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
        Module3["HEAPF32"] = HEAPF32 = new Float32Array(buf);
        Module3["HEAPF64"] = HEAPF64 = new Float64Array(buf);
        Module3["HEAP64"] = HEAP64 = new BigInt64Array(buf);
        Module3["HEAPU64"] = HEAPU64 = new BigUint64Array(buf);
      }
      var INITIAL_MEMORY = Module3["INITIAL_MEMORY"] || 16777216;
      var wasmTable;
      var __ATPRERUN__ = [];
      var __ATINIT__ = [];
      var __ATPOSTRUN__ = [];
      var runtimeInitialized = false;
      var runtimeExited = false;
      var runtimeKeepaliveCounter = 0;
      function keepRuntimeAlive() {
        return noExitRuntime || runtimeKeepaliveCounter > 0;
      }
      function preRun() {
        if (Module3["preRun"]) {
          if (typeof Module3["preRun"] == "function")
            Module3["preRun"] = [Module3["preRun"]];
          while (Module3["preRun"].length) {
            addOnPreRun(Module3["preRun"].shift());
          }
        }
        callRuntimeCallbacks(__ATPRERUN__);
      }
      function initRuntime() {
        runtimeInitialized = true;
        if (!Module3["noFSInit"] && !FS2.init.initialized)
          FS2.init();
        FS2.ignorePermissions = false;
        TTY.init();
        callRuntimeCallbacks(__ATINIT__);
      }
      function exitRuntime() {
        runtimeExited = true;
      }
      function postRun() {
        if (Module3["postRun"]) {
          if (typeof Module3["postRun"] == "function")
            Module3["postRun"] = [Module3["postRun"]];
          while (Module3["postRun"].length) {
            addOnPostRun(Module3["postRun"].shift());
          }
        }
        callRuntimeCallbacks(__ATPOSTRUN__);
      }
      function addOnPreRun(cb) {
        __ATPRERUN__.unshift(cb);
      }
      function addOnInit(cb) {
        __ATINIT__.unshift(cb);
      }
      function addOnPostRun(cb) {
        __ATPOSTRUN__.unshift(cb);
      }
      var runDependencies = 0;
      var runDependencyWatcher = null;
      var dependenciesFulfilled = null;
      function getUniqueRunDependency(id) {
        return id;
      }
      function addRunDependency(id) {
        runDependencies++;
        if (Module3["monitorRunDependencies"]) {
          Module3["monitorRunDependencies"](runDependencies);
        }
      }
      function removeRunDependency(id) {
        runDependencies--;
        if (Module3["monitorRunDependencies"]) {
          Module3["monitorRunDependencies"](runDependencies);
        }
        if (runDependencies == 0) {
          if (runDependencyWatcher !== null) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null;
          }
          if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback();
          }
        }
      }
      Module3["preloadedImages"] = {};
      Module3["preloadedAudios"] = {};
      function abort(what) {
        {
          if (Module3["onAbort"]) {
            Module3["onAbort"](what);
          }
        }
        what = "Aborted(" + what + ")";
        err(what);
        ABORT = true;
        EXITSTATUS = 1;
        what += ". Build with -s ASSERTIONS=1 for more info.";
        var e = new WebAssembly.RuntimeError(what);
        readyPromiseReject(e);
        throw e;
      }
      var dataURIPrefix = "data:application/octet-stream;base64,";
      function isDataURI(filename) {
        return filename.startsWith(dataURIPrefix);
      }
      var wasmBinaryFile;
      if (!isDataURI(wasmBinaryFile)) {
        wasmBinaryFile = locateFile(wasmBinaryFile);
      }
      function getBinary(file2) {
        try {
          if (file2 == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary);
          }
          var binary = tryParseAsDataURI(file2);
          if (binary) {
            return binary;
          }
          if (readBinary) {
            return readBinary(file2);
          } else {
            throw "both async and sync fetching of the wasm failed";
          }
        } catch (err2) {
          abort(err2);
        }
      }
      function getBinaryPromise() {
        if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
          if (typeof fetch === "function") {
            return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
              if (!response["ok"]) {
                throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
              }
              return response["arrayBuffer"]();
            }).catch(function() {
              return getBinary(wasmBinaryFile);
            });
          }
        }
        return Promise.resolve().then(function() {
          return getBinary(wasmBinaryFile);
        });
      }
      function createWasm() {
        var info = { "a": asmLibraryArg };
        function receiveInstance(instance, module) {
          var exports2 = instance.exports;
          Module3["asm"] = exports2;
          wasmMemory = Module3["asm"]["ma"];
          updateGlobalBufferAndViews(wasmMemory.buffer);
          wasmTable = Module3["asm"]["ta"];
          addOnInit(Module3["asm"]["na"]);
          removeRunDependency("wasm-instantiate");
        }
        addRunDependency("wasm-instantiate");
        function receiveInstantiationResult(result) {
          receiveInstance(result["instance"]);
        }
        function instantiateArrayBuffer(receiver) {
          return getBinaryPromise().then(function(binary) {
            return WebAssembly.instantiate(binary, info);
          }).then(function(instance) {
            return instance;
          }).then(receiver, function(reason) {
            err("failed to asynchronously prepare wasm: " + reason);
            abort(reason);
          });
        }
        function instantiateAsync() {
          if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") {
            return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
              var result = WebAssembly.instantiateStreaming(response, info);
              return result.then(receiveInstantiationResult, function(reason) {
                err("wasm streaming compile failed: " + reason);
                err("falling back to ArrayBuffer instantiation");
                return instantiateArrayBuffer(receiveInstantiationResult);
              });
            });
          } else {
            return instantiateArrayBuffer(receiveInstantiationResult);
          }
        }
        if (Module3["instantiateWasm"]) {
          try {
            var exports = Module3["instantiateWasm"](info, receiveInstance);
            return exports;
          } catch (e) {
            err("Module.instantiateWasm callback failed with error: " + e);
            return false;
          }
        }
        instantiateAsync().catch(readyPromiseReject);
        return {};
      }
      function throw_error(string_error) {
        throw UTF8ToString(string_error);
      }
      function callRuntimeCallbacks(callbacks) {
        while (callbacks.length > 0) {
          var callback = callbacks.shift();
          if (typeof callback == "function") {
            callback(Module3);
            continue;
          }
          var func = callback.func;
          if (typeof func === "number") {
            if (callback.arg === void 0) {
              getWasmTableEntry(func)();
            } else {
              getWasmTableEntry(func)(callback.arg);
            }
          } else {
            func(callback.arg === void 0 ? null : callback.arg);
          }
        }
      }
      var wasmTableMirror = [];
      function getWasmTableEntry(funcPtr) {
        var func = wasmTableMirror[funcPtr];
        if (!func) {
          if (funcPtr >= wasmTableMirror.length)
            wasmTableMirror.length = funcPtr + 1;
          wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
        }
        return func;
      }
      function ___cxa_allocate_exception(size) {
        return _malloc(size + 16) + 16;
      }
      function ExceptionInfo(excPtr) {
        this.excPtr = excPtr;
        this.ptr = excPtr - 16;
        this.set_type = function(type) {
          HEAP32[this.ptr + 4 >> 2] = type;
        };
        this.get_type = function() {
          return HEAP32[this.ptr + 4 >> 2];
        };
        this.set_destructor = function(destructor) {
          HEAP32[this.ptr + 8 >> 2] = destructor;
        };
        this.get_destructor = function() {
          return HEAP32[this.ptr + 8 >> 2];
        };
        this.set_refcount = function(refcount) {
          HEAP32[this.ptr >> 2] = refcount;
        };
        this.set_caught = function(caught) {
          caught = caught ? 1 : 0;
          HEAP8[this.ptr + 12 >> 0] = caught;
        };
        this.get_caught = function() {
          return HEAP8[this.ptr + 12 >> 0] != 0;
        };
        this.set_rethrown = function(rethrown) {
          rethrown = rethrown ? 1 : 0;
          HEAP8[this.ptr + 13 >> 0] = rethrown;
        };
        this.get_rethrown = function() {
          return HEAP8[this.ptr + 13 >> 0] != 0;
        };
        this.init = function(type, destructor) {
          this.set_type(type);
          this.set_destructor(destructor);
          this.set_refcount(0);
          this.set_caught(false);
          this.set_rethrown(false);
        };
        this.add_ref = function() {
          var value = HEAP32[this.ptr >> 2];
          HEAP32[this.ptr >> 2] = value + 1;
        };
        this.release_ref = function() {
          var prev = HEAP32[this.ptr >> 2];
          HEAP32[this.ptr >> 2] = prev - 1;
          return prev === 1;
        };
      }
      var exceptionLast = 0;
      var uncaughtExceptionCount = 0;
      function ___cxa_throw(ptr, type, destructor) {
        var info = new ExceptionInfo(ptr);
        info.init(type, destructor);
        exceptionLast = ptr;
        uncaughtExceptionCount++;
        throw ptr;
      }
      function _tzset_impl() {
        var currentYear = new Date().getFullYear();
        var winter = new Date(currentYear, 0, 1);
        var summer = new Date(currentYear, 6, 1);
        var winterOffset = winter.getTimezoneOffset();
        var summerOffset = summer.getTimezoneOffset();
        var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
        HEAP32[__get_timezone() >> 2] = stdTimezoneOffset * 60;
        HEAP32[__get_daylight() >> 2] = Number(winterOffset != summerOffset);
        function extractZone(date) {
          var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
          return match ? match[1] : "GMT";
        }
        var winterName = extractZone(winter);
        var summerName = extractZone(summer);
        var winterNamePtr = allocateUTF8(winterName);
        var summerNamePtr = allocateUTF8(summerName);
        if (summerOffset < winterOffset) {
          HEAP32[__get_tzname() >> 2] = winterNamePtr;
          HEAP32[__get_tzname() + 4 >> 2] = summerNamePtr;
        } else {
          HEAP32[__get_tzname() >> 2] = summerNamePtr;
          HEAP32[__get_tzname() + 4 >> 2] = winterNamePtr;
        }
      }
      function _tzset() {
        if (_tzset.called)
          return;
        _tzset.called = true;
        _tzset_impl();
      }
      function _localtime_r(time, tmPtr) {
        _tzset();
        var date = new Date(HEAP32[time >> 2] * 1e3);
        HEAP32[tmPtr >> 2] = date.getSeconds();
        HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
        HEAP32[tmPtr + 8 >> 2] = date.getHours();
        HEAP32[tmPtr + 12 >> 2] = date.getDate();
        HEAP32[tmPtr + 16 >> 2] = date.getMonth();
        HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
        HEAP32[tmPtr + 24 >> 2] = date.getDay();
        var start = new Date(date.getFullYear(), 0, 1);
        var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
        HEAP32[tmPtr + 28 >> 2] = yday;
        HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
        var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
        var winterOffset = start.getTimezoneOffset();
        var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
        HEAP32[tmPtr + 32 >> 2] = dst;
        var zonePtr = HEAP32[__get_tzname() + (dst ? 4 : 0) >> 2];
        HEAP32[tmPtr + 40 >> 2] = zonePtr;
        return tmPtr;
      }
      function ___localtime_r(a0, a1) {
        return _localtime_r(a0, a1);
      }
      var PATH = { splitPath: function(filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      }, normalizeArray: function(parts, allowAboveRoot) {
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === ".") {
            parts.splice(i, 1);
          } else if (last === "..") {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift("..");
          }
        }
        return parts;
      }, normalize: function(path) {
        var isAbsolute = path.charAt(0) === "/", trailingSlash = path.substr(-1) === "/";
        path = PATH.normalizeArray(path.split("/").filter(function(p) {
          return !!p;
        }), !isAbsolute).join("/");
        if (!path && !isAbsolute) {
          path = ".";
        }
        if (path && trailingSlash) {
          path += "/";
        }
        return (isAbsolute ? "/" : "") + path;
      }, dirname: function(path) {
        var result = PATH.splitPath(path), root = result[0], dir = result[1];
        if (!root && !dir) {
          return ".";
        }
        if (dir) {
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      }, basename: function(path) {
        if (path === "/")
          return "/";
        path = PATH.normalize(path);
        path = path.replace(/\/$/, "");
        var lastSlash = path.lastIndexOf("/");
        if (lastSlash === -1)
          return path;
        return path.substr(lastSlash + 1);
      }, extname: function(path) {
        return PATH.splitPath(path)[3];
      }, join: function() {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join("/"));
      }, join2: function(l, r) {
        return PATH.normalize(l + "/" + r);
      } };
      function getRandomDevice() {
        if (typeof crypto === "object" && typeof crypto["getRandomValues"] === "function") {
          var randomBuffer = new Uint8Array(1);
          return function() {
            crypto.getRandomValues(randomBuffer);
            return randomBuffer[0];
          };
        } else
          return function() {
            abort("randomDevice");
          };
      }
      var PATH_FS = { resolve: function() {
        var resolvedPath = "", resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = i >= 0 ? arguments[i] : FS2.cwd();
          if (typeof path !== "string") {
            throw new TypeError("Arguments to path.resolve must be strings");
          } else if (!path) {
            return "";
          }
          resolvedPath = path + "/" + resolvedPath;
          resolvedAbsolute = path.charAt(0) === "/";
        }
        resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join("/");
        return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
      }, relative: function(from, to) {
        from = PATH_FS.resolve(from).substr(1);
        to = PATH_FS.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== "")
              break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== "")
              break;
          }
          if (start > end)
            return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split("/"));
        var toParts = trim(to.split("/"));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push("..");
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join("/");
      } };
      var TTY = { ttys: [], init: function() {
      }, shutdown: function() {
      }, register: function(dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops };
        FS2.registerDevice(dev, TTY.stream_ops);
      }, stream_ops: { open: function(stream) {
        var tty = TTY.ttys[stream.node.rdev];
        if (!tty) {
          throw new FS2.ErrnoError(43);
        }
        stream.tty = tty;
        stream.seekable = false;
      }, close: function(stream) {
        stream.tty.ops.flush(stream.tty);
      }, flush: function(stream) {
        stream.tty.ops.flush(stream.tty);
      }, read: function(stream, buffer2, offset, length, pos) {
        if (!stream.tty || !stream.tty.ops.get_char) {
          throw new FS2.ErrnoError(60);
        }
        var bytesRead = 0;
        for (var i = 0; i < length; i++) {
          var result;
          try {
            result = stream.tty.ops.get_char(stream.tty);
          } catch (e) {
            throw new FS2.ErrnoError(29);
          }
          if (result === void 0 && bytesRead === 0) {
            throw new FS2.ErrnoError(6);
          }
          if (result === null || result === void 0)
            break;
          bytesRead++;
          buffer2[offset + i] = result;
        }
        if (bytesRead) {
          stream.node.timestamp = Date.now();
        }
        return bytesRead;
      }, write: function(stream, buffer2, offset, length, pos) {
        if (!stream.tty || !stream.tty.ops.put_char) {
          throw new FS2.ErrnoError(60);
        }
        try {
          for (var i = 0; i < length; i++) {
            stream.tty.ops.put_char(stream.tty, buffer2[offset + i]);
          }
        } catch (e) {
          throw new FS2.ErrnoError(29);
        }
        if (length) {
          stream.node.timestamp = Date.now();
        }
        return i;
      } }, default_tty_ops: { get_char: function(tty) {
        if (!tty.input.length) {
          var result = null;
          if (typeof window != "undefined" && typeof window.prompt == "function") {
            result = window.prompt("Input: ");
            if (result !== null) {
              result += "\n";
            }
          } else if (typeof readline == "function") {
            result = readline();
            if (result !== null) {
              result += "\n";
            }
          }
          if (!result) {
            return null;
          }
          tty.input = intArrayFromString(result, true);
        }
        return tty.input.shift();
      }, put_char: function(tty, val) {
        if (val === null || val === 10) {
          out(UTF8ArrayToString(tty.output, 0));
          tty.output = [];
        } else {
          if (val != 0)
            tty.output.push(val);
        }
      }, flush: function(tty) {
        if (tty.output && tty.output.length > 0) {
          out(UTF8ArrayToString(tty.output, 0));
          tty.output = [];
        }
      } }, default_tty1_ops: { put_char: function(tty, val) {
        if (val === null || val === 10) {
          err(UTF8ArrayToString(tty.output, 0));
          tty.output = [];
        } else {
          if (val != 0)
            tty.output.push(val);
        }
      }, flush: function(tty) {
        if (tty.output && tty.output.length > 0) {
          err(UTF8ArrayToString(tty.output, 0));
          tty.output = [];
        }
      } } };
      function mmapAlloc(size) {
        abort();
      }
      var MEMFS = { ops_table: null, mount: function(mount) {
        return MEMFS.createNode(null, "/", 16384 | 511, 0);
      }, createNode: function(parent, name, mode, dev) {
        if (FS2.isBlkdev(mode) || FS2.isFIFO(mode)) {
          throw new FS2.ErrnoError(63);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = { dir: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr, lookup: MEMFS.node_ops.lookup, mknod: MEMFS.node_ops.mknod, rename: MEMFS.node_ops.rename, unlink: MEMFS.node_ops.unlink, rmdir: MEMFS.node_ops.rmdir, readdir: MEMFS.node_ops.readdir, symlink: MEMFS.node_ops.symlink }, stream: { llseek: MEMFS.stream_ops.llseek } }, file: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr }, stream: { llseek: MEMFS.stream_ops.llseek, read: MEMFS.stream_ops.read, write: MEMFS.stream_ops.write, allocate: MEMFS.stream_ops.allocate, mmap: MEMFS.stream_ops.mmap, msync: MEMFS.stream_ops.msync } }, link: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr, readlink: MEMFS.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr }, stream: FS2.chrdev_stream_ops } };
        }
        var node = FS2.createNode(parent, name, mode, dev);
        if (FS2.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS2.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.usedBytes = 0;
          node.contents = null;
        } else if (FS2.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS2.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        if (parent) {
          parent.contents[name] = node;
          parent.timestamp = node.timestamp;
        }
        return node;
      }, getFileDataAsTypedArray: function(node) {
        if (!node.contents)
          return new Uint8Array(0);
        if (node.contents.subarray)
          return node.contents.subarray(0, node.usedBytes);
        return new Uint8Array(node.contents);
      }, expandFileStorage: function(node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity)
          return;
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) >>> 0);
        if (prevCapacity != 0)
          newCapacity = Math.max(newCapacity, 256);
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity);
        if (node.usedBytes > 0)
          node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
      }, resizeFileStorage: function(node, newSize) {
        if (node.usedBytes == newSize)
          return;
        if (newSize == 0) {
          node.contents = null;
          node.usedBytes = 0;
        } else {
          var oldContents = node.contents;
          node.contents = new Uint8Array(newSize);
          if (oldContents) {
            node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
          }
          node.usedBytes = newSize;
        }
      }, node_ops: { getattr: function(node) {
        var attr = {};
        attr.dev = FS2.isChrdev(node.mode) ? node.id : 1;
        attr.ino = node.id;
        attr.mode = node.mode;
        attr.nlink = 1;
        attr.uid = 0;
        attr.gid = 0;
        attr.rdev = node.rdev;
        if (FS2.isDir(node.mode)) {
          attr.size = 4096;
        } else if (FS2.isFile(node.mode)) {
          attr.size = node.usedBytes;
        } else if (FS2.isLink(node.mode)) {
          attr.size = node.link.length;
        } else {
          attr.size = 0;
        }
        attr.atime = new Date(node.timestamp);
        attr.mtime = new Date(node.timestamp);
        attr.ctime = new Date(node.timestamp);
        attr.blksize = 4096;
        attr.blocks = Math.ceil(attr.size / attr.blksize);
        return attr;
      }, setattr: function(node, attr) {
        if (attr.mode !== void 0) {
          node.mode = attr.mode;
        }
        if (attr.timestamp !== void 0) {
          node.timestamp = attr.timestamp;
        }
        if (attr.size !== void 0) {
          MEMFS.resizeFileStorage(node, attr.size);
        }
      }, lookup: function(parent, name) {
        throw FS2.genericErrors[44];
      }, mknod: function(parent, name, mode, dev) {
        return MEMFS.createNode(parent, name, mode, dev);
      }, rename: function(old_node, new_dir, new_name) {
        if (FS2.isDir(old_node.mode)) {
          var new_node;
          try {
            new_node = FS2.lookupNode(new_dir, new_name);
          } catch (e) {
          }
          if (new_node) {
            for (var i in new_node.contents) {
              throw new FS2.ErrnoError(55);
            }
          }
        }
        delete old_node.parent.contents[old_node.name];
        old_node.parent.timestamp = Date.now();
        old_node.name = new_name;
        new_dir.contents[new_name] = old_node;
        new_dir.timestamp = old_node.parent.timestamp;
        old_node.parent = new_dir;
      }, unlink: function(parent, name) {
        delete parent.contents[name];
        parent.timestamp = Date.now();
      }, rmdir: function(parent, name) {
        var node = FS2.lookupNode(parent, name);
        for (var i in node.contents) {
          throw new FS2.ErrnoError(55);
        }
        delete parent.contents[name];
        parent.timestamp = Date.now();
      }, readdir: function(node) {
        var entries = [".", ".."];
        for (var key in node.contents) {
          if (!node.contents.hasOwnProperty(key)) {
            continue;
          }
          entries.push(key);
        }
        return entries;
      }, symlink: function(parent, newname, oldpath) {
        var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
        node.link = oldpath;
        return node;
      }, readlink: function(node) {
        if (!FS2.isLink(node.mode)) {
          throw new FS2.ErrnoError(28);
        }
        return node.link;
      } }, stream_ops: { read: function(stream, buffer2, offset, length, position) {
        var contents = stream.node.contents;
        if (position >= stream.node.usedBytes)
          return 0;
        var size = Math.min(stream.node.usedBytes - position, length);
        if (size > 8 && contents.subarray) {
          buffer2.set(contents.subarray(position, position + size), offset);
        } else {
          for (var i = 0; i < size; i++)
            buffer2[offset + i] = contents[position + i];
        }
        return size;
      }, write: function(stream, buffer2, offset, length, position, canOwn) {
        if (buffer2.buffer === HEAP8.buffer) {
          canOwn = false;
        }
        if (!length)
          return 0;
        var node = stream.node;
        node.timestamp = Date.now();
        if (buffer2.subarray && (!node.contents || node.contents.subarray)) {
          if (canOwn) {
            node.contents = buffer2.subarray(offset, offset + length);
            node.usedBytes = length;
            return length;
          } else if (node.usedBytes === 0 && position === 0) {
            node.contents = buffer2.slice(offset, offset + length);
            node.usedBytes = length;
            return length;
          } else if (position + length <= node.usedBytes) {
            node.contents.set(buffer2.subarray(offset, offset + length), position);
            return length;
          }
        }
        MEMFS.expandFileStorage(node, position + length);
        if (node.contents.subarray && buffer2.subarray) {
          node.contents.set(buffer2.subarray(offset, offset + length), position);
        } else {
          for (var i = 0; i < length; i++) {
            node.contents[position + i] = buffer2[offset + i];
          }
        }
        node.usedBytes = Math.max(node.usedBytes, position + length);
        return length;
      }, llseek: function(stream, offset, whence) {
        var position = offset;
        if (whence === 1) {
          position += stream.position;
        } else if (whence === 2) {
          if (FS2.isFile(stream.node.mode)) {
            position += stream.node.usedBytes;
          }
        }
        if (position < 0) {
          throw new FS2.ErrnoError(28);
        }
        return position;
      }, allocate: function(stream, offset, length) {
        MEMFS.expandFileStorage(stream.node, offset + length);
        stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
      }, mmap: function(stream, address, length, position, prot, flags) {
        if (address !== 0) {
          throw new FS2.ErrnoError(28);
        }
        if (!FS2.isFile(stream.node.mode)) {
          throw new FS2.ErrnoError(43);
        }
        var ptr;
        var allocated;
        var contents = stream.node.contents;
        if (!(flags & 2) && contents.buffer === buffer) {
          allocated = false;
          ptr = contents.byteOffset;
        } else {
          if (position > 0 || position + length < contents.length) {
            if (contents.subarray) {
              contents = contents.subarray(position, position + length);
            } else {
              contents = Array.prototype.slice.call(contents, position, position + length);
            }
          }
          allocated = true;
          ptr = mmapAlloc(length);
          if (!ptr) {
            throw new FS2.ErrnoError(48);
          }
          HEAP8.set(contents, ptr);
        }
        return { ptr, allocated };
      }, msync: function(stream, buffer2, offset, length, mmapFlags) {
        if (!FS2.isFile(stream.node.mode)) {
          throw new FS2.ErrnoError(43);
        }
        if (mmapFlags & 2) {
          return 0;
        }
        var bytesWritten = MEMFS.stream_ops.write(stream, buffer2, 0, length, offset, false);
        return 0;
      } } };
      function asyncLoad(url, onload, onerror, noRunDep) {
        var dep = !noRunDep ? getUniqueRunDependency("al " + url) : "";
        readAsync(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (dep)
            removeRunDependency(dep);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (dep)
          addRunDependency(dep);
      }
      var IDBFS = { dbs: {}, indexedDB: function() {
        if (typeof indexedDB !== "undefined")
          return indexedDB;
        var ret = null;
        if (typeof window === "object")
          ret = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        assert(ret, "IDBFS used, but indexedDB not supported");
        return ret;
      }, DB_VERSION: 21, DB_STORE_NAME: "FILE_DATA", mount: function(mount) {
        return MEMFS.mount.apply(null, arguments);
      }, syncfs: function(mount, populate, callback) {
        IDBFS.getLocalSet(mount, function(err2, local) {
          if (err2)
            return callback(err2);
          IDBFS.getRemoteSet(mount, function(err3, remote) {
            if (err3)
              return callback(err3);
            var src = populate ? remote : local;
            var dst = populate ? local : remote;
            IDBFS.reconcile(src, dst, callback);
          });
        });
      }, getDB: function(name, callback) {
        var db = IDBFS.dbs[name];
        if (db) {
          return callback(null, db);
        }
        var req;
        try {
          req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
        } catch (e) {
          return callback(e);
        }
        if (!req) {
          return callback("Unable to connect to IndexedDB");
        }
        req.onupgradeneeded = function(e) {
          var db2 = e.target.result;
          var transaction = e.target.transaction;
          var fileStore;
          if (db2.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
            fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
          } else {
            fileStore = db2.createObjectStore(IDBFS.DB_STORE_NAME);
          }
          if (!fileStore.indexNames.contains("timestamp")) {
            fileStore.createIndex("timestamp", "timestamp", { unique: false });
          }
        };
        req.onsuccess = function() {
          db = req.result;
          IDBFS.dbs[name] = db;
          callback(null, db);
        };
        req.onerror = function(e) {
          callback(this.error);
          e.preventDefault();
        };
      }, getLocalSet: function(mount, callback) {
        var entries = {};
        function isRealDir(p) {
          return p !== "." && p !== "..";
        }
        function toAbsolute(root) {
          return function(p) {
            return PATH.join2(root, p);
          };
        }
        var check = FS2.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
        while (check.length) {
          var path = check.pop();
          var stat;
          try {
            stat = FS2.stat(path);
          } catch (e) {
            return callback(e);
          }
          if (FS2.isDir(stat.mode)) {
            check.push.apply(check, FS2.readdir(path).filter(isRealDir).map(toAbsolute(path)));
          }
          entries[path] = { "timestamp": stat.mtime };
        }
        return callback(null, { type: "local", entries });
      }, getRemoteSet: function(mount, callback) {
        var entries = {};
        IDBFS.getDB(mount.mountpoint, function(err2, db) {
          if (err2)
            return callback(err2);
          try {
            var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readonly");
            transaction.onerror = function(e) {
              callback(this.error);
              e.preventDefault();
            };
            var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
            var index = store.index("timestamp");
            index.openKeyCursor().onsuccess = function(event) {
              var cursor = event.target.result;
              if (!cursor) {
                return callback(null, { type: "remote", db, entries });
              }
              entries[cursor.primaryKey] = { "timestamp": cursor.key };
              cursor.continue();
            };
          } catch (e) {
            return callback(e);
          }
        });
      }, loadLocalEntry: function(path, callback) {
        var stat, node;
        try {
          var lookup = FS2.lookupPath(path);
          node = lookup.node;
          stat = FS2.stat(path);
        } catch (e) {
          return callback(e);
        }
        if (FS2.isDir(stat.mode)) {
          return callback(null, { "timestamp": stat.mtime, "mode": stat.mode });
        } else if (FS2.isFile(stat.mode)) {
          node.contents = MEMFS.getFileDataAsTypedArray(node);
          return callback(null, { "timestamp": stat.mtime, "mode": stat.mode, "contents": node.contents });
        } else {
          return callback(new Error("node type not supported"));
        }
      }, storeLocalEntry: function(path, entry, callback) {
        try {
          if (FS2.isDir(entry["mode"])) {
            FS2.mkdirTree(path, entry["mode"]);
          } else if (FS2.isFile(entry["mode"])) {
            FS2.writeFile(path, entry["contents"], { canOwn: true });
          } else {
            return callback(new Error("node type not supported"));
          }
          FS2.chmod(path, entry["mode"]);
          FS2.utime(path, entry["timestamp"], entry["timestamp"]);
        } catch (e) {
          return callback(e);
        }
        callback(null);
      }, removeLocalEntry: function(path, callback) {
        try {
          var lookup = FS2.lookupPath(path);
          var stat = FS2.stat(path);
          if (FS2.isDir(stat.mode)) {
            FS2.rmdir(path);
          } else if (FS2.isFile(stat.mode)) {
            FS2.unlink(path);
          }
        } catch (e) {
          return callback(e);
        }
        callback(null);
      }, loadRemoteEntry: function(store, path, callback) {
        var req = store.get(path);
        req.onsuccess = function(event) {
          callback(null, event.target.result);
        };
        req.onerror = function(e) {
          callback(this.error);
          e.preventDefault();
        };
      }, storeRemoteEntry: function(store, path, entry, callback) {
        try {
          var req = store.put(entry, path);
        } catch (e) {
          callback(e);
          return;
        }
        req.onsuccess = function() {
          callback(null);
        };
        req.onerror = function(e) {
          callback(this.error);
          e.preventDefault();
        };
      }, removeRemoteEntry: function(store, path, callback) {
        var req = store.delete(path);
        req.onsuccess = function() {
          callback(null);
        };
        req.onerror = function(e) {
          callback(this.error);
          e.preventDefault();
        };
      }, reconcile: function(src, dst, callback) {
        var total = 0;
        var create = [];
        Object.keys(src.entries).forEach(function(key) {
          var e = src.entries[key];
          var e2 = dst.entries[key];
          if (!e2 || e["timestamp"].getTime() != e2["timestamp"].getTime()) {
            create.push(key);
            total++;
          }
        });
        var remove = [];
        Object.keys(dst.entries).forEach(function(key) {
          if (!src.entries[key]) {
            remove.push(key);
            total++;
          }
        });
        if (!total) {
          return callback(null);
        }
        var errored = false;
        var db = src.type === "remote" ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readwrite");
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
        function done(err2) {
          if (err2 && !errored) {
            errored = true;
            return callback(err2);
          }
        }
        transaction.onerror = function(e) {
          done(this.error);
          e.preventDefault();
        };
        transaction.oncomplete = function(e) {
          if (!errored) {
            callback(null);
          }
        };
        create.sort().forEach(function(path) {
          if (dst.type === "local") {
            IDBFS.loadRemoteEntry(store, path, function(err2, entry) {
              if (err2)
                return done(err2);
              IDBFS.storeLocalEntry(path, entry, done);
            });
          } else {
            IDBFS.loadLocalEntry(path, function(err2, entry) {
              if (err2)
                return done(err2);
              IDBFS.storeRemoteEntry(store, path, entry, done);
            });
          }
        });
        remove.sort().reverse().forEach(function(path) {
          if (dst.type === "local") {
            IDBFS.removeLocalEntry(path, done);
          } else {
            IDBFS.removeRemoteEntry(store, path, done);
          }
        });
      } };
      var FS2 = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: false, ignorePermissions: true, ErrnoError: null, genericErrors: {}, filesystems: null, syncFSRequests: 0, lookupPath: function(path, opts = {}) {
        path = PATH_FS.resolve(FS2.cwd(), path);
        if (!path)
          return { path: "", node: null };
        var defaults = { follow_mount: true, recurse_count: 0 };
        for (var key in defaults) {
          if (opts[key] === void 0) {
            opts[key] = defaults[key];
          }
        }
        if (opts.recurse_count > 8) {
          throw new FS2.ErrnoError(32);
        }
        var parts = PATH.normalizeArray(path.split("/").filter(function(p) {
          return !!p;
        }), false);
        var current = FS2.root;
        var current_path = "/";
        for (var i = 0; i < parts.length; i++) {
          var islast = i === parts.length - 1;
          if (islast && opts.parent) {
            break;
          }
          current = FS2.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
          if (FS2.isMountpoint(current)) {
            if (!islast || islast && opts.follow_mount) {
              current = current.mounted.root;
            }
          }
          if (!islast || opts.follow) {
            var count = 0;
            while (FS2.isLink(current.mode)) {
              var link = FS2.readlink(current_path);
              current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
              var lookup = FS2.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
              if (count++ > 40) {
                throw new FS2.ErrnoError(32);
              }
            }
          }
        }
        return { path: current_path, node: current };
      }, getPath: function(node) {
        var path;
        while (true) {
          if (FS2.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path)
              return mount;
            return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path;
          }
          path = path ? node.name + "/" + path : node.name;
          node = node.parent;
        }
      }, hashName: function(parentid, name) {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
          hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
        }
        return (parentid + hash >>> 0) % FS2.nameTable.length;
      }, hashAddNode: function(node) {
        var hash = FS2.hashName(node.parent.id, node.name);
        node.name_next = FS2.nameTable[hash];
        FS2.nameTable[hash] = node;
      }, hashRemoveNode: function(node) {
        var hash = FS2.hashName(node.parent.id, node.name);
        if (FS2.nameTable[hash] === node) {
          FS2.nameTable[hash] = node.name_next;
        } else {
          var current = FS2.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      }, lookupNode: function(parent, name) {
        var errCode = FS2.mayLookup(parent);
        if (errCode) {
          throw new FS2.ErrnoError(errCode, parent);
        }
        var hash = FS2.hashName(parent.id, name);
        for (var node = FS2.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        return FS2.lookup(parent, name);
      }, createNode: function(parent, name, mode, rdev) {
        var node = new FS2.FSNode(parent, name, mode, rdev);
        FS2.hashAddNode(node);
        return node;
      }, destroyNode: function(node) {
        FS2.hashRemoveNode(node);
      }, isRoot: function(node) {
        return node === node.parent;
      }, isMountpoint: function(node) {
        return !!node.mounted;
      }, isFile: function(mode) {
        return (mode & 61440) === 32768;
      }, isDir: function(mode) {
        return (mode & 61440) === 16384;
      }, isLink: function(mode) {
        return (mode & 61440) === 40960;
      }, isChrdev: function(mode) {
        return (mode & 61440) === 8192;
      }, isBlkdev: function(mode) {
        return (mode & 61440) === 24576;
      }, isFIFO: function(mode) {
        return (mode & 61440) === 4096;
      }, isSocket: function(mode) {
        return (mode & 49152) === 49152;
      }, flagModes: { "r": 0, "r+": 2, "w": 577, "w+": 578, "a": 1089, "a+": 1090 }, modeStringToFlags: function(str) {
        var flags = FS2.flagModes[str];
        if (typeof flags === "undefined") {
          throw new Error("Unknown file open mode: " + str);
        }
        return flags;
      }, flagsToPermissionString: function(flag) {
        var perms = ["r", "w", "rw"][flag & 3];
        if (flag & 512) {
          perms += "w";
        }
        return perms;
      }, nodePermissions: function(node, perms) {
        if (FS2.ignorePermissions) {
          return 0;
        }
        if (perms.includes("r") && !(node.mode & 292)) {
          return 2;
        } else if (perms.includes("w") && !(node.mode & 146)) {
          return 2;
        } else if (perms.includes("x") && !(node.mode & 73)) {
          return 2;
        }
        return 0;
      }, mayLookup: function(dir) {
        var errCode = FS2.nodePermissions(dir, "x");
        if (errCode)
          return errCode;
        if (!dir.node_ops.lookup)
          return 2;
        return 0;
      }, mayCreate: function(dir, name) {
        try {
          var node = FS2.lookupNode(dir, name);
          return 20;
        } catch (e) {
        }
        return FS2.nodePermissions(dir, "wx");
      }, mayDelete: function(dir, name, isdir) {
        var node;
        try {
          node = FS2.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var errCode = FS2.nodePermissions(dir, "wx");
        if (errCode) {
          return errCode;
        }
        if (isdir) {
          if (!FS2.isDir(node.mode)) {
            return 54;
          }
          if (FS2.isRoot(node) || FS2.getPath(node) === FS2.cwd()) {
            return 10;
          }
        } else {
          if (FS2.isDir(node.mode)) {
            return 31;
          }
        }
        return 0;
      }, mayOpen: function(node, flags) {
        if (!node) {
          return 44;
        }
        if (FS2.isLink(node.mode)) {
          return 32;
        } else if (FS2.isDir(node.mode)) {
          if (FS2.flagsToPermissionString(flags) !== "r" || flags & 512) {
            return 31;
          }
        }
        return FS2.nodePermissions(node, FS2.flagsToPermissionString(flags));
      }, MAX_OPEN_FDS: 4096, nextfd: function(fd_start = 0, fd_end = FS2.MAX_OPEN_FDS) {
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS2.streams[fd]) {
            return fd;
          }
        }
        throw new FS2.ErrnoError(33);
      }, getStream: function(fd) {
        return FS2.streams[fd];
      }, createStream: function(stream, fd_start, fd_end) {
        if (!FS2.FSStream) {
          FS2.FSStream = function() {
          };
          FS2.FSStream.prototype = { object: { get: function() {
            return this.node;
          }, set: function(val) {
            this.node = val;
          } }, isRead: { get: function() {
            return (this.flags & 2097155) !== 1;
          } }, isWrite: { get: function() {
            return (this.flags & 2097155) !== 0;
          } }, isAppend: { get: function() {
            return this.flags & 1024;
          } } };
        }
        var newStream = new FS2.FSStream();
        for (var p in stream) {
          newStream[p] = stream[p];
        }
        stream = newStream;
        var fd = FS2.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS2.streams[fd] = stream;
        return stream;
      }, closeStream: function(fd) {
        FS2.streams[fd] = null;
      }, chrdev_stream_ops: { open: function(stream) {
        var device = FS2.getDevice(stream.node.rdev);
        stream.stream_ops = device.stream_ops;
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
      }, llseek: function() {
        throw new FS2.ErrnoError(70);
      } }, major: function(dev) {
        return dev >> 8;
      }, minor: function(dev) {
        return dev & 255;
      }, makedev: function(ma, mi) {
        return ma << 8 | mi;
      }, registerDevice: function(dev, ops) {
        FS2.devices[dev] = { stream_ops: ops };
      }, getDevice: function(dev) {
        return FS2.devices[dev];
      }, getMounts: function(mount) {
        var mounts = [];
        var check = [mount];
        while (check.length) {
          var m = check.pop();
          mounts.push(m);
          check.push.apply(check, m.mounts);
        }
        return mounts;
      }, syncfs: function(populate, callback) {
        if (typeof populate === "function") {
          callback = populate;
          populate = false;
        }
        FS2.syncFSRequests++;
        if (FS2.syncFSRequests > 1) {
          err("warning: " + FS2.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work");
        }
        var mounts = FS2.getMounts(FS2.root.mount);
        var completed = 0;
        function doCallback(errCode) {
          FS2.syncFSRequests--;
          return callback(errCode);
        }
        function done(errCode) {
          if (errCode) {
            if (!done.errored) {
              done.errored = true;
              return doCallback(errCode);
            }
            return;
          }
          if (++completed >= mounts.length) {
            doCallback(null);
          }
        }
        mounts.forEach(function(mount) {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      }, mount: function(type, opts, mountpoint) {
        var root = mountpoint === "/";
        var pseudo = !mountpoint;
        var node;
        if (root && FS2.root) {
          throw new FS2.ErrnoError(10);
        } else if (!root && !pseudo) {
          var lookup = FS2.lookupPath(mountpoint, { follow_mount: false });
          mountpoint = lookup.path;
          node = lookup.node;
          if (FS2.isMountpoint(node)) {
            throw new FS2.ErrnoError(10);
          }
          if (!FS2.isDir(node.mode)) {
            throw new FS2.ErrnoError(54);
          }
        }
        var mount = { type, opts, mountpoint, mounts: [] };
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
        if (root) {
          FS2.root = mountRoot;
        } else if (node) {
          node.mounted = mount;
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
        return mountRoot;
      }, unmount: function(mountpoint) {
        var lookup = FS2.lookupPath(mountpoint, { follow_mount: false });
        if (!FS2.isMountpoint(lookup.node)) {
          throw new FS2.ErrnoError(28);
        }
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS2.getMounts(mount);
        Object.keys(FS2.nameTable).forEach(function(hash) {
          var current = FS2.nameTable[hash];
          while (current) {
            var next = current.name_next;
            if (mounts.includes(current.mount)) {
              FS2.destroyNode(current);
            }
            current = next;
          }
        });
        node.mounted = null;
        var idx = node.mount.mounts.indexOf(mount);
        node.mount.mounts.splice(idx, 1);
      }, lookup: function(parent, name) {
        return parent.node_ops.lookup(parent, name);
      }, mknod: function(path, mode, dev) {
        var lookup = FS2.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === "." || name === "..") {
          throw new FS2.ErrnoError(28);
        }
        var errCode = FS2.mayCreate(parent, name);
        if (errCode) {
          throw new FS2.ErrnoError(errCode);
        }
        if (!parent.node_ops.mknod) {
          throw new FS2.ErrnoError(63);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      }, create: function(path, mode) {
        mode = mode !== void 0 ? mode : 438;
        mode &= 4095;
        mode |= 32768;
        return FS2.mknod(path, mode, 0);
      }, mkdir: function(path, mode) {
        mode = mode !== void 0 ? mode : 511;
        mode &= 511 | 512;
        mode |= 16384;
        return FS2.mknod(path, mode, 0);
      }, mkdirTree: function(path, mode) {
        var dirs = path.split("/");
        var d = "";
        for (var i = 0; i < dirs.length; ++i) {
          if (!dirs[i])
            continue;
          d += "/" + dirs[i];
          try {
            FS2.mkdir(d, mode);
          } catch (e) {
            if (e.errno != 20)
              throw e;
          }
        }
      }, mkdev: function(path, mode, dev) {
        if (typeof dev === "undefined") {
          dev = mode;
          mode = 438;
        }
        mode |= 8192;
        return FS2.mknod(path, mode, dev);
      }, symlink: function(oldpath, newpath) {
        if (!PATH_FS.resolve(oldpath)) {
          throw new FS2.ErrnoError(44);
        }
        var lookup = FS2.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS2.ErrnoError(44);
        }
        var newname = PATH.basename(newpath);
        var errCode = FS2.mayCreate(parent, newname);
        if (errCode) {
          throw new FS2.ErrnoError(errCode);
        }
        if (!parent.node_ops.symlink) {
          throw new FS2.ErrnoError(63);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      }, rename: function(old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        var lookup, old_dir, new_dir;
        lookup = FS2.lookupPath(old_path, { parent: true });
        old_dir = lookup.node;
        lookup = FS2.lookupPath(new_path, { parent: true });
        new_dir = lookup.node;
        if (!old_dir || !new_dir)
          throw new FS2.ErrnoError(44);
        if (old_dir.mount !== new_dir.mount) {
          throw new FS2.ErrnoError(75);
        }
        var old_node = FS2.lookupNode(old_dir, old_name);
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== ".") {
          throw new FS2.ErrnoError(28);
        }
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== ".") {
          throw new FS2.ErrnoError(55);
        }
        var new_node;
        try {
          new_node = FS2.lookupNode(new_dir, new_name);
        } catch (e) {
        }
        if (old_node === new_node) {
          return;
        }
        var isdir = FS2.isDir(old_node.mode);
        var errCode = FS2.mayDelete(old_dir, old_name, isdir);
        if (errCode) {
          throw new FS2.ErrnoError(errCode);
        }
        errCode = new_node ? FS2.mayDelete(new_dir, new_name, isdir) : FS2.mayCreate(new_dir, new_name);
        if (errCode) {
          throw new FS2.ErrnoError(errCode);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS2.ErrnoError(63);
        }
        if (FS2.isMountpoint(old_node) || new_node && FS2.isMountpoint(new_node)) {
          throw new FS2.ErrnoError(10);
        }
        if (new_dir !== old_dir) {
          errCode = FS2.nodePermissions(old_dir, "w");
          if (errCode) {
            throw new FS2.ErrnoError(errCode);
          }
        }
        FS2.hashRemoveNode(old_node);
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          FS2.hashAddNode(old_node);
        }
      }, rmdir: function(path) {
        var lookup = FS2.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS2.lookupNode(parent, name);
        var errCode = FS2.mayDelete(parent, name, true);
        if (errCode) {
          throw new FS2.ErrnoError(errCode);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS2.ErrnoError(63);
        }
        if (FS2.isMountpoint(node)) {
          throw new FS2.ErrnoError(10);
        }
        parent.node_ops.rmdir(parent, name);
        FS2.destroyNode(node);
      }, readdir: function(path) {
        var lookup = FS2.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS2.ErrnoError(54);
        }
        return node.node_ops.readdir(node);
      }, unlink: function(path) {
        var lookup = FS2.lookupPath(path, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS2.ErrnoError(44);
        }
        var name = PATH.basename(path);
        var node = FS2.lookupNode(parent, name);
        var errCode = FS2.mayDelete(parent, name, false);
        if (errCode) {
          throw new FS2.ErrnoError(errCode);
        }
        if (!parent.node_ops.unlink) {
          throw new FS2.ErrnoError(63);
        }
        if (FS2.isMountpoint(node)) {
          throw new FS2.ErrnoError(10);
        }
        parent.node_ops.unlink(parent, name);
        FS2.destroyNode(node);
      }, readlink: function(path) {
        var lookup = FS2.lookupPath(path);
        var link = lookup.node;
        if (!link) {
          throw new FS2.ErrnoError(44);
        }
        if (!link.node_ops.readlink) {
          throw new FS2.ErrnoError(28);
        }
        return PATH_FS.resolve(FS2.getPath(link.parent), link.node_ops.readlink(link));
      }, stat: function(path, dontFollow) {
        var lookup = FS2.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node) {
          throw new FS2.ErrnoError(44);
        }
        if (!node.node_ops.getattr) {
          throw new FS2.ErrnoError(63);
        }
        return node.node_ops.getattr(node);
      }, lstat: function(path) {
        return FS2.stat(path, true);
      }, chmod: function(path, mode, dontFollow) {
        var node;
        if (typeof path === "string") {
          var lookup = FS2.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS2.ErrnoError(63);
        }
        node.node_ops.setattr(node, { mode: mode & 4095 | node.mode & ~4095, timestamp: Date.now() });
      }, lchmod: function(path, mode) {
        FS2.chmod(path, mode, true);
      }, fchmod: function(fd, mode) {
        var stream = FS2.getStream(fd);
        if (!stream) {
          throw new FS2.ErrnoError(8);
        }
        FS2.chmod(stream.node, mode);
      }, chown: function(path, uid, gid, dontFollow) {
        var node;
        if (typeof path === "string") {
          var lookup = FS2.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS2.ErrnoError(63);
        }
        node.node_ops.setattr(node, { timestamp: Date.now() });
      }, lchown: function(path, uid, gid) {
        FS2.chown(path, uid, gid, true);
      }, fchown: function(fd, uid, gid) {
        var stream = FS2.getStream(fd);
        if (!stream) {
          throw new FS2.ErrnoError(8);
        }
        FS2.chown(stream.node, uid, gid);
      }, truncate: function(path, len) {
        if (len < 0) {
          throw new FS2.ErrnoError(28);
        }
        var node;
        if (typeof path === "string") {
          var lookup = FS2.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS2.ErrnoError(63);
        }
        if (FS2.isDir(node.mode)) {
          throw new FS2.ErrnoError(31);
        }
        if (!FS2.isFile(node.mode)) {
          throw new FS2.ErrnoError(28);
        }
        var errCode = FS2.nodePermissions(node, "w");
        if (errCode) {
          throw new FS2.ErrnoError(errCode);
        }
        node.node_ops.setattr(node, { size: len, timestamp: Date.now() });
      }, ftruncate: function(fd, len) {
        var stream = FS2.getStream(fd);
        if (!stream) {
          throw new FS2.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS2.ErrnoError(28);
        }
        FS2.truncate(stream.node, len);
      }, utime: function(path, atime, mtime) {
        var lookup = FS2.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, { timestamp: Math.max(atime, mtime) });
      }, open: function(path, flags, mode, fd_start, fd_end) {
        if (path === "") {
          throw new FS2.ErrnoError(44);
        }
        flags = typeof flags === "string" ? FS2.modeStringToFlags(flags) : flags;
        mode = typeof mode === "undefined" ? 438 : mode;
        if (flags & 64) {
          mode = mode & 4095 | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path === "object") {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS2.lookupPath(path, { follow: !(flags & 131072) });
            node = lookup.node;
          } catch (e) {
          }
        }
        var created = false;
        if (flags & 64) {
          if (node) {
            if (flags & 128) {
              throw new FS2.ErrnoError(20);
            }
          } else {
            node = FS2.mknod(path, mode, 0);
            created = true;
          }
        }
        if (!node) {
          throw new FS2.ErrnoError(44);
        }
        if (FS2.isChrdev(node.mode)) {
          flags &= ~512;
        }
        if (flags & 65536 && !FS2.isDir(node.mode)) {
          throw new FS2.ErrnoError(54);
        }
        if (!created) {
          var errCode = FS2.mayOpen(node, flags);
          if (errCode) {
            throw new FS2.ErrnoError(errCode);
          }
        }
        if (flags & 512) {
          FS2.truncate(node, 0);
        }
        flags &= ~(128 | 512 | 131072);
        var stream = FS2.createStream({ node, path: FS2.getPath(node), id: node.id, flags, mode: node.mode, seekable: true, position: 0, stream_ops: node.stream_ops, node_ops: node.node_ops, ungotten: [], error: false }, fd_start, fd_end);
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module3["logReadFiles"] && !(flags & 1)) {
          if (!FS2.readFiles)
            FS2.readFiles = {};
          if (!(path in FS2.readFiles)) {
            FS2.readFiles[path] = 1;
          }
        }
        return stream;
      }, close: function(stream) {
        if (FS2.isClosed(stream)) {
          throw new FS2.ErrnoError(8);
        }
        if (stream.getdents)
          stream.getdents = null;
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS2.closeStream(stream.fd);
        }
        stream.fd = null;
      }, isClosed: function(stream) {
        return stream.fd === null;
      }, llseek: function(stream, offset, whence) {
        if (FS2.isClosed(stream)) {
          throw new FS2.ErrnoError(8);
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS2.ErrnoError(70);
        }
        if (whence != 0 && whence != 1 && whence != 2) {
          throw new FS2.ErrnoError(28);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
      }, read: function(stream, buffer2, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS2.ErrnoError(28);
        }
        if (FS2.isClosed(stream)) {
          throw new FS2.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS2.ErrnoError(8);
        }
        if (FS2.isDir(stream.node.mode)) {
          throw new FS2.ErrnoError(31);
        }
        if (!stream.stream_ops.read) {
          throw new FS2.ErrnoError(28);
        }
        var seeking = typeof position !== "undefined";
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS2.ErrnoError(70);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer2, offset, length, position);
        if (!seeking)
          stream.position += bytesRead;
        return bytesRead;
      }, write: function(stream, buffer2, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS2.ErrnoError(28);
        }
        if (FS2.isClosed(stream)) {
          throw new FS2.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS2.ErrnoError(8);
        }
        if (FS2.isDir(stream.node.mode)) {
          throw new FS2.ErrnoError(31);
        }
        if (!stream.stream_ops.write) {
          throw new FS2.ErrnoError(28);
        }
        if (stream.seekable && stream.flags & 1024) {
          FS2.llseek(stream, 0, 2);
        }
        var seeking = typeof position !== "undefined";
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS2.ErrnoError(70);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer2, offset, length, position, canOwn);
        if (!seeking)
          stream.position += bytesWritten;
        return bytesWritten;
      }, allocate: function(stream, offset, length) {
        if (FS2.isClosed(stream)) {
          throw new FS2.ErrnoError(8);
        }
        if (offset < 0 || length <= 0) {
          throw new FS2.ErrnoError(28);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS2.ErrnoError(8);
        }
        if (!FS2.isFile(stream.node.mode) && !FS2.isDir(stream.node.mode)) {
          throw new FS2.ErrnoError(43);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS2.ErrnoError(138);
        }
        stream.stream_ops.allocate(stream, offset, length);
      }, mmap: function(stream, address, length, position, prot, flags) {
        if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
          throw new FS2.ErrnoError(2);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS2.ErrnoError(2);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS2.ErrnoError(43);
        }
        return stream.stream_ops.mmap(stream, address, length, position, prot, flags);
      }, msync: function(stream, buffer2, offset, length, mmapFlags) {
        if (!stream || !stream.stream_ops.msync) {
          return 0;
        }
        return stream.stream_ops.msync(stream, buffer2, offset, length, mmapFlags);
      }, munmap: function(stream) {
        return 0;
      }, ioctl: function(stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS2.ErrnoError(59);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      }, readFile: function(path, opts = {}) {
        opts.flags = opts.flags || 0;
        opts.encoding = opts.encoding || "binary";
        if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var ret;
        var stream = FS2.open(path, opts.flags);
        var stat = FS2.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS2.read(stream, buf, 0, length, 0);
        if (opts.encoding === "utf8") {
          ret = UTF8ArrayToString(buf, 0);
        } else if (opts.encoding === "binary") {
          ret = buf;
        }
        FS2.close(stream);
        return ret;
      }, writeFile: function(path, data, opts = {}) {
        opts.flags = opts.flags || 577;
        var stream = FS2.open(path, opts.flags, opts.mode);
        if (typeof data === "string") {
          var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
          var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
          FS2.write(stream, buf, 0, actualNumBytes, void 0, opts.canOwn);
        } else if (ArrayBuffer.isView(data)) {
          FS2.write(stream, data, 0, data.byteLength, void 0, opts.canOwn);
        } else {
          throw new Error("Unsupported data type");
        }
        FS2.close(stream);
      }, cwd: function() {
        return FS2.currentPath;
      }, chdir: function(path) {
        var lookup = FS2.lookupPath(path, { follow: true });
        if (lookup.node === null) {
          throw new FS2.ErrnoError(44);
        }
        if (!FS2.isDir(lookup.node.mode)) {
          throw new FS2.ErrnoError(54);
        }
        var errCode = FS2.nodePermissions(lookup.node, "x");
        if (errCode) {
          throw new FS2.ErrnoError(errCode);
        }
        FS2.currentPath = lookup.path;
      }, createDefaultDirectories: function() {
        FS2.mkdir("/tmp");
        FS2.mkdir("/home");
        FS2.mkdir("/home/web_user");
      }, createDefaultDevices: function() {
        FS2.mkdir("/dev");
        FS2.registerDevice(FS2.makedev(1, 3), { read: function() {
          return 0;
        }, write: function(stream, buffer2, offset, length, pos) {
          return length;
        } });
        FS2.mkdev("/dev/null", FS2.makedev(1, 3));
        TTY.register(FS2.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS2.makedev(6, 0), TTY.default_tty1_ops);
        FS2.mkdev("/dev/tty", FS2.makedev(5, 0));
        FS2.mkdev("/dev/tty1", FS2.makedev(6, 0));
        var random_device = getRandomDevice();
        FS2.createDevice("/dev", "random", random_device);
        FS2.createDevice("/dev", "urandom", random_device);
        FS2.mkdir("/dev/shm");
        FS2.mkdir("/dev/shm/tmp");
      }, createSpecialDirectories: function() {
        FS2.mkdir("/proc");
        var proc_self = FS2.mkdir("/proc/self");
        FS2.mkdir("/proc/self/fd");
        FS2.mount({ mount: function() {
          var node = FS2.createNode(proc_self, "fd", 16384 | 511, 73);
          node.node_ops = { lookup: function(parent, name) {
            var fd = +name;
            var stream = FS2.getStream(fd);
            if (!stream)
              throw new FS2.ErrnoError(8);
            var ret = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: function() {
              return stream.path;
            } } };
            ret.parent = ret;
            return ret;
          } };
          return node;
        } }, {}, "/proc/self/fd");
      }, createStandardStreams: function() {
        if (Module3["stdin"]) {
          FS2.createDevice("/dev", "stdin", Module3["stdin"]);
        } else {
          FS2.symlink("/dev/tty", "/dev/stdin");
        }
        if (Module3["stdout"]) {
          FS2.createDevice("/dev", "stdout", null, Module3["stdout"]);
        } else {
          FS2.symlink("/dev/tty", "/dev/stdout");
        }
        if (Module3["stderr"]) {
          FS2.createDevice("/dev", "stderr", null, Module3["stderr"]);
        } else {
          FS2.symlink("/dev/tty1", "/dev/stderr");
        }
        var stdin = FS2.open("/dev/stdin", 0);
        var stdout = FS2.open("/dev/stdout", 1);
        var stderr = FS2.open("/dev/stderr", 1);
      }, ensureErrnoError: function() {
        if (FS2.ErrnoError)
          return;
        FS2.ErrnoError = function ErrnoError(errno, node) {
          this.node = node;
          this.setErrno = function(errno2) {
            this.errno = errno2;
          };
          this.setErrno(errno);
          this.message = "FS error";
        };
        FS2.ErrnoError.prototype = new Error();
        FS2.ErrnoError.prototype.constructor = FS2.ErrnoError;
        [44].forEach(function(code) {
          FS2.genericErrors[code] = new FS2.ErrnoError(code);
          FS2.genericErrors[code].stack = "<generic error, no stack>";
        });
      }, staticInit: function() {
        FS2.ensureErrnoError();
        FS2.nameTable = new Array(4096);
        FS2.mount(MEMFS, {}, "/");
        FS2.createDefaultDirectories();
        FS2.createDefaultDevices();
        FS2.createSpecialDirectories();
        FS2.filesystems = { "MEMFS": MEMFS, "IDBFS": IDBFS };
      }, init: function(input, output, error) {
        FS2.init.initialized = true;
        FS2.ensureErrnoError();
        Module3["stdin"] = input || Module3["stdin"];
        Module3["stdout"] = output || Module3["stdout"];
        Module3["stderr"] = error || Module3["stderr"];
        FS2.createStandardStreams();
      }, quit: function() {
        FS2.init.initialized = false;
        for (var i = 0; i < FS2.streams.length; i++) {
          var stream = FS2.streams[i];
          if (!stream) {
            continue;
          }
          FS2.close(stream);
        }
      }, getMode: function(canRead, canWrite) {
        var mode = 0;
        if (canRead)
          mode |= 292 | 73;
        if (canWrite)
          mode |= 146;
        return mode;
      }, findObject: function(path, dontResolveLastLink) {
        var ret = FS2.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          return null;
        }
      }, analyzePath: function(path, dontResolveLastLink) {
        try {
          var lookup = FS2.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = { isRoot: false, exists: false, error: 0, name: null, path: null, object: null, parentExists: false, parentPath: null, parentObject: null };
        try {
          var lookup = FS2.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS2.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === "/";
        } catch (e) {
          ret.error = e.errno;
        }
        return ret;
      }, createPath: function(parent, path, canRead, canWrite) {
        parent = typeof parent === "string" ? parent : FS2.getPath(parent);
        var parts = path.split("/").reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part)
            continue;
          var current = PATH.join2(parent, part);
          try {
            FS2.mkdir(current);
          } catch (e) {
          }
          parent = current;
        }
        return current;
      }, createFile: function(parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS2.getPath(parent), name);
        var mode = FS2.getMode(canRead, canWrite);
        return FS2.create(path, mode);
      }, createDataFile: function(parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === "string" ? parent : FS2.getPath(parent), name) : parent;
        var mode = FS2.getMode(canRead, canWrite);
        var node = FS2.create(path, mode);
        if (data) {
          if (typeof data === "string") {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i)
              arr[i] = data.charCodeAt(i);
            data = arr;
          }
          FS2.chmod(node, mode | 146);
          var stream = FS2.open(node, 577);
          FS2.write(stream, data, 0, data.length, 0, canOwn);
          FS2.close(stream);
          FS2.chmod(node, mode);
        }
        return node;
      }, createDevice: function(parent, name, input, output) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS2.getPath(parent), name);
        var mode = FS2.getMode(!!input, !!output);
        if (!FS2.createDevice.major)
          FS2.createDevice.major = 64;
        var dev = FS2.makedev(FS2.createDevice.major++, 0);
        FS2.registerDevice(dev, { open: function(stream) {
          stream.seekable = false;
        }, close: function(stream) {
          if (output && output.buffer && output.buffer.length) {
            output(10);
          }
        }, read: function(stream, buffer2, offset, length, pos) {
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = input();
            } catch (e) {
              throw new FS2.ErrnoError(29);
            }
            if (result === void 0 && bytesRead === 0) {
              throw new FS2.ErrnoError(6);
            }
            if (result === null || result === void 0)
              break;
            bytesRead++;
            buffer2[offset + i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        }, write: function(stream, buffer2, offset, length, pos) {
          for (var i = 0; i < length; i++) {
            try {
              output(buffer2[offset + i]);
            } catch (e) {
              throw new FS2.ErrnoError(29);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        } });
        return FS2.mkdev(path, mode, dev);
      }, forceLoadFile: function(obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents)
          return true;
        if (typeof XMLHttpRequest !== "undefined") {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (read_) {
          try {
            obj.contents = intArrayFromString(read_(obj.url), true);
            obj.usedBytes = obj.contents.length;
          } catch (e) {
            throw new FS2.ErrnoError(29);
          }
        } else {
          throw new Error("Cannot load without read() or XMLHttpRequest.");
        }
      }, createLazyFile: function(parent, name, url, canRead, canWrite) {
        function LazyUint8Array2() {
          this.lengthKnown = false;
          this.chunks = [];
        }
        LazyUint8Array2.prototype.get = function LazyUint8Array_get(idx) {
          if (idx > this.length - 1 || idx < 0) {
            return void 0;
          }
          var chunkOffset = idx % this.chunkSize;
          var chunkNum = idx / this.chunkSize | 0;
          return this.getter(chunkNum)[chunkOffset];
        };
        LazyUint8Array2.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
          this.getter = getter;
        };
        LazyUint8Array2.prototype.cacheLength = function LazyUint8Array_cacheLength() {
          var xhr = new XMLHttpRequest();
          xhr.open("HEAD", url, false);
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))
            throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
          var datalength = Number(xhr.getResponseHeader("Content-length"));
          var header;
          var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
          var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
          var chunkSize = 1024 * 1024;
          if (!hasByteServing)
            chunkSize = datalength;
          var doXHR = function(from, to) {
            if (from > to)
              throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
            if (to > datalength - 1)
              throw new Error("only " + datalength + " bytes available! programmer error!");
            var xhr2 = new XMLHttpRequest();
            xhr2.open("GET", url, false);
            if (datalength !== chunkSize)
              xhr2.setRequestHeader("Range", "bytes=" + from + "-" + to);
            if (typeof Uint8Array != "undefined")
              xhr2.responseType = "arraybuffer";
            if (xhr2.overrideMimeType) {
              xhr2.overrideMimeType("text/plain; charset=x-user-defined");
            }
            xhr2.send(null);
            if (!(xhr2.status >= 200 && xhr2.status < 300 || xhr2.status === 304))
              throw new Error("Couldn't load " + url + ". Status: " + xhr2.status);
            if (xhr2.response !== void 0) {
              return new Uint8Array(xhr2.response || []);
            } else {
              return intArrayFromString(xhr2.responseText || "", true);
            }
          };
          var lazyArray2 = this;
          lazyArray2.setDataGetter(function(chunkNum) {
            var start = chunkNum * chunkSize;
            var end = (chunkNum + 1) * chunkSize - 1;
            end = Math.min(end, datalength - 1);
            if (typeof lazyArray2.chunks[chunkNum] === "undefined") {
              lazyArray2.chunks[chunkNum] = doXHR(start, end);
            }
            if (typeof lazyArray2.chunks[chunkNum] === "undefined")
              throw new Error("doXHR failed!");
            return lazyArray2.chunks[chunkNum];
          });
          if (usesGzip || !datalength) {
            chunkSize = datalength = 1;
            datalength = this.getter(0).length;
            chunkSize = datalength;
            out("LazyFiles on gzip forces download of the whole file when length is accessed");
          }
          this._length = datalength;
          this._chunkSize = chunkSize;
          this.lengthKnown = true;
        };
        if (typeof XMLHttpRequest !== "undefined") {
          if (!ENVIRONMENT_IS_WORKER)
            throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
          var lazyArray = new LazyUint8Array2();
          Object.defineProperties(lazyArray, { length: { get: function() {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._length;
          } }, chunkSize: { get: function() {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._chunkSize;
          } } });
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url };
        }
        var node = FS2.createFile(parent, name, properties, canRead, canWrite);
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        Object.defineProperties(node, { usedBytes: { get: function() {
          return this.contents.length;
        } } });
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            FS2.forceLoadFile(node);
            return fn.apply(null, arguments);
          };
        });
        stream_ops.read = function stream_ops_read(stream, buffer2, offset, length, position) {
          FS2.forceLoadFile(node);
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          if (contents.slice) {
            for (var i = 0; i < size; i++) {
              buffer2[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) {
              buffer2[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      }, createPreloadedFile: function(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
        Browser.init();
        var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
        var dep = getUniqueRunDependency("cp " + fullname);
        function processData(byteArray) {
          function finish(byteArray2) {
            if (preFinish)
              preFinish();
            if (!dontCreateFile) {
              FS2.createDataFile(parent, name, byteArray2, canRead, canWrite, canOwn);
            }
            if (onload)
              onload();
            removeRunDependency(dep);
          }
          var handled = false;
          Module3["preloadPlugins"].forEach(function(plugin) {
            if (handled)
              return;
            if (plugin["canHandle"](fullname)) {
              plugin["handle"](byteArray, fullname, finish, function() {
                if (onerror)
                  onerror();
                removeRunDependency(dep);
              });
              handled = true;
            }
          });
          if (!handled)
            finish(byteArray);
        }
        addRunDependency(dep);
        if (typeof url == "string") {
          asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      }, indexedDB: function() {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      }, DB_NAME: function() {
        return "EM_FS_" + window.location.pathname;
      }, DB_VERSION: 20, DB_STORE_NAME: "FILE_DATA", saveFilesToDB: function(paths, onload, onerror) {
        onload = onload || function() {
        };
        onerror = onerror || function() {
        };
        var indexedDB2 = FS2.indexedDB();
        try {
          var openRequest = indexedDB2.open(FS2.DB_NAME(), FS2.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          out("creating db");
          var db = openRequest.result;
          db.createObjectStore(FS2.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS2.DB_STORE_NAME], "readwrite");
          var files = transaction.objectStore(FS2.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0)
              onload();
            else
              onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS2.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function putRequest_onsuccess() {
              ok++;
              if (ok + fail == total)
                finish();
            };
            putRequest.onerror = function putRequest_onerror() {
              fail++;
              if (ok + fail == total)
                finish();
            };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }, loadFilesFromDB: function(paths, onload, onerror) {
        onload = onload || function() {
        };
        onerror = onerror || function() {
        };
        var indexedDB2 = FS2.indexedDB();
        try {
          var openRequest = indexedDB2.open(FS2.DB_NAME(), FS2.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror;
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS2.DB_STORE_NAME], "readonly");
          } catch (e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS2.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0)
              onload();
            else
              onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS2.analyzePath(path).exists) {
                FS2.unlink(path);
              }
              FS2.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total)
                finish();
            };
            getRequest.onerror = function getRequest_onerror() {
              fail++;
              if (ok + fail == total)
                finish();
            };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      } };
      var SYSCALLS = { mappings: {}, DEFAULT_POLLMASK: 5, calculateAt: function(dirfd, path, allowEmpty) {
        if (path[0] === "/") {
          return path;
        }
        var dir;
        if (dirfd === -100) {
          dir = FS2.cwd();
        } else {
          var dirstream = FS2.getStream(dirfd);
          if (!dirstream)
            throw new FS2.ErrnoError(8);
          dir = dirstream.path;
        }
        if (path.length == 0) {
          if (!allowEmpty) {
            throw new FS2.ErrnoError(44);
          }
          return dir;
        }
        return PATH.join2(dir, path);
      }, doStat: function(func, path, buf) {
        try {
          var stat = func(path);
        } catch (e) {
          if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS2.getPath(e.node))) {
            return -54;
          }
          throw e;
        }
        HEAP32[buf >> 2] = stat.dev;
        HEAP32[buf + 4 >> 2] = 0;
        HEAP32[buf + 8 >> 2] = stat.ino;
        HEAP32[buf + 12 >> 2] = stat.mode;
        HEAP32[buf + 16 >> 2] = stat.nlink;
        HEAP32[buf + 20 >> 2] = stat.uid;
        HEAP32[buf + 24 >> 2] = stat.gid;
        HEAP32[buf + 28 >> 2] = stat.rdev;
        HEAP32[buf + 32 >> 2] = 0;
        HEAP64[buf + 40 >> 3] = BigInt(stat.size);
        HEAP32[buf + 48 >> 2] = 4096;
        HEAP32[buf + 52 >> 2] = stat.blocks;
        HEAP32[buf + 56 >> 2] = stat.atime.getTime() / 1e3 | 0;
        HEAP32[buf + 60 >> 2] = 0;
        HEAP32[buf + 64 >> 2] = stat.mtime.getTime() / 1e3 | 0;
        HEAP32[buf + 68 >> 2] = 0;
        HEAP32[buf + 72 >> 2] = stat.ctime.getTime() / 1e3 | 0;
        HEAP32[buf + 76 >> 2] = 0;
        HEAP64[buf + 80 >> 3] = BigInt(stat.ino);
        return 0;
      }, doMsync: function(addr, stream, len, flags, offset) {
        var buffer2 = HEAPU8.slice(addr, addr + len);
        FS2.msync(stream, buffer2, offset, len, flags);
      }, doMkdir: function(path, mode) {
        path = PATH.normalize(path);
        if (path[path.length - 1] === "/")
          path = path.substr(0, path.length - 1);
        FS2.mkdir(path, mode, 0);
        return 0;
      }, doMknod: function(path, mode, dev) {
        switch (mode & 61440) {
          case 32768:
          case 8192:
          case 24576:
          case 4096:
          case 49152:
            break;
          default:
            return -28;
        }
        FS2.mknod(path, mode, dev);
        return 0;
      }, doReadlink: function(path, buf, bufsize) {
        if (bufsize <= 0)
          return -28;
        var ret = FS2.readlink(path);
        var len = Math.min(bufsize, lengthBytesUTF8(ret));
        var endChar = HEAP8[buf + len];
        stringToUTF8(ret, buf, bufsize + 1);
        HEAP8[buf + len] = endChar;
        return len;
      }, doAccess: function(path, amode) {
        if (amode & ~7) {
          return -28;
        }
        var lookup = FS2.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node) {
          return -44;
        }
        var perms = "";
        if (amode & 4)
          perms += "r";
        if (amode & 2)
          perms += "w";
        if (amode & 1)
          perms += "x";
        if (perms && FS2.nodePermissions(node, perms)) {
          return -2;
        }
        return 0;
      }, doDup: function(path, flags, suggestFD) {
        var suggest = FS2.getStream(suggestFD);
        if (suggest)
          FS2.close(suggest);
        return FS2.open(path, flags, 0, suggestFD, suggestFD).fd;
      }, doReadv: function(stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAP32[iov + i * 8 >> 2];
          var len = HEAP32[iov + (i * 8 + 4) >> 2];
          var curr = FS2.read(stream, HEAP8, ptr, len, offset);
          if (curr < 0)
            return -1;
          ret += curr;
          if (curr < len)
            break;
        }
        return ret;
      }, doWritev: function(stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAP32[iov + i * 8 >> 2];
          var len = HEAP32[iov + (i * 8 + 4) >> 2];
          var curr = FS2.write(stream, HEAP8, ptr, len, offset);
          if (curr < 0)
            return -1;
          ret += curr;
        }
        return ret;
      }, varargs: void 0, get: function() {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
        return ret;
      }, getStr: function(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      }, getStreamFromFD: function(fd) {
        var stream = FS2.getStream(fd);
        if (!stream)
          throw new FS2.ErrnoError(8);
        return stream;
      }, get64: function(low, high) {
        return low;
      } };
      function ___syscall_access(path, amode) {
        try {
          path = SYSCALLS.getStr(path);
          return SYSCALLS.doAccess(path, amode);
        } catch (e) {
          if (typeof FS2 === "undefined" || !(e instanceof FS2.ErrnoError))
            throw e;
          return -e.errno;
        }
      }
      function setErrNo(value) {
        HEAP32[___errno_location() >> 2] = value;
        return value;
      }
      function ___syscall_fcntl64(fd, cmd, varargs) {
        SYSCALLS.varargs = varargs;
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          switch (cmd) {
            case 0: {
              var arg = SYSCALLS.get();
              if (arg < 0) {
                return -28;
              }
              var newStream;
              newStream = FS2.open(stream.path, stream.flags, 0, arg);
              return newStream.fd;
            }
            case 1:
            case 2:
              return 0;
            case 3:
              return stream.flags;
            case 4: {
              var arg = SYSCALLS.get();
              stream.flags |= arg;
              return 0;
            }
            case 5: {
              var arg = SYSCALLS.get();
              var offset = 0;
              HEAP16[arg + offset >> 1] = 2;
              return 0;
            }
            case 6:
            case 7:
              return 0;
            case 16:
            case 8:
              return -28;
            case 9:
              setErrNo(28);
              return -1;
            default: {
              return -28;
            }
          }
        } catch (e) {
          if (typeof FS2 === "undefined" || !(e instanceof FS2.ErrnoError))
            throw e;
          return -e.errno;
        }
      }
      function ___syscall_fstat64(fd, buf) {
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          return SYSCALLS.doStat(FS2.stat, stream.path, buf);
        } catch (e) {
          if (typeof FS2 === "undefined" || !(e instanceof FS2.ErrnoError))
            throw e;
          return -e.errno;
        }
      }
      function ___syscall_fstatat64(dirfd, path, buf, flags) {
        try {
          path = SYSCALLS.getStr(path);
          var nofollow = flags & 256;
          var allowEmpty = flags & 4096;
          flags = flags & ~4352;
          path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
          return SYSCALLS.doStat(nofollow ? FS2.lstat : FS2.stat, path, buf);
        } catch (e) {
          if (typeof FS2 === "undefined" || !(e instanceof FS2.ErrnoError))
            throw e;
          return -e.errno;
        }
      }
      function ___syscall_ftruncate64(fd, low, high) {
        try {
          var length = SYSCALLS.get64(low, high);
          FS2.ftruncate(fd, length);
          return 0;
        } catch (e) {
          if (typeof FS2 === "undefined" || !(e instanceof FS2.ErrnoError))
            throw e;
          return -e.errno;
        }
      }
      function ___syscall_getcwd(buf, size) {
        try {
          if (size === 0)
            return -28;
          var cwd = FS2.cwd();
          var cwdLengthInBytes = lengthBytesUTF8(cwd);
          if (size < cwdLengthInBytes + 1)
            return -68;
          stringToUTF8(cwd, buf, size);
          return buf;
        } catch (e) {
          if (typeof FS2 === "undefined" || !(e instanceof FS2.ErrnoError))
            throw e;
          return -e.errno;
        }
      }
      function ___syscall_getdents64(fd, dirp, count) {
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          if (!stream.getdents) {
            stream.getdents = FS2.readdir(stream.path);
          }
          var struct_size = 280;
          var pos = 0;
          var off = FS2.llseek(stream, 0, 1);
          var idx = Math.floor(off / struct_size);
          while (idx < stream.getdents.length && pos + struct_size <= count) {
            var id;
            var type;
            var name = stream.getdents[idx];
            if (name === ".") {
              id = stream.id;
              type = 4;
            } else if (name === "..") {
              var lookup = FS2.lookupPath(stream.path, { parent: true });
              id = lookup.node.id;
              type = 4;
            } else {
              var child = FS2.lookupNode(stream, name);
              id = child.id;
              type = FS2.isChrdev(child.mode) ? 2 : FS2.isDir(child.mode) ? 4 : FS2.isLink(child.mode) ? 10 : 8;
            }
            HEAP64[dirp + pos >> 3] = BigInt(id);
            HEAP64[dirp + pos + 8 >> 3] = BigInt((idx + 1) * struct_size);
            HEAP16[dirp + pos + 16 >> 1] = 280;
            HEAP8[dirp + pos + 18 >> 0] = type;
            stringToUTF8(name, dirp + pos + 19, 256);
            pos += struct_size;
            idx += 1;
          }
          FS2.llseek(stream, idx * struct_size, 0);
          return pos;
        } catch (e) {
          if (typeof FS2 === "undefined" || !(e instanceof FS2.ErrnoError))
            throw e;
          return -e.errno;
        }
      }
      function ___syscall_ioctl(fd, op, varargs) {
        SYSCALLS.varargs = varargs;
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          switch (op) {
            case 21509:
            case 21505: {
              if (!stream.tty)
                return -59;
              return 0;
            }
            case 21510:
            case 21511:
            case 21512:
            case 21506:
            case 21507:
            case 21508: {
              if (!stream.tty)
                return -59;
              return 0;
            }
            case 21519: {
              if (!stream.tty)
                return -59;
              var argp = SYSCALLS.get();
              HEAP32[argp >> 2] = 0;
              return 0;
            }
            case 21520: {
              if (!stream.tty)
                return -59;
              return -28;
            }
            case 21531: {
              var argp = SYSCALLS.get();
              return FS2.ioctl(stream, op, argp);
            }
            case 21523: {
              if (!stream.tty)
                return -59;
              return 0;
            }
            case 21524: {
              if (!stream.tty)
                return -59;
              return 0;
            }
            default:
              abort("bad ioctl syscall " + op);
          }
        } catch (e) {
          if (typeof FS2 === "undefined" || !(e instanceof FS2.ErrnoError))
            throw e;
          return -e.errno;
        }
      }
      function ___syscall_lstat64(path, buf) {
        try {
          path = SYSCALLS.getStr(path);
          return SYSCALLS.doStat(FS2.lstat, path, buf);
        } catch (e) {
          if (typeof FS2 === "undefined" || !(e instanceof FS2.ErrnoError))
            throw e;
          return -e.errno;
        }
      }
      function ___syscall_open(path, flags, varargs) {
        SYSCALLS.varargs = varargs;
        try {
          var pathname = SYSCALLS.getStr(path);
          var mode = varargs ? SYSCALLS.get() : 0;
          var stream = FS2.open(pathname, flags, mode);
          return stream.fd;
        } catch (e) {
          if (typeof FS2 === "undefined" || !(e instanceof FS2.ErrnoError))
            throw e;
          return -e.errno;
        }
      }
      function ___syscall_readlink(path, buf, bufsize) {
        try {
          path = SYSCALLS.getStr(path);
          return SYSCALLS.doReadlink(path, buf, bufsize);
        } catch (e) {
          if (typeof FS2 === "undefined" || !(e instanceof FS2.ErrnoError))
            throw e;
          return -e.errno;
        }
      }
      function ___syscall_stat64(path, buf) {
        try {
          path = SYSCALLS.getStr(path);
          return SYSCALLS.doStat(FS2.stat, path, buf);
        } catch (e) {
          if (typeof FS2 === "undefined" || !(e instanceof FS2.ErrnoError))
            throw e;
          return -e.errno;
        }
      }
      function __dlopen_js(filename, flag) {
        abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking");
      }
      function __dlsym_js(handle, symbol) {
        abort("To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking");
      }
      function _embind_repr(v) {
        if (v === null) {
          return "null";
        }
        var t = typeof v;
        if (t === "object" || t === "array" || t === "function") {
          return v.toString();
        } else {
          return "" + v;
        }
      }
      function embind_init_charCodes() {
        var codes = new Array(256);
        for (var i = 0; i < 256; ++i) {
          codes[i] = String.fromCharCode(i);
        }
        embind_charCodes = codes;
      }
      var embind_charCodes = void 0;
      function readLatin1String(ptr) {
        var ret = "";
        var c = ptr;
        while (HEAPU8[c]) {
          ret += embind_charCodes[HEAPU8[c++]];
        }
        return ret;
      }
      var awaitingDependencies = {};
      var registeredTypes = {};
      var typeDependencies = {};
      var char_0 = 48;
      var char_9 = 57;
      function makeLegalFunctionName(name) {
        if (name === void 0) {
          return "_unknown";
        }
        name = name.replace(/[^a-zA-Z0-9_]/g, "$");
        var f = name.charCodeAt(0);
        if (f >= char_0 && f <= char_9) {
          return "_" + name;
        } else {
          return name;
        }
      }
      function createNamedFunction(name, body) {
        name = makeLegalFunctionName(name);
        return new Function("body", "return function " + name + '() {\n    "use strict";    return body.apply(this, arguments);\n};\n')(body);
      }
      function extendError(baseErrorType, errorName) {
        var errorClass = createNamedFunction(errorName, function(message) {
          this.name = errorName;
          this.message = message;
          var stack = new Error(message).stack;
          if (stack !== void 0) {
            this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
          }
        });
        errorClass.prototype = Object.create(baseErrorType.prototype);
        errorClass.prototype.constructor = errorClass;
        errorClass.prototype.toString = function() {
          if (this.message === void 0) {
            return this.name;
          } else {
            return this.name + ": " + this.message;
          }
        };
        return errorClass;
      }
      var BindingError = void 0;
      function throwBindingError(message) {
        throw new BindingError(message);
      }
      var InternalError = void 0;
      function throwInternalError(message) {
        throw new InternalError(message);
      }
      function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
        myTypes.forEach(function(type) {
          typeDependencies[type] = dependentTypes;
        });
        function onComplete(typeConverters2) {
          var myTypeConverters = getTypeConverters(typeConverters2);
          if (myTypeConverters.length !== myTypes.length) {
            throwInternalError("Mismatched type converter count");
          }
          for (var i = 0; i < myTypes.length; ++i) {
            registerType(myTypes[i], myTypeConverters[i]);
          }
        }
        var typeConverters = new Array(dependentTypes.length);
        var unregisteredTypes = [];
        var registered = 0;
        dependentTypes.forEach(function(dt, i) {
          if (registeredTypes.hasOwnProperty(dt)) {
            typeConverters[i] = registeredTypes[dt];
          } else {
            unregisteredTypes.push(dt);
            if (!awaitingDependencies.hasOwnProperty(dt)) {
              awaitingDependencies[dt] = [];
            }
            awaitingDependencies[dt].push(function() {
              typeConverters[i] = registeredTypes[dt];
              ++registered;
              if (registered === unregisteredTypes.length) {
                onComplete(typeConverters);
              }
            });
          }
        });
        if (unregisteredTypes.length === 0) {
          onComplete(typeConverters);
        }
      }
      function registerType(rawType, registeredInstance, options = {}) {
        if (!("argPackAdvance" in registeredInstance)) {
          throw new TypeError("registerType registeredInstance requires argPackAdvance");
        }
        var name = registeredInstance.name;
        if (!rawType) {
          throwBindingError('type "' + name + '" must have a positive integer typeid pointer');
        }
        if (registeredTypes.hasOwnProperty(rawType)) {
          if (options.ignoreDuplicateRegistrations) {
            return;
          } else {
            throwBindingError("Cannot register type '" + name + "' twice");
          }
        }
        registeredTypes[rawType] = registeredInstance;
        delete typeDependencies[rawType];
        if (awaitingDependencies.hasOwnProperty(rawType)) {
          var callbacks = awaitingDependencies[rawType];
          delete awaitingDependencies[rawType];
          callbacks.forEach(function(cb) {
            cb();
          });
        }
      }
      function integerReadValueFromPointer(name, shift, signed) {
        switch (shift) {
          case 0:
            return signed ? function readS8FromPointer(pointer) {
              return HEAP8[pointer];
            } : function readU8FromPointer(pointer) {
              return HEAPU8[pointer];
            };
          case 1:
            return signed ? function readS16FromPointer(pointer) {
              return HEAP16[pointer >> 1];
            } : function readU16FromPointer(pointer) {
              return HEAPU16[pointer >> 1];
            };
          case 2:
            return signed ? function readS32FromPointer(pointer) {
              return HEAP32[pointer >> 2];
            } : function readU32FromPointer(pointer) {
              return HEAPU32[pointer >> 2];
            };
          case 3:
            return signed ? function readS64FromPointer(pointer) {
              return HEAP64[pointer >> 3];
            } : function readU64FromPointer(pointer) {
              return HEAPU64[pointer >> 3];
            };
          default:
            throw new TypeError("Unknown integer type: " + name);
        }
      }
      function __embind_register_bigint(primitiveType, name, size, minRange, maxRange) {
        name = readLatin1String(name);
        var shift = getShiftFromSize(size);
        var isUnsignedType = name.indexOf("u") != -1;
        if (isUnsignedType) {
          maxRange = (BigInt(1) << BigInt(64)) - BigInt(1);
        }
        registerType(primitiveType, { name, "fromWireType": function(value) {
          return value;
        }, "toWireType": function(destructors, value) {
          if (typeof value !== "bigint") {
            throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
          }
          if (value < minRange || value > maxRange) {
            throw new TypeError('Passing a number "' + _embind_repr(value) + '" from JS side to C/C++ side to an argument of type "' + name + '", which is outside the valid range [' + minRange + ", " + maxRange + "]!");
          }
          return value;
        }, "argPackAdvance": 8, "readValueFromPointer": integerReadValueFromPointer(name, shift, !isUnsignedType), destructorFunction: null });
      }
      function getShiftFromSize(size) {
        switch (size) {
          case 1:
            return 0;
          case 2:
            return 1;
          case 4:
            return 2;
          case 8:
            return 3;
          default:
            throw new TypeError("Unknown type size: " + size);
        }
      }
      function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
        var shift = getShiftFromSize(size);
        name = readLatin1String(name);
        registerType(rawType, { name, "fromWireType": function(wt) {
          return !!wt;
        }, "toWireType": function(destructors, o) {
          return o ? trueValue : falseValue;
        }, "argPackAdvance": 8, "readValueFromPointer": function(pointer) {
          var heap;
          if (size === 1) {
            heap = HEAP8;
          } else if (size === 2) {
            heap = HEAP16;
          } else if (size === 4) {
            heap = HEAP32;
          } else {
            throw new TypeError("Unknown boolean type size: " + name);
          }
          return this["fromWireType"](heap[pointer >> shift]);
        }, destructorFunction: null });
      }
      function ClassHandle_isAliasOf(other) {
        if (!(this instanceof ClassHandle)) {
          return false;
        }
        if (!(other instanceof ClassHandle)) {
          return false;
        }
        var leftClass = this.$$.ptrType.registeredClass;
        var left = this.$$.ptr;
        var rightClass = other.$$.ptrType.registeredClass;
        var right = other.$$.ptr;
        while (leftClass.baseClass) {
          left = leftClass.upcast(left);
          leftClass = leftClass.baseClass;
        }
        while (rightClass.baseClass) {
          right = rightClass.upcast(right);
          rightClass = rightClass.baseClass;
        }
        return leftClass === rightClass && left === right;
      }
      function shallowCopyInternalPointer(o) {
        return { count: o.count, deleteScheduled: o.deleteScheduled, preservePointerOnDelete: o.preservePointerOnDelete, ptr: o.ptr, ptrType: o.ptrType, smartPtr: o.smartPtr, smartPtrType: o.smartPtrType };
      }
      function throwInstanceAlreadyDeleted(obj) {
        function getInstanceTypeName(handle) {
          return handle.$$.ptrType.registeredClass.name;
        }
        throwBindingError(getInstanceTypeName(obj) + " instance already deleted");
      }
      var finalizationGroup = false;
      function detachFinalizer(handle) {
      }
      function runDestructor($$) {
        if ($$.smartPtr) {
          $$.smartPtrType.rawDestructor($$.smartPtr);
        } else {
          $$.ptrType.registeredClass.rawDestructor($$.ptr);
        }
      }
      function releaseClassHandle($$) {
        $$.count.value -= 1;
        var toDelete = $$.count.value === 0;
        if (toDelete) {
          runDestructor($$);
        }
      }
      function attachFinalizer(handle) {
        if (typeof FinalizationGroup === "undefined") {
          attachFinalizer = (handle2) => handle2;
          return handle;
        }
        finalizationGroup = new FinalizationGroup(function(iter) {
          for (var result = iter.next(); !result.done; result = iter.next()) {
            var $$ = result.value;
            if (!$$.ptr) {
              console.warn("object already deleted: " + $$.ptr);
            } else {
              releaseClassHandle($$);
            }
          }
        });
        attachFinalizer = (handle2) => {
          finalizationGroup.register(handle2, handle2.$$, handle2.$$);
          return handle2;
        };
        detachFinalizer = (handle2) => {
          finalizationGroup.unregister(handle2.$$);
        };
        return attachFinalizer(handle);
      }
      function ClassHandle_clone() {
        if (!this.$$.ptr) {
          throwInstanceAlreadyDeleted(this);
        }
        if (this.$$.preservePointerOnDelete) {
          this.$$.count.value += 1;
          return this;
        } else {
          var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), { $$: { value: shallowCopyInternalPointer(this.$$) } }));
          clone.$$.count.value += 1;
          clone.$$.deleteScheduled = false;
          return clone;
        }
      }
      function ClassHandle_delete() {
        if (!this.$$.ptr) {
          throwInstanceAlreadyDeleted(this);
        }
        if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
          throwBindingError("Object already scheduled for deletion");
        }
        detachFinalizer(this);
        releaseClassHandle(this.$$);
        if (!this.$$.preservePointerOnDelete) {
          this.$$.smartPtr = void 0;
          this.$$.ptr = void 0;
        }
      }
      function ClassHandle_isDeleted() {
        return !this.$$.ptr;
      }
      var delayFunction = void 0;
      var deletionQueue = [];
      function flushPendingDeletes() {
        while (deletionQueue.length) {
          var obj = deletionQueue.pop();
          obj.$$.deleteScheduled = false;
          obj["delete"]();
        }
      }
      function ClassHandle_deleteLater() {
        if (!this.$$.ptr) {
          throwInstanceAlreadyDeleted(this);
        }
        if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
          throwBindingError("Object already scheduled for deletion");
        }
        deletionQueue.push(this);
        if (deletionQueue.length === 1 && delayFunction) {
          delayFunction(flushPendingDeletes);
        }
        this.$$.deleteScheduled = true;
        return this;
      }
      function init_ClassHandle() {
        ClassHandle.prototype["isAliasOf"] = ClassHandle_isAliasOf;
        ClassHandle.prototype["clone"] = ClassHandle_clone;
        ClassHandle.prototype["delete"] = ClassHandle_delete;
        ClassHandle.prototype["isDeleted"] = ClassHandle_isDeleted;
        ClassHandle.prototype["deleteLater"] = ClassHandle_deleteLater;
      }
      function ClassHandle() {
      }
      var registeredPointers = {};
      function ensureOverloadTable(proto, methodName, humanName) {
        if (proto[methodName].overloadTable === void 0) {
          var prevFunc = proto[methodName];
          proto[methodName] = function() {
            if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
              throwBindingError("Function '" + humanName + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + proto[methodName].overloadTable + ")!");
            }
            return proto[methodName].overloadTable[arguments.length].apply(this, arguments);
          };
          proto[methodName].overloadTable = [];
          proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
        }
      }
      function exposePublicSymbol(name, value, numArguments) {
        if (Module3.hasOwnProperty(name)) {
          if (numArguments === void 0 || Module3[name].overloadTable !== void 0 && Module3[name].overloadTable[numArguments] !== void 0) {
            throwBindingError("Cannot register public name '" + name + "' twice");
          }
          ensureOverloadTable(Module3, name, name);
          if (Module3.hasOwnProperty(numArguments)) {
            throwBindingError("Cannot register multiple overloads of a function with the same number of arguments (" + numArguments + ")!");
          }
          Module3[name].overloadTable[numArguments] = value;
        } else {
          Module3[name] = value;
          if (numArguments !== void 0) {
            Module3[name].numArguments = numArguments;
          }
        }
      }
      function RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
        this.name = name;
        this.constructor = constructor;
        this.instancePrototype = instancePrototype;
        this.rawDestructor = rawDestructor;
        this.baseClass = baseClass;
        this.getActualType = getActualType;
        this.upcast = upcast;
        this.downcast = downcast;
        this.pureVirtualFunctions = [];
      }
      function upcastPointer(ptr, ptrClass, desiredClass) {
        while (ptrClass !== desiredClass) {
          if (!ptrClass.upcast) {
            throwBindingError("Expected null or instance of " + desiredClass.name + ", got an instance of " + ptrClass.name);
          }
          ptr = ptrClass.upcast(ptr);
          ptrClass = ptrClass.baseClass;
        }
        return ptr;
      }
      function constNoSmartPtrRawPointerToWireType(destructors, handle) {
        if (handle === null) {
          if (this.isReference) {
            throwBindingError("null is not a valid " + this.name);
          }
          return 0;
        }
        if (!handle.$$) {
          throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
        }
        if (!handle.$$.ptr) {
          throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
        }
        var handleClass = handle.$$.ptrType.registeredClass;
        var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
        return ptr;
      }
      function genericPointerToWireType(destructors, handle) {
        var ptr;
        if (handle === null) {
          if (this.isReference) {
            throwBindingError("null is not a valid " + this.name);
          }
          if (this.isSmartPointer) {
            ptr = this.rawConstructor();
            if (destructors !== null) {
              destructors.push(this.rawDestructor, ptr);
            }
            return ptr;
          } else {
            return 0;
          }
        }
        if (!handle.$$) {
          throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
        }
        if (!handle.$$.ptr) {
          throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
        }
        if (!this.isConst && handle.$$.ptrType.isConst) {
          throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name);
        }
        var handleClass = handle.$$.ptrType.registeredClass;
        ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
        if (this.isSmartPointer) {
          if (handle.$$.smartPtr === void 0) {
            throwBindingError("Passing raw pointer to smart pointer is illegal");
          }
          switch (this.sharingPolicy) {
            case 0:
              if (handle.$$.smartPtrType === this) {
                ptr = handle.$$.smartPtr;
              } else {
                throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name);
              }
              break;
            case 1:
              ptr = handle.$$.smartPtr;
              break;
            case 2:
              if (handle.$$.smartPtrType === this) {
                ptr = handle.$$.smartPtr;
              } else {
                var clonedHandle = handle["clone"]();
                ptr = this.rawShare(ptr, Emval.toHandle(function() {
                  clonedHandle["delete"]();
                }));
                if (destructors !== null) {
                  destructors.push(this.rawDestructor, ptr);
                }
              }
              break;
            default:
              throwBindingError("Unsupporting sharing policy");
          }
        }
        return ptr;
      }
      function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
        if (handle === null) {
          if (this.isReference) {
            throwBindingError("null is not a valid " + this.name);
          }
          return 0;
        }
        if (!handle.$$) {
          throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
        }
        if (!handle.$$.ptr) {
          throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
        }
        if (handle.$$.ptrType.isConst) {
          throwBindingError("Cannot convert argument of type " + handle.$$.ptrType.name + " to parameter type " + this.name);
        }
        var handleClass = handle.$$.ptrType.registeredClass;
        var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
        return ptr;
      }
      function simpleReadValueFromPointer(pointer) {
        return this["fromWireType"](HEAPU32[pointer >> 2]);
      }
      function RegisteredPointer_getPointee(ptr) {
        if (this.rawGetPointee) {
          ptr = this.rawGetPointee(ptr);
        }
        return ptr;
      }
      function RegisteredPointer_destructor(ptr) {
        if (this.rawDestructor) {
          this.rawDestructor(ptr);
        }
      }
      function RegisteredPointer_deleteObject(handle) {
        if (handle !== null) {
          handle["delete"]();
        }
      }
      function downcastPointer(ptr, ptrClass, desiredClass) {
        if (ptrClass === desiredClass) {
          return ptr;
        }
        if (desiredClass.baseClass === void 0) {
          return null;
        }
        var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
        if (rv === null) {
          return null;
        }
        return desiredClass.downcast(rv);
      }
      function getInheritedInstanceCount() {
        return Object.keys(registeredInstances).length;
      }
      function getLiveInheritedInstances() {
        var rv = [];
        for (var k in registeredInstances) {
          if (registeredInstances.hasOwnProperty(k)) {
            rv.push(registeredInstances[k]);
          }
        }
        return rv;
      }
      function setDelayFunction(fn) {
        delayFunction = fn;
        if (deletionQueue.length && delayFunction) {
          delayFunction(flushPendingDeletes);
        }
      }
      function init_embind() {
        Module3["getInheritedInstanceCount"] = getInheritedInstanceCount;
        Module3["getLiveInheritedInstances"] = getLiveInheritedInstances;
        Module3["flushPendingDeletes"] = flushPendingDeletes;
        Module3["setDelayFunction"] = setDelayFunction;
      }
      var registeredInstances = {};
      function getBasestPointer(class_, ptr) {
        if (ptr === void 0) {
          throwBindingError("ptr should not be undefined");
        }
        while (class_.baseClass) {
          ptr = class_.upcast(ptr);
          class_ = class_.baseClass;
        }
        return ptr;
      }
      function getInheritedInstance(class_, ptr) {
        ptr = getBasestPointer(class_, ptr);
        return registeredInstances[ptr];
      }
      function makeClassHandle(prototype, record) {
        if (!record.ptrType || !record.ptr) {
          throwInternalError("makeClassHandle requires ptr and ptrType");
        }
        var hasSmartPtrType = !!record.smartPtrType;
        var hasSmartPtr = !!record.smartPtr;
        if (hasSmartPtrType !== hasSmartPtr) {
          throwInternalError("Both smartPtrType and smartPtr must be specified");
        }
        record.count = { value: 1 };
        return attachFinalizer(Object.create(prototype, { $$: { value: record } }));
      }
      function RegisteredPointer_fromWireType(ptr) {
        var rawPointer = this.getPointee(ptr);
        if (!rawPointer) {
          this.destructor(ptr);
          return null;
        }
        var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
        if (registeredInstance !== void 0) {
          if (registeredInstance.$$.count.value === 0) {
            registeredInstance.$$.ptr = rawPointer;
            registeredInstance.$$.smartPtr = ptr;
            return registeredInstance["clone"]();
          } else {
            var rv = registeredInstance["clone"]();
            this.destructor(ptr);
            return rv;
          }
        }
        function makeDefaultHandle() {
          if (this.isSmartPointer) {
            return makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: rawPointer, smartPtrType: this, smartPtr: ptr });
          } else {
            return makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this, ptr });
          }
        }
        var actualType = this.registeredClass.getActualType(rawPointer);
        var registeredPointerRecord = registeredPointers[actualType];
        if (!registeredPointerRecord) {
          return makeDefaultHandle.call(this);
        }
        var toType;
        if (this.isConst) {
          toType = registeredPointerRecord.constPointerType;
        } else {
          toType = registeredPointerRecord.pointerType;
        }
        var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);
        if (dp === null) {
          return makeDefaultHandle.call(this);
        }
        if (this.isSmartPointer) {
          return makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp, smartPtrType: this, smartPtr: ptr });
        } else {
          return makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp });
        }
      }
      function init_RegisteredPointer() {
        RegisteredPointer.prototype.getPointee = RegisteredPointer_getPointee;
        RegisteredPointer.prototype.destructor = RegisteredPointer_destructor;
        RegisteredPointer.prototype["argPackAdvance"] = 8;
        RegisteredPointer.prototype["readValueFromPointer"] = simpleReadValueFromPointer;
        RegisteredPointer.prototype["deleteObject"] = RegisteredPointer_deleteObject;
        RegisteredPointer.prototype["fromWireType"] = RegisteredPointer_fromWireType;
      }
      function RegisteredPointer(name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
        this.name = name;
        this.registeredClass = registeredClass;
        this.isReference = isReference;
        this.isConst = isConst;
        this.isSmartPointer = isSmartPointer;
        this.pointeeType = pointeeType;
        this.sharingPolicy = sharingPolicy;
        this.rawGetPointee = rawGetPointee;
        this.rawConstructor = rawConstructor;
        this.rawShare = rawShare;
        this.rawDestructor = rawDestructor;
        if (!isSmartPointer && registeredClass.baseClass === void 0) {
          if (isConst) {
            this["toWireType"] = constNoSmartPtrRawPointerToWireType;
            this.destructorFunction = null;
          } else {
            this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
            this.destructorFunction = null;
          }
        } else {
          this["toWireType"] = genericPointerToWireType;
        }
      }
      function replacePublicSymbol(name, value, numArguments) {
        if (!Module3.hasOwnProperty(name)) {
          throwInternalError("Replacing nonexistant public symbol");
        }
        if (Module3[name].overloadTable !== void 0 && numArguments !== void 0) {
          Module3[name].overloadTable[numArguments] = value;
        } else {
          Module3[name] = value;
          Module3[name].argCount = numArguments;
        }
      }
      function embind__requireFunction(signature, rawFunction) {
        signature = readLatin1String(signature);
        function makeDynCaller() {
          return getWasmTableEntry(rawFunction);
        }
        var fp = makeDynCaller();
        if (typeof fp !== "function") {
          throwBindingError("unknown function pointer with signature " + signature + ": " + rawFunction);
        }
        return fp;
      }
      var UnboundTypeError = void 0;
      function getTypeName(type) {
        var ptr = ___getTypeName(type);
        var rv = readLatin1String(ptr);
        _free(ptr);
        return rv;
      }
      function throwUnboundTypeError(message, types) {
        var unboundTypes = [];
        var seen = {};
        function visit(type) {
          if (seen[type]) {
            return;
          }
          if (registeredTypes[type]) {
            return;
          }
          if (typeDependencies[type]) {
            typeDependencies[type].forEach(visit);
            return;
          }
          unboundTypes.push(type);
          seen[type] = true;
        }
        types.forEach(visit);
        throw new UnboundTypeError(message + ": " + unboundTypes.map(getTypeName).join([", "]));
      }
      function __embind_register_class(rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) {
        name = readLatin1String(name);
        getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
        if (upcast) {
          upcast = embind__requireFunction(upcastSignature, upcast);
        }
        if (downcast) {
          downcast = embind__requireFunction(downcastSignature, downcast);
        }
        rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
        var legalFunctionName = makeLegalFunctionName(name);
        exposePublicSymbol(legalFunctionName, function() {
          throwUnboundTypeError("Cannot construct " + name + " due to unbound types", [baseClassRawType]);
        });
        whenDependentTypesAreResolved([rawType, rawPointerType, rawConstPointerType], baseClassRawType ? [baseClassRawType] : [], function(base) {
          base = base[0];
          var baseClass;
          var basePrototype;
          if (baseClassRawType) {
            baseClass = base.registeredClass;
            basePrototype = baseClass.instancePrototype;
          } else {
            basePrototype = ClassHandle.prototype;
          }
          var constructor = createNamedFunction(legalFunctionName, function() {
            if (Object.getPrototypeOf(this) !== instancePrototype) {
              throw new BindingError("Use 'new' to construct " + name);
            }
            if (registeredClass.constructor_body === void 0) {
              throw new BindingError(name + " has no accessible constructor");
            }
            var body = registeredClass.constructor_body[arguments.length];
            if (body === void 0) {
              throw new BindingError("Tried to invoke ctor of " + name + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(registeredClass.constructor_body).toString() + ") parameters instead!");
            }
            return body.apply(this, arguments);
          });
          var instancePrototype = Object.create(basePrototype, { constructor: { value: constructor } });
          constructor.prototype = instancePrototype;
          var registeredClass = new RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast);
          var referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false);
          var pointerConverter = new RegisteredPointer(name + "*", registeredClass, false, false, false);
          var constPointerConverter = new RegisteredPointer(name + " const*", registeredClass, false, true, false);
          registeredPointers[rawType] = { pointerType: pointerConverter, constPointerType: constPointerConverter };
          replacePublicSymbol(legalFunctionName, constructor);
          return [referenceConverter, pointerConverter, constPointerConverter];
        });
      }
      function heap32VectorToArray(count, firstElement) {
        var array = [];
        for (var i = 0; i < count; i++) {
          array.push(HEAP32[(firstElement >> 2) + i]);
        }
        return array;
      }
      function runDestructors(destructors) {
        while (destructors.length) {
          var ptr = destructors.pop();
          var del = destructors.pop();
          del(ptr);
        }
      }
      function __embind_register_class_constructor(rawClassType, argCount, rawArgTypesAddr, invokerSignature, invoker, rawConstructor) {
        assert(argCount > 0);
        var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
        invoker = embind__requireFunction(invokerSignature, invoker);
        whenDependentTypesAreResolved([], [rawClassType], function(classType) {
          classType = classType[0];
          var humanName = "constructor " + classType.name;
          if (classType.registeredClass.constructor_body === void 0) {
            classType.registeredClass.constructor_body = [];
          }
          if (classType.registeredClass.constructor_body[argCount - 1] !== void 0) {
            throw new BindingError("Cannot register multiple constructors with identical number of parameters (" + (argCount - 1) + ") for class '" + classType.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!");
          }
          classType.registeredClass.constructor_body[argCount - 1] = () => {
            throwUnboundTypeError("Cannot construct " + classType.name + " due to unbound types", rawArgTypes);
          };
          whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
            argTypes.splice(1, 0, null);
            classType.registeredClass.constructor_body[argCount - 1] = craftInvokerFunction(humanName, argTypes, null, invoker, rawConstructor);
            return [];
          });
          return [];
        });
      }
      function new_(constructor, argumentList) {
        if (!(constructor instanceof Function)) {
          throw new TypeError("new_ called with constructor type " + typeof constructor + " which is not a function");
        }
        var dummy = createNamedFunction(constructor.name || "unknownFunctionName", function() {
        });
        dummy.prototype = constructor.prototype;
        var obj = new dummy();
        var r = constructor.apply(obj, argumentList);
        return r instanceof Object ? r : obj;
      }
      function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
        var argCount = argTypes.length;
        if (argCount < 2) {
          throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
        }
        var isClassMethodFunc = argTypes[1] !== null && classType !== null;
        var needsDestructorStack = false;
        for (var i = 1; i < argTypes.length; ++i) {
          if (argTypes[i] !== null && argTypes[i].destructorFunction === void 0) {
            needsDestructorStack = true;
            break;
          }
        }
        var returns = argTypes[0].name !== "void";
        var argsList = "";
        var argsListWired = "";
        for (var i = 0; i < argCount - 2; ++i) {
          argsList += (i !== 0 ? ", " : "") + "arg" + i;
          argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired";
        }
        var invokerFnBody = "return function " + makeLegalFunctionName(humanName) + "(" + argsList + ") {\nif (arguments.length !== " + (argCount - 2) + ") {\nthrowBindingError('function " + humanName + " called with ' + arguments.length + ' arguments, expected " + (argCount - 2) + " args!');\n}\n";
        if (needsDestructorStack) {
          invokerFnBody += "var destructors = [];\n";
        }
        var dtorStack = needsDestructorStack ? "destructors" : "null";
        var args1 = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"];
        var args2 = [throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];
        if (isClassMethodFunc) {
          invokerFnBody += "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n";
        }
        for (var i = 0; i < argCount - 2; ++i) {
          invokerFnBody += "var arg" + i + "Wired = argType" + i + ".toWireType(" + dtorStack + ", arg" + i + "); // " + argTypes[i + 2].name + "\n";
          args1.push("argType" + i);
          args2.push(argTypes[i + 2]);
        }
        if (isClassMethodFunc) {
          argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired;
        }
        invokerFnBody += (returns ? "var rv = " : "") + "invoker(fn" + (argsListWired.length > 0 ? ", " : "") + argsListWired + ");\n";
        if (needsDestructorStack) {
          invokerFnBody += "runDestructors(destructors);\n";
        } else {
          for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
            var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";
            if (argTypes[i].destructorFunction !== null) {
              invokerFnBody += paramName + "_dtor(" + paramName + "); // " + argTypes[i].name + "\n";
              args1.push(paramName + "_dtor");
              args2.push(argTypes[i].destructorFunction);
            }
          }
        }
        if (returns) {
          invokerFnBody += "var ret = retType.fromWireType(rv);\nreturn ret;\n";
        } else {
        }
        invokerFnBody += "}\n";
        args1.push(invokerFnBody);
        var invokerFunction = new_(Function, args1).apply(null, args2);
        return invokerFunction;
      }
      function __embind_register_class_function(rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, context, isPureVirtual) {
        var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
        methodName = readLatin1String(methodName);
        rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
        whenDependentTypesAreResolved([], [rawClassType], function(classType) {
          classType = classType[0];
          var humanName = classType.name + "." + methodName;
          if (methodName.startsWith("@@")) {
            methodName = Symbol[methodName.substring(2)];
          }
          if (isPureVirtual) {
            classType.registeredClass.pureVirtualFunctions.push(methodName);
          }
          function unboundTypesHandler() {
            throwUnboundTypeError("Cannot call " + humanName + " due to unbound types", rawArgTypes);
          }
          var proto = classType.registeredClass.instancePrototype;
          var method = proto[methodName];
          if (method === void 0 || method.overloadTable === void 0 && method.className !== classType.name && method.argCount === argCount - 2) {
            unboundTypesHandler.argCount = argCount - 2;
            unboundTypesHandler.className = classType.name;
            proto[methodName] = unboundTypesHandler;
          } else {
            ensureOverloadTable(proto, methodName, humanName);
            proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
          }
          whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
            var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context);
            if (proto[methodName].overloadTable === void 0) {
              memberFunction.argCount = argCount - 2;
              proto[methodName] = memberFunction;
            } else {
              proto[methodName].overloadTable[argCount - 2] = memberFunction;
            }
            return [];
          });
          return [];
        });
      }
      function validateThis(this_, classType, humanName) {
        if (!(this_ instanceof Object)) {
          throwBindingError(humanName + ' with invalid "this": ' + this_);
        }
        if (!(this_ instanceof classType.registeredClass.constructor)) {
          throwBindingError(humanName + ' incompatible with "this" of type ' + this_.constructor.name);
        }
        if (!this_.$$.ptr) {
          throwBindingError("cannot call emscripten binding method " + humanName + " on deleted object");
        }
        return upcastPointer(this_.$$.ptr, this_.$$.ptrType.registeredClass, classType.registeredClass);
      }
      function __embind_register_class_property(classType, fieldName, getterReturnType, getterSignature, getter, getterContext, setterArgumentType, setterSignature, setter, setterContext) {
        fieldName = readLatin1String(fieldName);
        getter = embind__requireFunction(getterSignature, getter);
        whenDependentTypesAreResolved([], [classType], function(classType2) {
          classType2 = classType2[0];
          var humanName = classType2.name + "." + fieldName;
          var desc = { get: function() {
            throwUnboundTypeError("Cannot access " + humanName + " due to unbound types", [getterReturnType, setterArgumentType]);
          }, enumerable: true, configurable: true };
          if (setter) {
            desc.set = () => {
              throwUnboundTypeError("Cannot access " + humanName + " due to unbound types", [getterReturnType, setterArgumentType]);
            };
          } else {
            desc.set = (v) => {
              throwBindingError(humanName + " is a read-only property");
            };
          }
          Object.defineProperty(classType2.registeredClass.instancePrototype, fieldName, desc);
          whenDependentTypesAreResolved([], setter ? [getterReturnType, setterArgumentType] : [getterReturnType], function(types) {
            var getterReturnType2 = types[0];
            var desc2 = { get: function() {
              var ptr = validateThis(this, classType2, humanName + " getter");
              return getterReturnType2["fromWireType"](getter(getterContext, ptr));
            }, enumerable: true };
            if (setter) {
              setter = embind__requireFunction(setterSignature, setter);
              var setterArgumentType2 = types[1];
              desc2.set = function(v) {
                var ptr = validateThis(this, classType2, humanName + " setter");
                var destructors = [];
                setter(setterContext, ptr, setterArgumentType2["toWireType"](destructors, v));
                runDestructors(destructors);
              };
            }
            Object.defineProperty(classType2.registeredClass.instancePrototype, fieldName, desc2);
            return [];
          });
          return [];
        });
      }
      function __embind_register_constant(name, type, value) {
        name = readLatin1String(name);
        whenDependentTypesAreResolved([], [type], function(type2) {
          type2 = type2[0];
          Module3[name] = type2["fromWireType"](value);
          return [];
        });
      }
      var emval_free_list = [];
      var emval_handle_array = [{}, { value: void 0 }, { value: null }, { value: true }, { value: false }];
      function __emval_decref(handle) {
        if (handle > 4 && --emval_handle_array[handle].refcount === 0) {
          emval_handle_array[handle] = void 0;
          emval_free_list.push(handle);
        }
      }
      function count_emval_handles() {
        var count = 0;
        for (var i = 5; i < emval_handle_array.length; ++i) {
          if (emval_handle_array[i] !== void 0) {
            ++count;
          }
        }
        return count;
      }
      function get_first_emval() {
        for (var i = 5; i < emval_handle_array.length; ++i) {
          if (emval_handle_array[i] !== void 0) {
            return emval_handle_array[i];
          }
        }
        return null;
      }
      function init_emval() {
        Module3["count_emval_handles"] = count_emval_handles;
        Module3["get_first_emval"] = get_first_emval;
      }
      var Emval = { toValue: function(handle) {
        if (!handle) {
          throwBindingError("Cannot use deleted val. handle = " + handle);
        }
        return emval_handle_array[handle].value;
      }, toHandle: function(value) {
        switch (value) {
          case void 0: {
            return 1;
          }
          case null: {
            return 2;
          }
          case true: {
            return 3;
          }
          case false: {
            return 4;
          }
          default: {
            var handle = emval_free_list.length ? emval_free_list.pop() : emval_handle_array.length;
            emval_handle_array[handle] = { refcount: 1, value };
            return handle;
          }
        }
      } };
      function __embind_register_emval(rawType, name) {
        name = readLatin1String(name);
        registerType(rawType, { name, "fromWireType": function(handle) {
          var rv = Emval.toValue(handle);
          __emval_decref(handle);
          return rv;
        }, "toWireType": function(destructors, value) {
          return Emval.toHandle(value);
        }, "argPackAdvance": 8, "readValueFromPointer": simpleReadValueFromPointer, destructorFunction: null });
      }
      function enumReadValueFromPointer(name, shift, signed) {
        switch (shift) {
          case 0:
            return function(pointer) {
              var heap = signed ? HEAP8 : HEAPU8;
              return this["fromWireType"](heap[pointer]);
            };
          case 1:
            return function(pointer) {
              var heap = signed ? HEAP16 : HEAPU16;
              return this["fromWireType"](heap[pointer >> 1]);
            };
          case 2:
            return function(pointer) {
              var heap = signed ? HEAP32 : HEAPU32;
              return this["fromWireType"](heap[pointer >> 2]);
            };
          default:
            throw new TypeError("Unknown integer type: " + name);
        }
      }
      function __embind_register_enum(rawType, name, size, isSigned) {
        var shift = getShiftFromSize(size);
        name = readLatin1String(name);
        function ctor() {
        }
        ctor.values = {};
        registerType(rawType, { name, constructor: ctor, "fromWireType": function(c) {
          return this.constructor.values[c];
        }, "toWireType": function(destructors, c) {
          return c.value;
        }, "argPackAdvance": 8, "readValueFromPointer": enumReadValueFromPointer(name, shift, isSigned), destructorFunction: null });
        exposePublicSymbol(name, ctor);
      }
      function requireRegisteredType(rawType, humanName) {
        var impl = registeredTypes[rawType];
        if (impl === void 0) {
          throwBindingError(humanName + " has unknown type " + getTypeName(rawType));
        }
        return impl;
      }
      function __embind_register_enum_value(rawEnumType, name, enumValue) {
        var enumType = requireRegisteredType(rawEnumType, "enum");
        name = readLatin1String(name);
        var Enum = enumType.constructor;
        var Value = Object.create(enumType.constructor.prototype, { value: { value: enumValue }, constructor: { value: createNamedFunction(enumType.name + "_" + name, function() {
        }) } });
        Enum.values[enumValue] = Value;
        Enum[name] = Value;
      }
      function floatReadValueFromPointer(name, shift) {
        switch (shift) {
          case 2:
            return function(pointer) {
              return this["fromWireType"](HEAPF32[pointer >> 2]);
            };
          case 3:
            return function(pointer) {
              return this["fromWireType"](HEAPF64[pointer >> 3]);
            };
          default:
            throw new TypeError("Unknown float type: " + name);
        }
      }
      function __embind_register_float(rawType, name, size) {
        var shift = getShiftFromSize(size);
        name = readLatin1String(name);
        registerType(rawType, { name, "fromWireType": function(value) {
          return value;
        }, "toWireType": function(destructors, value) {
          return value;
        }, "argPackAdvance": 8, "readValueFromPointer": floatReadValueFromPointer(name, shift), destructorFunction: null });
      }
      function __embind_register_function(name, argCount, rawArgTypesAddr, signature, rawInvoker, fn) {
        var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
        name = readLatin1String(name);
        rawInvoker = embind__requireFunction(signature, rawInvoker);
        exposePublicSymbol(name, function() {
          throwUnboundTypeError("Cannot call " + name + " due to unbound types", argTypes);
        }, argCount - 1);
        whenDependentTypesAreResolved([], argTypes, function(argTypes2) {
          var invokerArgsArray = [argTypes2[0], null].concat(argTypes2.slice(1));
          replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn), argCount - 1);
          return [];
        });
      }
      function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
        name = readLatin1String(name);
        if (maxRange === -1) {
          maxRange = 4294967295;
        }
        var shift = getShiftFromSize(size);
        var fromWireType = (value) => value;
        if (minRange === 0) {
          var bitshift = 32 - 8 * size;
          fromWireType = (value) => value << bitshift >>> bitshift;
        }
        var isUnsignedType = name.includes("unsigned");
        var checkAssertions = (value, toTypeName) => {
        };
        var toWireType;
        if (isUnsignedType) {
          toWireType = function(destructors, value) {
            checkAssertions(value, this.name);
            return value >>> 0;
          };
        } else {
          toWireType = function(destructors, value) {
            checkAssertions(value, this.name);
            return value;
          };
        }
        registerType(primitiveType, { name, "fromWireType": fromWireType, "toWireType": toWireType, "argPackAdvance": 8, "readValueFromPointer": integerReadValueFromPointer(name, shift, minRange !== 0), destructorFunction: null });
      }
      function __embind_register_memory_view(rawType, dataTypeIndex, name) {
        var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array];
        var TA = typeMapping[dataTypeIndex];
        function decodeMemoryView(handle) {
          handle = handle >> 2;
          var heap = HEAPU32;
          var size = heap[handle];
          var data = heap[handle + 1];
          return new TA(buffer, data, size);
        }
        name = readLatin1String(name);
        registerType(rawType, { name, "fromWireType": decodeMemoryView, "argPackAdvance": 8, "readValueFromPointer": decodeMemoryView }, { ignoreDuplicateRegistrations: true });
      }
      function __embind_register_std_string(rawType, name) {
        name = readLatin1String(name);
        var stdStringIsUTF8 = name === "std::string";
        registerType(rawType, { name, "fromWireType": function(value) {
          var length = HEAPU32[value >> 2];
          var str;
          if (stdStringIsUTF8) {
            var decodeStartPtr = value + 4;
            for (var i = 0; i <= length; ++i) {
              var currentBytePtr = value + 4 + i;
              if (i == length || HEAPU8[currentBytePtr] == 0) {
                var maxRead = currentBytePtr - decodeStartPtr;
                var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
                if (str === void 0) {
                  str = stringSegment;
                } else {
                  str += String.fromCharCode(0);
                  str += stringSegment;
                }
                decodeStartPtr = currentBytePtr + 1;
              }
            }
          } else {
            var a = new Array(length);
            for (var i = 0; i < length; ++i) {
              a[i] = String.fromCharCode(HEAPU8[value + 4 + i]);
            }
            str = a.join("");
          }
          _free(value);
          return str;
        }, "toWireType": function(destructors, value) {
          if (value instanceof ArrayBuffer) {
            value = new Uint8Array(value);
          }
          var getLength;
          var valueIsOfTypeString = typeof value === "string";
          if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
            throwBindingError("Cannot pass non-string to std::string");
          }
          if (stdStringIsUTF8 && valueIsOfTypeString) {
            getLength = () => lengthBytesUTF8(value);
          } else {
            getLength = () => value.length;
          }
          var length = getLength();
          var ptr = _malloc(4 + length + 1);
          HEAPU32[ptr >> 2] = length;
          if (stdStringIsUTF8 && valueIsOfTypeString) {
            stringToUTF8(value, ptr + 4, length + 1);
          } else {
            if (valueIsOfTypeString) {
              for (var i = 0; i < length; ++i) {
                var charCode = value.charCodeAt(i);
                if (charCode > 255) {
                  _free(ptr);
                  throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
                }
                HEAPU8[ptr + 4 + i] = charCode;
              }
            } else {
              for (var i = 0; i < length; ++i) {
                HEAPU8[ptr + 4 + i] = value[i];
              }
            }
          }
          if (destructors !== null) {
            destructors.push(_free, ptr);
          }
          return ptr;
        }, "argPackAdvance": 8, "readValueFromPointer": simpleReadValueFromPointer, destructorFunction: function(ptr) {
          _free(ptr);
        } });
      }
      function __embind_register_std_wstring(rawType, charSize, name) {
        name = readLatin1String(name);
        var decodeString, encodeString, getHeap, lengthBytesUTF, shift;
        if (charSize === 2) {
          decodeString = UTF16ToString;
          encodeString = stringToUTF16;
          lengthBytesUTF = lengthBytesUTF16;
          getHeap = () => HEAPU16;
          shift = 1;
        } else if (charSize === 4) {
          decodeString = UTF32ToString;
          encodeString = stringToUTF32;
          lengthBytesUTF = lengthBytesUTF32;
          getHeap = () => HEAPU32;
          shift = 2;
        }
        registerType(rawType, { name, "fromWireType": function(value) {
          var length = HEAPU32[value >> 2];
          var HEAP = getHeap();
          var str;
          var decodeStartPtr = value + 4;
          for (var i = 0; i <= length; ++i) {
            var currentBytePtr = value + 4 + i * charSize;
            if (i == length || HEAP[currentBytePtr >> shift] == 0) {
              var maxReadBytes = currentBytePtr - decodeStartPtr;
              var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
              if (str === void 0) {
                str = stringSegment;
              } else {
                str += String.fromCharCode(0);
                str += stringSegment;
              }
              decodeStartPtr = currentBytePtr + charSize;
            }
          }
          _free(value);
          return str;
        }, "toWireType": function(destructors, value) {
          if (!(typeof value === "string")) {
            throwBindingError("Cannot pass non-string to C++ string type " + name);
          }
          var length = lengthBytesUTF(value);
          var ptr = _malloc(4 + length + charSize);
          HEAPU32[ptr >> 2] = length >> shift;
          encodeString(value, ptr + 4, length + charSize);
          if (destructors !== null) {
            destructors.push(_free, ptr);
          }
          return ptr;
        }, "argPackAdvance": 8, "readValueFromPointer": simpleReadValueFromPointer, destructorFunction: function(ptr) {
          _free(ptr);
        } });
      }
      function __embind_register_void(rawType, name) {
        name = readLatin1String(name);
        registerType(rawType, { isVoid: true, name, "argPackAdvance": 0, "fromWireType": function() {
          return void 0;
        }, "toWireType": function(destructors, o) {
          return void 0;
        } });
      }
      function __emval_as(handle, returnType, destructorsRef) {
        handle = Emval.toValue(handle);
        returnType = requireRegisteredType(returnType, "emval::as");
        var destructors = [];
        var rd = Emval.toHandle(destructors);
        HEAP32[destructorsRef >> 2] = rd;
        return returnType["toWireType"](destructors, handle);
      }
      function __emval_as_uint64(handle, returnType, destructorsRef) {
        handle = Emval.toValue(handle);
        returnType = requireRegisteredType(returnType, "emval::as");
        return returnType["toWireType"](null, handle);
      }
      function __emval_equals(first, second) {
        first = Emval.toValue(first);
        second = Emval.toValue(second);
        return first == second;
      }
      function __emval_get_property(handle, key) {
        handle = Emval.toValue(handle);
        key = Emval.toValue(key);
        return Emval.toHandle(handle[key]);
      }
      function __emval_incref(handle) {
        if (handle > 4) {
          emval_handle_array[handle].refcount += 1;
        }
      }
      function __emval_new_array() {
        return Emval.toHandle([]);
      }
      var emval_symbols = {};
      function getStringOrSymbol(address) {
        var symbol = emval_symbols[address];
        if (symbol === void 0) {
          return readLatin1String(address);
        } else {
          return symbol;
        }
      }
      function __emval_new_cstring(v) {
        return Emval.toHandle(getStringOrSymbol(v));
      }
      function __emval_new_object() {
        return Emval.toHandle({});
      }
      function __emval_run_destructors(handle) {
        var destructors = Emval.toValue(handle);
        runDestructors(destructors);
        __emval_decref(handle);
      }
      function __emval_set_property(handle, key, value) {
        handle = Emval.toValue(handle);
        key = Emval.toValue(key);
        value = Emval.toValue(value);
        handle[key] = value;
      }
      function __emval_take_value(type, argv) {
        type = requireRegisteredType(type, "_emval_take_value");
        var v = type["readValueFromPointer"](argv);
        return Emval.toHandle(v);
      }
      function __gmtime_js(time, tmPtr) {
        var date = new Date(HEAP32[time >> 2] * 1e3);
        HEAP32[tmPtr >> 2] = date.getUTCSeconds();
        HEAP32[tmPtr + 4 >> 2] = date.getUTCMinutes();
        HEAP32[tmPtr + 8 >> 2] = date.getUTCHours();
        HEAP32[tmPtr + 12 >> 2] = date.getUTCDate();
        HEAP32[tmPtr + 16 >> 2] = date.getUTCMonth();
        HEAP32[tmPtr + 20 >> 2] = date.getUTCFullYear() - 1900;
        HEAP32[tmPtr + 24 >> 2] = date.getUTCDay();
        var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
        var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
        HEAP32[tmPtr + 28 >> 2] = yday;
      }
      function _abort() {
        abort("");
      }
      var _emscripten_get_now;
      _emscripten_get_now = () => performance.now();
      function _emscripten_memcpy_big(dest, src, num) {
        HEAPU8.copyWithin(dest, src, src + num);
      }
      function emscripten_realloc_buffer(size) {
        try {
          wasmMemory.grow(size - buffer.byteLength + 65535 >>> 16);
          updateGlobalBufferAndViews(wasmMemory.buffer);
          return 1;
        } catch (e) {
        }
      }
      function _emscripten_resize_heap(requestedSize) {
        var oldSize = HEAPU8.length;
        requestedSize = requestedSize >>> 0;
        var maxHeapSize = 2147483648;
        if (requestedSize > maxHeapSize) {
          return false;
        }
        for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
          var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
          overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
          var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
          var replacement = emscripten_realloc_buffer(newSize);
          if (replacement) {
            return true;
          }
        }
        return false;
      }
      var ENV = {};
      function getExecutableName() {
        return thisProgram || "./this.program";
      }
      function getEnvStrings() {
        if (!getEnvStrings.strings) {
          var lang = (typeof navigator === "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
          var env = { "USER": "web_user", "LOGNAME": "web_user", "PATH": "/", "PWD": "/", "HOME": "/home/web_user", "LANG": lang, "_": getExecutableName() };
          for (var x in ENV) {
            if (ENV[x] === void 0)
              delete env[x];
            else
              env[x] = ENV[x];
          }
          var strings = [];
          for (var x in env) {
            strings.push(x + "=" + env[x]);
          }
          getEnvStrings.strings = strings;
        }
        return getEnvStrings.strings;
      }
      function _environ_get(__environ, environ_buf) {
        var bufSize = 0;
        getEnvStrings().forEach(function(string, i) {
          var ptr = environ_buf + bufSize;
          HEAP32[__environ + i * 4 >> 2] = ptr;
          writeAsciiToMemory(string, ptr);
          bufSize += string.length + 1;
        });
        return 0;
      }
      function _environ_sizes_get(penviron_count, penviron_buf_size) {
        var strings = getEnvStrings();
        HEAP32[penviron_count >> 2] = strings.length;
        var bufSize = 0;
        strings.forEach(function(string) {
          bufSize += string.length + 1;
        });
        HEAP32[penviron_buf_size >> 2] = bufSize;
        return 0;
      }
      function _exit(status) {
        exit(status);
      }
      function _fd_close(fd) {
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          FS2.close(stream);
          return 0;
        } catch (e) {
          if (typeof FS2 === "undefined" || !(e instanceof FS2.ErrnoError))
            throw e;
          return e.errno;
        }
      }
      function _fd_pread(fd, iov, iovcnt, offset_bigint, pnum) {
        try {
          var offset_low = Number(offset_bigint & BigInt(4294967295)) | 0, offset_high = Number(offset_bigint >> BigInt(32)) | 0;
          var stream = SYSCALLS.getStreamFromFD(fd);
          var num = SYSCALLS.doReadv(stream, iov, iovcnt, offset_low);
          HEAP32[pnum >> 2] = num;
          return 0;
        } catch (e) {
          if (typeof FS2 === "undefined" || !(e instanceof FS2.ErrnoError))
            throw e;
          return e.errno;
        }
      }
      function _fd_pwrite(fd, iov, iovcnt, offset_bigint, pnum) {
        try {
          var offset_low = Number(offset_bigint & BigInt(4294967295)) | 0, offset_high = Number(offset_bigint >> BigInt(32)) | 0;
          var stream = SYSCALLS.getStreamFromFD(fd);
          var num = SYSCALLS.doWritev(stream, iov, iovcnt, offset_low);
          HEAP32[pnum >> 2] = num;
          return 0;
        } catch (e) {
          if (typeof FS2 === "undefined" || !(e instanceof FS2.ErrnoError))
            throw e;
          return e.errno;
        }
      }
      function _fd_read(fd, iov, iovcnt, pnum) {
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          var num = SYSCALLS.doReadv(stream, iov, iovcnt);
          HEAP32[pnum >> 2] = num;
          return 0;
        } catch (e) {
          if (typeof FS2 === "undefined" || !(e instanceof FS2.ErrnoError))
            throw e;
          return e.errno;
        }
      }
      function _fd_seek(fd, offset_bigint, whence, newOffset) {
        try {
          var offset_low = Number(offset_bigint & BigInt(4294967295)) | 0, offset_high = Number(offset_bigint >> BigInt(32)) | 0;
          var stream = SYSCALLS.getStreamFromFD(fd);
          var HIGH_OFFSET = 4294967296;
          var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
          var DOUBLE_LIMIT = 9007199254740992;
          if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
            return -61;
          }
          FS2.llseek(stream, offset, whence);
          HEAP64[newOffset >> 3] = BigInt(stream.position);
          if (stream.getdents && offset === 0 && whence === 0)
            stream.getdents = null;
          return 0;
        } catch (e) {
          if (typeof FS2 === "undefined" || !(e instanceof FS2.ErrnoError))
            throw e;
          return e.errno;
        }
      }
      function _fd_write(fd, iov, iovcnt, pnum) {
        try {
          var stream = SYSCALLS.getStreamFromFD(fd);
          var num = SYSCALLS.doWritev(stream, iov, iovcnt);
          HEAP32[pnum >> 2] = num;
          return 0;
        } catch (e) {
          if (typeof FS2 === "undefined" || !(e instanceof FS2.ErrnoError))
            throw e;
          return e.errno;
        }
      }
      function _gettimeofday(ptr) {
        var now = Date.now();
        HEAP32[ptr >> 2] = now / 1e3 | 0;
        HEAP32[ptr + 4 >> 2] = now % 1e3 * 1e3 | 0;
        return 0;
      }
      function _mktime(tmPtr) {
        _tzset();
        var date = new Date(HEAP32[tmPtr + 20 >> 2] + 1900, HEAP32[tmPtr + 16 >> 2], HEAP32[tmPtr + 12 >> 2], HEAP32[tmPtr + 8 >> 2], HEAP32[tmPtr + 4 >> 2], HEAP32[tmPtr >> 2], 0);
        var dst = HEAP32[tmPtr + 32 >> 2];
        var guessedOffset = date.getTimezoneOffset();
        var start = new Date(date.getFullYear(), 0, 1);
        var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
        var winterOffset = start.getTimezoneOffset();
        var dstOffset = Math.min(winterOffset, summerOffset);
        if (dst < 0) {
          HEAP32[tmPtr + 32 >> 2] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
        } else if (dst > 0 != (dstOffset == guessedOffset)) {
          var nonDstOffset = Math.max(winterOffset, summerOffset);
          var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
          date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
        }
        HEAP32[tmPtr + 24 >> 2] = date.getDay();
        var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
        HEAP32[tmPtr + 28 >> 2] = yday;
        HEAP32[tmPtr >> 2] = date.getSeconds();
        HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
        HEAP32[tmPtr + 8 >> 2] = date.getHours();
        HEAP32[tmPtr + 12 >> 2] = date.getDate();
        HEAP32[tmPtr + 16 >> 2] = date.getMonth();
        return date.getTime() / 1e3 | 0;
      }
      function __isLeapYear(year) {
        return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
      }
      function __arraySum(array, index) {
        var sum = 0;
        for (var i = 0; i <= index; sum += array[i++]) {
        }
        return sum;
      }
      var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      function __addDays(date, days) {
        var newDate = new Date(date.getTime());
        while (days > 0) {
          var leap = __isLeapYear(newDate.getFullYear());
          var currentMonth = newDate.getMonth();
          var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
          if (days > daysInCurrentMonth - newDate.getDate()) {
            days -= daysInCurrentMonth - newDate.getDate() + 1;
            newDate.setDate(1);
            if (currentMonth < 11) {
              newDate.setMonth(currentMonth + 1);
            } else {
              newDate.setMonth(0);
              newDate.setFullYear(newDate.getFullYear() + 1);
            }
          } else {
            newDate.setDate(newDate.getDate() + days);
            return newDate;
          }
        }
        return newDate;
      }
      function _strftime(s, maxsize, format, tm) {
        var tm_zone = HEAP32[tm + 40 >> 2];
        var date = { tm_sec: HEAP32[tm >> 2], tm_min: HEAP32[tm + 4 >> 2], tm_hour: HEAP32[tm + 8 >> 2], tm_mday: HEAP32[tm + 12 >> 2], tm_mon: HEAP32[tm + 16 >> 2], tm_year: HEAP32[tm + 20 >> 2], tm_wday: HEAP32[tm + 24 >> 2], tm_yday: HEAP32[tm + 28 >> 2], tm_isdst: HEAP32[tm + 32 >> 2], tm_gmtoff: HEAP32[tm + 36 >> 2], tm_zone: tm_zone ? UTF8ToString(tm_zone) : "" };
        var pattern = UTF8ToString(format);
        var EXPANSION_RULES_1 = { "%c": "%a %b %d %H:%M:%S %Y", "%D": "%m/%d/%y", "%F": "%Y-%m-%d", "%h": "%b", "%r": "%I:%M:%S %p", "%R": "%H:%M", "%T": "%H:%M:%S", "%x": "%m/%d/%y", "%X": "%H:%M:%S", "%Ec": "%c", "%EC": "%C", "%Ex": "%m/%d/%y", "%EX": "%H:%M:%S", "%Ey": "%y", "%EY": "%Y", "%Od": "%d", "%Oe": "%e", "%OH": "%H", "%OI": "%I", "%Om": "%m", "%OM": "%M", "%OS": "%S", "%Ou": "%u", "%OU": "%U", "%OV": "%V", "%Ow": "%w", "%OW": "%W", "%Oy": "%y" };
        for (var rule in EXPANSION_RULES_1) {
          pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
        }
        var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        function leadingSomething(value, digits, character) {
          var str = typeof value === "number" ? value.toString() : value || "";
          while (str.length < digits) {
            str = character[0] + str;
          }
          return str;
        }
        function leadingNulls(value, digits) {
          return leadingSomething(value, digits, "0");
        }
        function compareByDay(date1, date2) {
          function sgn(value) {
            return value < 0 ? -1 : value > 0 ? 1 : 0;
          }
          var compare;
          if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
            if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
              compare = sgn(date1.getDate() - date2.getDate());
            }
          }
          return compare;
        }
        function getFirstWeekStartDate(janFourth) {
          switch (janFourth.getDay()) {
            case 0:
              return new Date(janFourth.getFullYear() - 1, 11, 29);
            case 1:
              return janFourth;
            case 2:
              return new Date(janFourth.getFullYear(), 0, 3);
            case 3:
              return new Date(janFourth.getFullYear(), 0, 2);
            case 4:
              return new Date(janFourth.getFullYear(), 0, 1);
            case 5:
              return new Date(janFourth.getFullYear() - 1, 11, 31);
            case 6:
              return new Date(janFourth.getFullYear() - 1, 11, 30);
          }
        }
        function getWeekBasedYear(date2) {
          var thisDate = __addDays(new Date(date2.tm_year + 1900, 0, 1), date2.tm_yday);
          var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
          var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
          if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
            if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
              return thisDate.getFullYear() + 1;
            } else {
              return thisDate.getFullYear();
            }
          } else {
            return thisDate.getFullYear() - 1;
          }
        }
        var EXPANSION_RULES_2 = { "%a": function(date2) {
          return WEEKDAYS[date2.tm_wday].substring(0, 3);
        }, "%A": function(date2) {
          return WEEKDAYS[date2.tm_wday];
        }, "%b": function(date2) {
          return MONTHS[date2.tm_mon].substring(0, 3);
        }, "%B": function(date2) {
          return MONTHS[date2.tm_mon];
        }, "%C": function(date2) {
          var year = date2.tm_year + 1900;
          return leadingNulls(year / 100 | 0, 2);
        }, "%d": function(date2) {
          return leadingNulls(date2.tm_mday, 2);
        }, "%e": function(date2) {
          return leadingSomething(date2.tm_mday, 2, " ");
        }, "%g": function(date2) {
          return getWeekBasedYear(date2).toString().substring(2);
        }, "%G": function(date2) {
          return getWeekBasedYear(date2);
        }, "%H": function(date2) {
          return leadingNulls(date2.tm_hour, 2);
        }, "%I": function(date2) {
          var twelveHour = date2.tm_hour;
          if (twelveHour == 0)
            twelveHour = 12;
          else if (twelveHour > 12)
            twelveHour -= 12;
          return leadingNulls(twelveHour, 2);
        }, "%j": function(date2) {
          return leadingNulls(date2.tm_mday + __arraySum(__isLeapYear(date2.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date2.tm_mon - 1), 3);
        }, "%m": function(date2) {
          return leadingNulls(date2.tm_mon + 1, 2);
        }, "%M": function(date2) {
          return leadingNulls(date2.tm_min, 2);
        }, "%n": function() {
          return "\n";
        }, "%p": function(date2) {
          if (date2.tm_hour >= 0 && date2.tm_hour < 12) {
            return "AM";
          } else {
            return "PM";
          }
        }, "%S": function(date2) {
          return leadingNulls(date2.tm_sec, 2);
        }, "%t": function() {
          return "	";
        }, "%u": function(date2) {
          return date2.tm_wday || 7;
        }, "%U": function(date2) {
          var janFirst = new Date(date2.tm_year + 1900, 0, 1);
          var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7 - janFirst.getDay());
          var endDate = new Date(date2.tm_year + 1900, date2.tm_mon, date2.tm_mday);
          if (compareByDay(firstSunday, endDate) < 0) {
            var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
            var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
            var days = firstSundayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
            return leadingNulls(Math.ceil(days / 7), 2);
          }
          return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00";
        }, "%V": function(date2) {
          var janFourthThisYear = new Date(date2.tm_year + 1900, 0, 4);
          var janFourthNextYear = new Date(date2.tm_year + 1901, 0, 4);
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
          var endDate = __addDays(new Date(date2.tm_year + 1900, 0, 1), date2.tm_yday);
          if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
            return "53";
          }
          if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
            return "01";
          }
          var daysDifference;
          if (firstWeekStartThisYear.getFullYear() < date2.tm_year + 1900) {
            daysDifference = date2.tm_yday + 32 - firstWeekStartThisYear.getDate();
          } else {
            daysDifference = date2.tm_yday + 1 - firstWeekStartThisYear.getDate();
          }
          return leadingNulls(Math.ceil(daysDifference / 7), 2);
        }, "%w": function(date2) {
          return date2.tm_wday;
        }, "%W": function(date2) {
          var janFirst = new Date(date2.tm_year, 0, 1);
          var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1);
          var endDate = new Date(date2.tm_year + 1900, date2.tm_mon, date2.tm_mday);
          if (compareByDay(firstMonday, endDate) < 0) {
            var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
            var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
            var days = firstMondayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
            return leadingNulls(Math.ceil(days / 7), 2);
          }
          return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00";
        }, "%y": function(date2) {
          return (date2.tm_year + 1900).toString().substring(2);
        }, "%Y": function(date2) {
          return date2.tm_year + 1900;
        }, "%z": function(date2) {
          var off = date2.tm_gmtoff;
          var ahead = off >= 0;
          off = Math.abs(off) / 60;
          off = off / 60 * 100 + off % 60;
          return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
        }, "%Z": function(date2) {
          return date2.tm_zone;
        }, "%%": function() {
          return "%";
        } };
        for (var rule in EXPANSION_RULES_2) {
          if (pattern.includes(rule)) {
            pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
          }
        }
        var bytes = intArrayFromString(pattern, false);
        if (bytes.length > maxsize) {
          return 0;
        }
        writeArrayToMemory(bytes, s);
        return bytes.length - 1;
      }
      function _time(ptr) {
        var ret = Date.now() / 1e3 | 0;
        if (ptr) {
          HEAP32[ptr >> 2] = ret;
        }
        return ret;
      }
      var FSNode = function(parent, name, mode, rdev) {
        if (!parent) {
          parent = this;
        }
        this.parent = parent;
        this.mount = parent.mount;
        this.mounted = null;
        this.id = FS2.nextInode++;
        this.name = name;
        this.mode = mode;
        this.node_ops = {};
        this.stream_ops = {};
        this.rdev = rdev;
      };
      var readMode = 292 | 73;
      var writeMode = 146;
      Object.defineProperties(FSNode.prototype, { read: { get: function() {
        return (this.mode & readMode) === readMode;
      }, set: function(val) {
        val ? this.mode |= readMode : this.mode &= ~readMode;
      } }, write: { get: function() {
        return (this.mode & writeMode) === writeMode;
      }, set: function(val) {
        val ? this.mode |= writeMode : this.mode &= ~writeMode;
      } }, isFolder: { get: function() {
        return FS2.isDir(this.mode);
      } }, isDevice: { get: function() {
        return FS2.isChrdev(this.mode);
      } } });
      FS2.FSNode = FSNode;
      FS2.staticInit();
      Module3["FS_createPath"] = FS2.createPath;
      Module3["FS_createDataFile"] = FS2.createDataFile;
      Module3["FS_createPreloadedFile"] = FS2.createPreloadedFile;
      Module3["FS_createLazyFile"] = FS2.createLazyFile;
      Module3["FS_createDevice"] = FS2.createDevice;
      Module3["FS_unlink"] = FS2.unlink;
      embind_init_charCodes();
      BindingError = Module3["BindingError"] = extendError(Error, "BindingError");
      InternalError = Module3["InternalError"] = extendError(Error, "InternalError");
      init_ClassHandle();
      init_RegisteredPointer();
      init_embind();
      UnboundTypeError = Module3["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
      init_emval();
      var ASSERTIONS = false;
      function intArrayFromString(stringy, dontAddNull, length) {
        var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
        var u8array = new Array(len);
        var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
        if (dontAddNull)
          u8array.length = numBytesWritten;
        return u8array;
      }
      function intArrayToString(array) {
        var ret = [];
        for (var i = 0; i < array.length; i++) {
          var chr = array[i];
          if (chr > 255) {
            if (ASSERTIONS) {
              assert(false, "Character code " + chr + " (" + String.fromCharCode(chr) + ")  at offset " + i + " not in 0x00-0xFF.");
            }
            chr &= 255;
          }
          ret.push(String.fromCharCode(chr));
        }
        return ret.join("");
      }
      var decodeBase64 = typeof atob === "function" ? atob : function(input) {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        do {
          enc1 = keyStr.indexOf(input.charAt(i++));
          enc2 = keyStr.indexOf(input.charAt(i++));
          enc3 = keyStr.indexOf(input.charAt(i++));
          enc4 = keyStr.indexOf(input.charAt(i++));
          chr1 = enc1 << 2 | enc2 >> 4;
          chr2 = (enc2 & 15) << 4 | enc3 >> 2;
          chr3 = (enc3 & 3) << 6 | enc4;
          output = output + String.fromCharCode(chr1);
          if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2);
          }
          if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3);
          }
        } while (i < input.length);
        return output;
      };
      function intArrayFromBase64(s) {
        try {
          var decoded = decodeBase64(s);
          var bytes = new Uint8Array(decoded.length);
          for (var i = 0; i < decoded.length; ++i) {
            bytes[i] = decoded.charCodeAt(i);
          }
          return bytes;
        } catch (_) {
          throw new Error("Converting base64 string to bytes failed.");
        }
      }
      function tryParseAsDataURI(filename) {
        if (!isDataURI(filename)) {
          return;
        }
        return intArrayFromBase64(filename.slice(dataURIPrefix.length));
      }
      var asmLibraryArg = { "ha": ___cxa_allocate_exception, "ga": ___cxa_throw, "L": ___localtime_r, "Y": ___syscall_access, "t": ___syscall_fcntl64, "V": ___syscall_fstat64, "S": ___syscall_fstatat64, "Q": ___syscall_ftruncate64, "P": ___syscall_getcwd, "H": ___syscall_getdents64, "Z": ___syscall_ioctl, "R": ___syscall_lstat64, "q": ___syscall_open, "G": ___syscall_readlink, "T": ___syscall_stat64, "r": __dlopen_js, "X": __dlsym_js, "w": __embind_register_bigint, "aa": __embind_register_bool, "C": __embind_register_class, "x": __embind_register_class_constructor, "h": __embind_register_class_function, "i": __embind_register_class_property, "o": __embind_register_constant, "$": __embind_register_emval, "B": __embind_register_enum, "A": __embind_register_enum_value, "v": __embind_register_float, "c": __embind_register_function, "f": __embind_register_integer, "b": __embind_register_memory_view, "u": __embind_register_std_string, "n": __embind_register_std_wstring, "ba": __embind_register_void, "y": __emval_as, "ea": __emval_as_uint64, "la": __emval_decref, "ia": __emval_equals, "z": __emval_get_property, "D": __emval_incref, "E": __emval_new_array, "fa": __emval_new_cstring, "ka": __emval_new_object, "da": __emval_run_destructors, "d": __emval_set_property, "j": __emval_take_value, "M": __gmtime_js, "l": _abort, "p": _emscripten_get_now, "W": _emscripten_memcpy_big, "F": _emscripten_resize_heap, "N": _environ_get, "O": _environ_sizes_get, "g": _exit, "k": _fd_close, "J": _fd_pread, "I": _fd_pwrite, "s": _fd_read, "K": _fd_seek, "m": _fd_write, "ja": _gettimeofday, "U": _mktime, "ca": _strftime, "e": throw_error, "a": _time, "_": _tzset };
      var asm = createWasm();
      var ___wasm_call_ctors = Module3["___wasm_call_ctors"] = function() {
        return (___wasm_call_ctors = Module3["___wasm_call_ctors"] = Module3["asm"]["na"]).apply(null, arguments);
      };
      var _H5Fcreate = Module3["_H5Fcreate"] = function() {
        return (_H5Fcreate = Module3["_H5Fcreate"] = Module3["asm"]["oa"]).apply(null, arguments);
      };
      var _H5Fopen = Module3["_H5Fopen"] = function() {
        return (_H5Fopen = Module3["_H5Fopen"] = Module3["asm"]["pa"]).apply(null, arguments);
      };
      var _H5Fclose = Module3["_H5Fclose"] = function() {
        return (_H5Fclose = Module3["_H5Fclose"] = Module3["asm"]["qa"]).apply(null, arguments);
      };
      var _malloc = Module3["_malloc"] = function() {
        return (_malloc = Module3["_malloc"] = Module3["asm"]["ra"]).apply(null, arguments);
      };
      var _free = Module3["_free"] = function() {
        return (_free = Module3["_free"] = Module3["asm"]["sa"]).apply(null, arguments);
      };
      var ___errno_location = Module3["___errno_location"] = function() {
        return (___errno_location = Module3["___errno_location"] = Module3["asm"]["ua"]).apply(null, arguments);
      };
      var ___getTypeName = Module3["___getTypeName"] = function() {
        return (___getTypeName = Module3["___getTypeName"] = Module3["asm"]["va"]).apply(null, arguments);
      };
      var ___embind_register_native_and_builtin_types = Module3["___embind_register_native_and_builtin_types"] = function() {
        return (___embind_register_native_and_builtin_types = Module3["___embind_register_native_and_builtin_types"] = Module3["asm"]["wa"]).apply(null, arguments);
      };
      var __get_tzname = Module3["__get_tzname"] = function() {
        return (__get_tzname = Module3["__get_tzname"] = Module3["asm"]["xa"]).apply(null, arguments);
      };
      var __get_daylight = Module3["__get_daylight"] = function() {
        return (__get_daylight = Module3["__get_daylight"] = Module3["asm"]["ya"]).apply(null, arguments);
      };
      var __get_timezone = Module3["__get_timezone"] = function() {
        return (__get_timezone = Module3["__get_timezone"] = Module3["asm"]["za"]).apply(null, arguments);
      };
      var stackSave = Module3["stackSave"] = function() {
        return (stackSave = Module3["stackSave"] = Module3["asm"]["Aa"]).apply(null, arguments);
      };
      var stackRestore = Module3["stackRestore"] = function() {
        return (stackRestore = Module3["stackRestore"] = Module3["asm"]["Ba"]).apply(null, arguments);
      };
      var stackAlloc = Module3["stackAlloc"] = function() {
        return (stackAlloc = Module3["stackAlloc"] = Module3["asm"]["Ca"]).apply(null, arguments);
      };
      Module3["ccall"] = ccall;
      Module3["cwrap"] = cwrap;
      Module3["UTF8ToString"] = UTF8ToString;
      Module3["addRunDependency"] = addRunDependency;
      Module3["removeRunDependency"] = removeRunDependency;
      Module3["FS_createPath"] = FS2.createPath;
      Module3["FS_createDataFile"] = FS2.createDataFile;
      Module3["FS_createPreloadedFile"] = FS2.createPreloadedFile;
      Module3["FS_createLazyFile"] = FS2.createLazyFile;
      Module3["FS_createDevice"] = FS2.createDevice;
      Module3["FS_unlink"] = FS2.unlink;
      Module3["FS"] = FS2;
      Module3["AsciiToString"] = AsciiToString;
      var calledRun;
      function ExitStatus(status) {
        this.name = "ExitStatus";
        this.message = "Program terminated with exit(" + status + ")";
        this.status = status;
      }
      dependenciesFulfilled = function runCaller() {
        if (!calledRun)
          run();
        if (!calledRun)
          dependenciesFulfilled = runCaller;
      };
      function run(args) {
        args = args || arguments_;
        if (runDependencies > 0) {
          return;
        }
        preRun();
        if (runDependencies > 0) {
          return;
        }
        function doRun() {
          if (calledRun)
            return;
          calledRun = true;
          Module3["calledRun"] = true;
          if (ABORT)
            return;
          initRuntime();
          readyPromiseResolve(Module3);
          if (Module3["onRuntimeInitialized"])
            Module3["onRuntimeInitialized"]();
          postRun();
        }
        if (Module3["setStatus"]) {
          Module3["setStatus"]("Running...");
          setTimeout(function() {
            setTimeout(function() {
              Module3["setStatus"]("");
            }, 1);
            doRun();
          }, 1);
        } else {
          doRun();
        }
      }
      Module3["run"] = run;
      function exit(status, implicit) {
        EXITSTATUS = status;
        if (keepRuntimeAlive()) {
        } else {
          exitRuntime();
        }
        procExit(status);
      }
      function procExit(code) {
        EXITSTATUS = code;
        if (!keepRuntimeAlive()) {
          if (Module3["onExit"])
            Module3["onExit"](code);
          ABORT = true;
        }
        quit_(code, new ExitStatus(code));
      }
      if (Module3["preInit"]) {
        if (typeof Module3["preInit"] == "function")
          Module3["preInit"] = [Module3["preInit"]];
        while (Module3["preInit"].length > 0) {
          Module3["preInit"].pop()();
        }
      }
      run();
      return Module3.ready;
    };
  })();
  var hdf5_util_default = Module;

  // node_modules/h5wasm/dist/esm/hdf5_hl.js
  var Module2;
  var FS = null;
  var ready = hdf5_util_default({ noInitialRun: true }).then((result) => {
    Module2 = result;
    FS = Module2.FS;
    return Module2;
  });
  var ACCESS_MODES = {
    "r": "H5F_ACC_RDONLY",
    "a": "H5F_ACC_RDWR",
    "w": "H5F_ACC_TRUNC",
    "x": "H5F_ACC_EXCL",
    "c": "H5F_ACC_CREAT",
    "Sw": "H5F_ACC_SWMR_WRITE",
    "Sr": "H5F_ACC_SWMR_READ"
  };
  function normalizePath(path) {
    if (path == "/") {
      return path;
    }
    path = path.replace(/\/(\/)+/g, "/");
    path = path.replace(/(\/)+$/, "");
    return path;
  }
  function get_attr(file_id, obj_name, attr_name) {
    let metadata = Module2.get_attribute_metadata(file_id, obj_name, attr_name);
    let nbytes = metadata.size * metadata.total_size;
    let data_ptr = Module2._malloc(nbytes);
    var processed;
    try {
      Module2.get_attribute_data(file_id, obj_name, attr_name, BigInt(data_ptr));
      let data = Module2.HEAPU8.slice(data_ptr, data_ptr + nbytes);
      processed = process_data(data, metadata);
    } finally {
      if (metadata.vlen) {
        Module2.reclaim_vlen_memory(file_id, obj_name, attr_name, BigInt(data_ptr));
      }
      Module2._free(data_ptr);
    }
    return processed;
  }
  function getAccessor(type, size, signed) {
    if (type === 0) {
      if (size === 8) {
        return signed ? BigInt64Array : BigUint64Array;
      } else if (size === 4) {
        return signed ? Int32Array : Uint32Array;
      } else if (size === 2) {
        return signed ? Int16Array : Uint16Array;
      } else {
        return signed ? Int8Array : Uint8Array;
      }
    } else {
      if (size === 8) {
        return Float64Array;
      } else if (size === 4) {
        return Float32Array;
      } else {
        throw new Error(`Float${size * 8} not supported`);
      }
    }
  }
  function process_data(data, metadata) {
    let output_data;
    let { shape, type } = metadata;
    let known_type = true;
    if (type === Module2.H5T_class_t.H5T_STRING.value) {
      if (metadata.vlen) {
        let output = [];
        let reader = metadata.cset == 1 ? Module2.UTF8ToString : Module2.AsciiToString;
        let ptrs = new Uint32Array(data.buffer);
        for (let ptr of ptrs) {
          output.push(reader(ptr));
        }
        output_data = output;
      } else {
        let encoding = metadata.cset == 1 ? "utf-8" : "ascii";
        let decoder = new TextDecoder(encoding);
        let size = metadata.size;
        let n = Math.floor(data.byteLength / size);
        let output = [];
        for (let i = 0; i < n; i++) {
          let bytes = data.slice(i * size, (i + 1) * size);
          const zero_match = bytes.findIndex((b) => b === 0);
          if (zero_match > -1) {
            bytes = bytes.slice(0, zero_match);
          }
          output.push(decoder.decode(bytes));
        }
        output_data = output;
      }
    } else if (type === Module2.H5T_class_t.H5T_INTEGER.value || type === Module2.H5T_class_t.H5T_FLOAT.value) {
      const { size, signed } = metadata;
      const accessor = getAccessor(type, size, signed);
      output_data = new accessor(data.buffer);
    } else if (type === Module2.H5T_class_t.H5T_COMPOUND.value) {
      const { size, compound_type } = metadata;
      let n = Math.floor(data.byteLength / size);
      let output = [];
      for (let i = 0; i < n; i++) {
        let row = [];
        let row_data = data.slice(i * size, (i + 1) * size);
        for (let member of compound_type.members) {
          let member_data = row_data.slice(member.offset, member.offset + member.size);
          row.push(process_data(member_data, member));
        }
        output.push(row);
      }
      output_data = output;
    } else if (type === Module2.H5T_class_t.H5T_ARRAY.value) {
      const { array_type } = metadata;
      shape = shape.concat(array_type.dims);
      array_type.shape = shape;
      output_data = process_data(data, array_type);
    } else {
      known_type = false;
      output_data = data;
    }
    if (known_type && (Array.isArray(output_data) || ArrayBuffer.isView(output_data)) && !shape?.length) {
      return output_data[0];
    }
    return output_data;
  }
  function prepare_data(data, metadata, shape) {
    let final_shape;
    if (shape === void 0 || shape === null) {
      if (data != null && data.length != null && !(typeof data === "string")) {
        final_shape = [data.length];
      } else {
        final_shape = [];
      }
    } else {
      final_shape = shape;
    }
    data = Array.isArray(data) || ArrayBuffer.isView(data) ? data : [data];
    let total_size = final_shape.reduce((previous, current) => current * previous, 1);
    if (data.length != total_size) {
      throw `Error: shape ${final_shape} does not match number of elements in data`;
    }
    let output;
    if (metadata.type === Module2.H5T_class_t.H5T_STRING.value) {
      if (!metadata.vlen) {
        output = new Uint8Array(total_size * metadata.size);
        let encoder = new TextEncoder();
        output.fill(0);
        let offset = 0;
        for (let s of data) {
          let encoded = encoder.encode(s);
          output.set(encoded.slice(0, metadata.size), offset);
          offset += metadata.size;
        }
      } else {
        output = data;
      }
    } else if (metadata.type === Module2.H5T_class_t.H5T_INTEGER.value || metadata.type === Module2.H5T_class_t.H5T_FLOAT.value) {
      const { type, size, signed } = metadata;
      const accessor = getAccessor(type, size, signed);
      let typed_array;
      if (data instanceof accessor) {
        typed_array = data;
      } else {
        if (metadata.size > 4) {
          data = data.map(BigInt);
        }
        typed_array = new accessor(data);
      }
      output = new Uint8Array(typed_array.buffer);
    } else {
      throw new Error(`data with type ${metadata.type} can not be prepared for write`);
    }
    return { data: output, shape: final_shape };
  }
  function map_reverse(map) {
    return new Map(Array.from(map.entries()).map(([k, v]) => [v, k]));
  }
  var int_fmts = /* @__PURE__ */ new Map([[1, "b"], [2, "h"], [4, "i"], [8, "q"]]);
  var float_fmts = /* @__PURE__ */ new Map([[2, "e"], [4, "f"], [8, "d"]]);
  var fmts_float = map_reverse(float_fmts);
  var fmts_int = map_reverse(int_fmts);
  function metadata_to_dtype(metadata) {
    const { type, size, littleEndian, signed, compound_type, array_type, vlen } = metadata;
    if (type == Module2.H5T_class_t.H5T_STRING.value) {
      let length_str = vlen ? "" : String(size);
      return `S${length_str}`;
    } else if (type == Module2.H5T_class_t.H5T_INTEGER.value) {
      let fmt = int_fmts.get(size);
      if (fmt === void 0) {
        throw new Error(`int of size ${size} unsupported`);
      }
      if (!signed) {
        fmt = fmt.toUpperCase();
      }
      return (littleEndian ? "<" : ">") + fmt;
    } else if (type == Module2.H5T_class_t.H5T_FLOAT.value) {
      let fmt = float_fmts.get(size);
      return (littleEndian ? "<" : ">") + fmt;
    } else if (type == Module2.H5T_class_t.H5T_COMPOUND.value) {
      return { compound_type };
    } else if (type === Module2.H5T_class_t.H5T_ARRAY.value) {
      return { array_type };
    } else {
      return "unknown";
    }
  }
  function dtype_to_metadata(dtype_str) {
    let match = dtype_str.match(/^([<>|]?)([bhiqefdsBHIQS])([0-9]*)$/);
    if (match == null) {
      throw dtype_str + " is not a recognized dtype";
    }
    let [full, endianness, typestr, length] = match;
    let metadata = { vlen: false, signed: false };
    metadata.littleEndian = endianness != ">";
    if (fmts_int.has(typestr.toLowerCase())) {
      metadata.type = Module2.H5T_class_t.H5T_INTEGER.value;
      metadata.size = fmts_int.get(typestr.toLowerCase());
      metadata.signed = typestr.toLowerCase() == typestr;
    } else if (fmts_float.has(typestr)) {
      metadata.type = Module2.H5T_class_t.H5T_FLOAT.value;
      metadata.size = fmts_float.get(typestr);
    } else if (typestr.toUpperCase() == "S") {
      metadata.type = Module2.H5T_class_t.H5T_STRING.value;
      metadata.size = length == "" ? 4 : parseInt(length, 10);
      metadata.vlen = length == "";
    } else {
      throw "should never happen";
    }
    return metadata;
  }
  var TypedArray_to_dtype = /* @__PURE__ */ new Map([
    ["Uint8Array", "<B"],
    ["Uint16Array", "<H"],
    ["Uint32Array", "<I"],
    ["BigUint64Array", "<Q"],
    ["Int8Array", "<b"],
    ["Int16Array", "<h"],
    ["Int32Array", "<i"],
    ["BigInt64Array", "<q"],
    ["Float32Array", "<f"],
    ["Float64Array", "<d"]
  ]);
  function guess_dtype(data) {
    if (ArrayBuffer.isView(data)) {
      const dtype = TypedArray_to_dtype.get(data.constructor.name);
      if (dtype === void 0) {
        throw new Error("DataView not supported directly for write");
      }
      return dtype;
    } else {
      const arr_data = Array.isArray(data) ? data : [data];
      if (arr_data.every(Number.isInteger)) {
        return "<i";
      } else if (arr_data.every((d) => typeof d == "number")) {
        return "<d";
      } else if (arr_data.every((d) => typeof d == "string")) {
        return "S";
      }
    }
    throw new Error("unguessable type for data");
  }
  var OBJECT_TYPE;
  (function(OBJECT_TYPE2) {
    OBJECT_TYPE2["DATASET"] = "Dataset";
    OBJECT_TYPE2["GROUP"] = "Group";
    OBJECT_TYPE2["BROKEN_SOFT_LINK"] = "BrokenSoftLink";
    OBJECT_TYPE2["EXTERNAL_LINK"] = "ExternalLink";
  })(OBJECT_TYPE || (OBJECT_TYPE = {}));
  var BrokenSoftLink = class {
    constructor(target) {
      this.type = OBJECT_TYPE.BROKEN_SOFT_LINK;
      this.target = target;
    }
  };
  var ExternalLink = class {
    constructor(filename, obj_path) {
      this.type = OBJECT_TYPE.EXTERNAL_LINK;
      this.filename = filename;
      this.obj_path = obj_path;
    }
  };
  var HasAttrs = class {
    get attrs() {
      let attr_names = Module2.get_attribute_names(this.file_id, this.path);
      let attrs = {};
      for (let name of attr_names) {
        let metadata = Module2.get_attribute_metadata(this.file_id, this.path, name);
        Object.defineProperty(attrs, name, {
          get: () => ({
            value: get_attr(this.file_id, this.path, name),
            shape: metadata.shape,
            dtype: metadata_to_dtype(metadata),
            metadata
          }),
          enumerable: true
        });
      }
      return attrs;
    }
    get_attribute(name) {
      get_attr(this.file_id, this.path, name);
    }
    create_attribute(name, data, shape, dtype) {
      const final_dtype = dtype ?? guess_dtype(data);
      let metadata = dtype_to_metadata(final_dtype);
      let { data: prepared_data, shape: guessed_shape } = prepare_data(data, metadata, shape);
      const final_shape = shape ?? guessed_shape;
      if (metadata.vlen) {
        Module2.create_vlen_str_attribute(this.file_id, this.path, name, prepared_data, final_shape.map(BigInt), metadata.type, metadata.size, metadata.signed, metadata.vlen);
      } else {
        let data_ptr = Module2._malloc(prepared_data.byteLength);
        try {
          Module2.HEAPU8.set(prepared_data, data_ptr);
          Module2.create_attribute(this.file_id, this.path, name, BigInt(data_ptr), final_shape.map(BigInt), metadata.type, metadata.size, metadata.signed, metadata.vlen);
        } finally {
          Module2._free(data_ptr);
        }
      }
    }
  };
  var Group = class extends HasAttrs {
    constructor(file_id, path) {
      super();
      this.path = path;
      this.file_id = file_id;
      this.type = OBJECT_TYPE.GROUP;
    }
    keys() {
      return Module2.get_names(this.file_id, this.path);
    }
    *values() {
      for (let name of this.keys()) {
        yield this.get(name);
      }
      return;
    }
    *items() {
      for (let name of this.keys()) {
        yield [name, this.get(name)];
      }
      return;
    }
    get_type(obj_path) {
      return Module2.get_type(this.file_id, obj_path);
    }
    get_link(obj_path) {
      return Module2.get_symbolic_link(this.file_id, obj_path);
    }
    get_external_link(obj_path) {
      return Module2.get_external_link(this.file_id, obj_path);
    }
    get(obj_name) {
      let fullpath = /^\//.test(obj_name) ? obj_name : this.path + "/" + obj_name;
      fullpath = normalizePath(fullpath);
      let type = this.get_type(fullpath);
      if (type === Module2.H5G_GROUP) {
        return new Group(this.file_id, fullpath);
      } else if (type === Module2.H5G_DATASET) {
        return new Dataset(this.file_id, fullpath);
      } else if (type === Module2.H5G_LINK) {
        let target = this.get_link(fullpath);
        return new BrokenSoftLink(target);
      } else if (type === Module2.H5G_UDLINK) {
        let { filename, obj_path } = this.get_external_link(fullpath);
        return new ExternalLink(filename, obj_path);
      }
      return null;
    }
    create_group(name) {
      Module2.create_group(this.file_id, this.path + "/" + name);
      return this.get(name);
    }
    create_dataset(name, data, shape, dtype) {
      const final_dtype = dtype ?? guess_dtype(data);
      let metadata = dtype_to_metadata(final_dtype);
      let { data: prepared_data, shape: guessed_shape } = prepare_data(data, metadata, shape);
      const final_shape = shape ?? guessed_shape;
      if (metadata.vlen) {
        Module2.create_vlen_str_dataset(this.file_id, this.path + "/" + name, prepared_data, final_shape.map(BigInt), metadata.type, metadata.size, metadata.signed, metadata.vlen);
      } else {
        let data_ptr = Module2._malloc(prepared_data.byteLength);
        try {
          Module2.HEAPU8.set(prepared_data, data_ptr);
          Module2.create_dataset(this.file_id, this.path + "/" + name, BigInt(data_ptr), final_shape.map(BigInt), metadata.type, metadata.size, metadata.signed, metadata.vlen);
        } finally {
          Module2._free(data_ptr);
        }
      }
      return this.get(name);
    }
    toString() {
      return `Group(file_id=${this.file_id}, path=${this.path})`;
    }
  };
  var File = class extends Group {
    constructor(filename, mode = "r") {
      let file_id;
      let access_mode = ACCESS_MODES[mode];
      let h5_mode = Module2[access_mode];
      if (["H5F_ACC_RDWR", "H5F_ACC_RDONLY"].includes(access_mode)) {
        file_id = Module2.ccall("H5Fopen", "bigint", ["string", "number", "bigint"], [filename, h5_mode, 0n]);
      } else {
        file_id = Module2.ccall("H5Fcreate", "bigint", ["string", "number", "bigint", "bigint"], [filename, h5_mode, 0n, 0n]);
      }
      super(file_id, "/");
      this.filename = filename;
      this.mode = mode;
    }
    flush() {
      Module2.flush(this.file_id);
    }
    close() {
      return Module2.ccall("H5Fclose", "number", ["bigint"], [this.file_id]);
    }
  };
  var Dataset = class extends HasAttrs {
    constructor(file_id, path) {
      super();
      this.path = path;
      this.file_id = file_id;
      this.type = OBJECT_TYPE.DATASET;
    }
    get metadata() {
      return Module2.get_dataset_metadata(this.file_id, this.path);
    }
    get dtype() {
      return metadata_to_dtype(this.metadata);
    }
    get shape() {
      return this.metadata.shape;
    }
    get value() {
      let metadata = this.metadata;
      let nbytes = metadata.size * metadata.total_size;
      let data_ptr = Module2._malloc(nbytes);
      var processed;
      try {
        Module2.get_dataset_data(this.file_id, this.path, null, null, BigInt(data_ptr));
        let data = Module2.HEAPU8.slice(data_ptr, data_ptr + nbytes);
        processed = process_data(data, metadata);
      } finally {
        if (metadata.vlen) {
          Module2.reclaim_vlen_memory(this.file_id, this.path, "", BigInt(data_ptr));
        }
        Module2._free(data_ptr);
      }
      return processed;
    }
    slice(ranges) {
      let metadata = this.metadata;
      const { shape } = metadata;
      let ndims = shape.length;
      let count = shape.map((s, i) => BigInt(Math.min(s, ranges?.[i]?.[1] ?? s) - Math.max(0, ranges?.[i]?.[0] ?? 0)));
      let offset = shape.map((s, i) => BigInt(Math.min(s, Math.max(0, ranges?.[i]?.[0] ?? 0))));
      let total_size = count.reduce((previous, current) => current * previous, 1n);
      let nbytes = metadata.size * Number(total_size);
      let data_ptr = Module2._malloc(nbytes);
      var processed;
      try {
        Module2.get_dataset_data(this.file_id, this.path, count, offset, BigInt(data_ptr));
        let data = Module2.HEAPU8.slice(data_ptr, data_ptr + nbytes);
        processed = process_data(data, metadata);
      } finally {
        if (metadata.vlen) {
          Module2.reclaim_vlen_memory(this.file_id, this.path, "", BigInt(data_ptr));
        }
        Module2._free(data_ptr);
      }
      return processed;
    }
  };

  // node_modules/typescript-lru-cache/src/LRUCacheNode.ts
  var LRUCacheNode = class {
    constructor(key, value, options) {
      const {
        entryExpirationTimeInMS = null,
        next = null,
        prev = null,
        onEntryEvicted,
        onEntryMarkedAsMostRecentlyUsed,
        clone,
        cloneFn
      } = options ?? {};
      if (typeof entryExpirationTimeInMS === "number" && (entryExpirationTimeInMS <= 0 || Number.isNaN(entryExpirationTimeInMS))) {
        throw new Error("entryExpirationTimeInMS must either be null (no expiry) or greater than 0");
      }
      this.clone = clone ?? false;
      this.cloneFn = cloneFn ?? this.defaultClone;
      this.key = key;
      this.internalValue = this.clone ? this.cloneFn(value) : value;
      this.created = Date.now();
      this.entryExpirationTimeInMS = entryExpirationTimeInMS;
      this.next = next;
      this.prev = prev;
      this.onEntryEvicted = onEntryEvicted;
      this.onEntryMarkedAsMostRecentlyUsed = onEntryMarkedAsMostRecentlyUsed;
    }
    get value() {
      return this.clone ? this.cloneFn(this.internalValue) : this.internalValue;
    }
    get isExpired() {
      return typeof this.entryExpirationTimeInMS === "number" && Date.now() - this.created > this.entryExpirationTimeInMS;
    }
    invokeOnEvicted() {
      if (this.onEntryEvicted) {
        const { key, value, isExpired } = this;
        this.onEntryEvicted({ key, value, isExpired });
      }
    }
    invokeOnEntryMarkedAsMostRecentlyUsed() {
      if (this.onEntryMarkedAsMostRecentlyUsed) {
        const { key, value } = this;
        this.onEntryMarkedAsMostRecentlyUsed({ key, value });
      }
    }
    defaultClone(value) {
      if (typeof value === "boolean" || typeof value === "string" || typeof value === "number") {
        return value;
      }
      return JSON.parse(JSON.stringify(value));
    }
  };

  // node_modules/typescript-lru-cache/src/LRUCache.ts
  var LRUCache = class {
    constructor(options) {
      this.lookupTable = /* @__PURE__ */ new Map();
      this.head = null;
      this.tail = null;
      const {
        maxSize = 25,
        entryExpirationTimeInMS = null,
        onEntryEvicted,
        onEntryMarkedAsMostRecentlyUsed,
        cloneFn,
        clone
      } = options ?? {};
      if (Number.isNaN(maxSize) || maxSize <= 0) {
        throw new Error("maxSize must be greater than 0.");
      }
      if (typeof entryExpirationTimeInMS === "number" && (entryExpirationTimeInMS <= 0 || Number.isNaN(entryExpirationTimeInMS))) {
        throw new Error("entryExpirationTimeInMS must either be null (no expiry) or greater than 0");
      }
      this.maxSizeInternal = maxSize;
      this.entryExpirationTimeInMS = entryExpirationTimeInMS;
      this.onEntryEvicted = onEntryEvicted;
      this.onEntryMarkedAsMostRecentlyUsed = onEntryMarkedAsMostRecentlyUsed;
      this.clone = clone;
      this.cloneFn = cloneFn;
    }
    get size() {
      return this.lookupTable.size;
    }
    get remainingSize() {
      return this.maxSizeInternal - this.size;
    }
    get newest() {
      if (!this.head) {
        return null;
      }
      return this.mapNodeToEntry(this.head);
    }
    get oldest() {
      if (!this.tail) {
        return null;
      }
      return this.mapNodeToEntry(this.tail);
    }
    get maxSize() {
      return this.maxSizeInternal;
    }
    set maxSize(value) {
      if (Number.isNaN(value) || value <= 0) {
        throw new Error("maxSize must be greater than 0.");
      }
      this.maxSizeInternal = value;
      this.enforceSizeLimit();
    }
    set(key, value, entryOptions) {
      const currentNodeForKey = this.lookupTable.get(key);
      if (currentNodeForKey) {
        this.removeNodeFromListAndLookupTable(currentNodeForKey);
      }
      const node = new LRUCacheNode(key, value, {
        entryExpirationTimeInMS: this.entryExpirationTimeInMS,
        onEntryEvicted: this.onEntryEvicted,
        onEntryMarkedAsMostRecentlyUsed: this.onEntryMarkedAsMostRecentlyUsed,
        clone: this.clone,
        cloneFn: this.cloneFn,
        ...entryOptions
      });
      this.setNodeAsHead(node);
      this.lookupTable.set(key, node);
      this.enforceSizeLimit();
      return this;
    }
    get(key) {
      const node = this.lookupTable.get(key);
      if (!node) {
        return null;
      }
      if (node.isExpired) {
        this.removeNodeFromListAndLookupTable(node);
        return null;
      }
      this.setNodeAsHead(node);
      return node.value;
    }
    peek(key) {
      const node = this.lookupTable.get(key);
      if (!node) {
        return null;
      }
      if (node.isExpired) {
        this.removeNodeFromListAndLookupTable(node);
        return null;
      }
      return node.value;
    }
    delete(key) {
      const node = this.lookupTable.get(key);
      if (!node) {
        return false;
      }
      return this.removeNodeFromListAndLookupTable(node);
    }
    has(key) {
      return this.lookupTable.has(key);
    }
    clear() {
      this.head = null;
      this.tail = null;
      this.lookupTable.clear();
    }
    find(condition) {
      let node = this.head;
      while (node) {
        if (node.isExpired) {
          const next = node.next;
          this.removeNodeFromListAndLookupTable(node);
          node = next;
          continue;
        }
        const entry = this.mapNodeToEntry(node);
        if (condition(entry)) {
          this.setNodeAsHead(node);
          return entry;
        }
        node = node.next;
      }
      return null;
    }
    forEach(callback) {
      let node = this.head;
      let index = 0;
      while (node) {
        if (node.isExpired) {
          const next = node.next;
          this.removeNodeFromListAndLookupTable(node);
          node = next;
          continue;
        }
        callback(node.value, node.key, index);
        node = node.next;
        index++;
      }
    }
    *values() {
      let node = this.head;
      while (node) {
        if (node.isExpired) {
          const next = node.next;
          this.removeNodeFromListAndLookupTable(node);
          node = next;
          continue;
        }
        yield node.value;
        node = node.next;
      }
    }
    *keys() {
      let node = this.head;
      while (node) {
        if (node.isExpired) {
          const next = node.next;
          this.removeNodeFromListAndLookupTable(node);
          node = next;
          continue;
        }
        yield node.key;
        node = node.next;
      }
    }
    *entries() {
      let node = this.head;
      while (node) {
        if (node.isExpired) {
          const next = node.next;
          this.removeNodeFromListAndLookupTable(node);
          node = next;
          continue;
        }
        yield this.mapNodeToEntry(node);
        node = node.next;
      }
    }
    *[Symbol.iterator]() {
      let node = this.head;
      while (node) {
        if (node.isExpired) {
          const next = node.next;
          this.removeNodeFromListAndLookupTable(node);
          node = next;
          continue;
        }
        yield this.mapNodeToEntry(node);
        node = node.next;
      }
    }
    enforceSizeLimit() {
      let node = this.tail;
      while (node !== null && this.size > this.maxSizeInternal) {
        const prev = node.prev;
        this.removeNodeFromListAndLookupTable(node);
        node = prev;
      }
    }
    mapNodeToEntry({ key, value }) {
      return {
        key,
        value
      };
    }
    setNodeAsHead(node) {
      this.removeNodeFromList(node);
      if (!this.head) {
        this.head = node;
        this.tail = node;
      } else {
        node.next = this.head;
        this.head.prev = node;
        this.head = node;
      }
      node.invokeOnEntryMarkedAsMostRecentlyUsed();
    }
    removeNodeFromList(node) {
      if (node.prev !== null) {
        node.prev.next = node.next;
      }
      if (node.next !== null) {
        node.next.prev = node.prev;
      }
      if (this.head === node) {
        this.head = node.next;
      }
      if (this.tail === node) {
        this.tail = node.prev;
      }
      node.next = null;
      node.prev = null;
    }
    removeNodeFromListAndLookupTable(node) {
      node.invokeOnEvicted();
      this.removeNodeFromList(node);
      return this.lookupTable.delete(node.key);
    }
  };

  // src/lazyFileLRU.ts
  var defaultCache = class {
    constructor() {
      this.values = [];
    }
    get(key) {
      return this.values[key];
    }
    set(key, value) {
      this.values[key] = value;
    }
    has(key) {
      return typeof this.values[key] === "undefined";
    }
    get size() {
      return this.values.filter(function(value) {
        return value !== void 0;
      }).length;
    }
  };
  var LazyUint8Array = class {
    constructor(config) {
      this.serverChecked = false;
      this.totalFetchedBytes = 0;
      this.totalRequests = 0;
      this.readPages = [];
      this.readHeads = [];
      this.lastGet = -1;
      var _a, _b;
      this._chunkSize = config.requestChunkSize;
      this.maxSpeed = Math.round((config.maxReadSpeed || 5 * 1024 * 1024) / this._chunkSize);
      this.maxReadHeads = (_a = config.maxReadHeads) != null ? _a : 3;
      this.rangeMapper = config.rangeMapper;
      this.logPageReads = (_b = config.logPageReads) != null ? _b : false;
      if (config.fileLength) {
        this._length = config.fileLength;
      }
      this.requestLimiter = config.requestLimiter == null ? (ignored) => {
      } : config.requestLimiter;
      const LRUSize = config.LRUSize;
      if (LRUSize !== void 0) {
        this.cache = new LRUCache({ maxSize: LRUSize });
      } else {
        this.cache = new defaultCache();
      }
      console.log(this.cache);
    }
    copyInto(buffer, outOffset, length, start) {
      if (start >= this.length)
        return 0;
      length = Math.min(this.length - start, length);
      const end = start + length;
      let i = 0;
      while (i < length) {
        const idx = start + i;
        const chunkOffset = idx % this.chunkSize;
        const chunkNum = idx / this.chunkSize | 0;
        const wantedSize = Math.min(this.chunkSize, end - idx);
        let inChunk = this.getChunk(chunkNum);
        if (chunkOffset !== 0 || wantedSize !== this.chunkSize) {
          inChunk = inChunk.subarray(chunkOffset, chunkOffset + wantedSize);
        }
        buffer.set(inChunk, outOffset + i);
        i += inChunk.length;
      }
      return length;
    }
    moveReadHead(wantedChunkNum) {
      for (const [i, head] of this.readHeads.entries()) {
        const fetchStartChunkNum = head.startChunk + head.speed;
        const newSpeed = Math.min(this.maxSpeed, head.speed * 2);
        const wantedIsInNextFetchOfHead = wantedChunkNum >= fetchStartChunkNum && wantedChunkNum < fetchStartChunkNum + newSpeed;
        if (wantedIsInNextFetchOfHead) {
          head.speed = newSpeed;
          head.startChunk = fetchStartChunkNum;
          if (i !== 0) {
            this.readHeads.splice(i, 1);
            this.readHeads.unshift(head);
          }
          return head;
        }
      }
      const newHead = {
        startChunk: wantedChunkNum,
        speed: 1
      };
      this.readHeads.unshift(newHead);
      while (this.readHeads.length > this.maxReadHeads)
        this.readHeads.pop();
      return newHead;
    }
    getChunk(wantedChunkNum) {
      let wasCached = true;
      console.log(`cache size: ${this.cache.size}`);
      if (!this.cache.has(wantedChunkNum)) {
        wasCached = false;
        const head = this.moveReadHead(wantedChunkNum);
        const chunksToFetch = head.speed;
        console.log(`fetching: ${chunksToFetch} chunks`);
        const startByte = head.startChunk * this.chunkSize;
        let endByte = (head.startChunk + chunksToFetch) * this.chunkSize - 1;
        endByte = Math.min(endByte, this.length - 1);
        const buf = this.doXHR(startByte, endByte);
        for (let i = 0; i < chunksToFetch; i++) {
          const curChunk = head.startChunk + i;
          if (i * this.chunkSize >= buf.byteLength)
            break;
          const curSize = (i + 1) * this.chunkSize > buf.byteLength ? buf.byteLength - i * this.chunkSize : this.chunkSize;
          this.cache.set(curChunk, new Uint8Array(buf, i * this.chunkSize, curSize));
        }
      }
      if (!this.cache.has(wantedChunkNum))
        throw new Error("doXHR failed (bug)!");
      const boring = !this.logPageReads || this.lastGet == wantedChunkNum;
      if (!boring) {
        this.lastGet = wantedChunkNum;
        this.readPages.push({
          pageno: wantedChunkNum,
          wasCached,
          prefetch: wasCached ? 0 : this.readHeads[0].speed - 1
        });
      }
      return this.cache.get(wantedChunkNum);
    }
    checkServer() {
      var xhr = new XMLHttpRequest();
      const url = this.rangeMapper(0, 0).url;
      xhr.open("HEAD", url, false);
      xhr.send(null);
      if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))
        throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
      var datalength = Number(xhr.getResponseHeader("Content-length"));
      var hasByteServing = xhr.getResponseHeader("Accept-Ranges") === "bytes";
      const encoding = xhr.getResponseHeader("Content-Encoding");
      var usesCompression = encoding && encoding !== "identity";
      if (!hasByteServing) {
        const msg = "Warning: The server did not respond with Accept-Ranges=bytes. It either does not support byte serving or does not advertise it (`Accept-Ranges: bytes` header missing), or your database is hosted on CORS and the server doesn't mark the accept-ranges header as exposed. This may lead to incorrect results.";
        console.warn(msg, "(seen response headers:", xhr.getAllResponseHeaders(), ")");
      }
      if (usesCompression) {
        console.warn(`Warning: The server responded with ${encoding} encoding to a HEAD request. Ignoring since it may not do so for Range HTTP requests, but this will lead to incorrect results otherwise since the ranges will be based on the compressed data instead of the uncompressed data.`);
      }
      if (usesCompression) {
        datalength = null;
      }
      if (!this._length) {
        if (!datalength) {
          console.error("response headers", xhr.getAllResponseHeaders());
          throw Error("Length of the file not known. It must either be supplied in the config or given by the HTTP server.");
        }
        this._length = datalength;
      }
      this.serverChecked = true;
    }
    get length() {
      if (!this.serverChecked) {
        this.checkServer();
      }
      return this._length;
    }
    get chunkSize() {
      if (!this.serverChecked) {
        this.checkServer();
      }
      return this._chunkSize;
    }
    doXHR(absoluteFrom, absoluteTo) {
      console.log(`[xhr of size ${(absoluteTo + 1 - absoluteFrom) / 1024} KiB @ ${absoluteFrom / 1024} KiB]`);
      this.requestLimiter(absoluteTo - absoluteFrom);
      this.totalFetchedBytes += absoluteTo - absoluteFrom;
      this.totalRequests++;
      if (absoluteFrom > absoluteTo)
        throw new Error("invalid range (" + absoluteFrom + ", " + absoluteTo + ") or no bytes requested!");
      if (absoluteTo > this.length - 1)
        throw new Error("only " + this.length + " bytes available! programmer error!");
      const {
        fromByte: from,
        toByte: to,
        url
      } = this.rangeMapper(absoluteFrom, absoluteTo);
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, false);
      if (this.length !== this.chunkSize)
        xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
      xhr.responseType = "arraybuffer";
      if (xhr.overrideMimeType) {
        xhr.overrideMimeType("text/plain; charset=x-user-defined");
      }
      xhr.send(null);
      if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304))
        throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
      if (xhr.response !== void 0) {
        return xhr.response;
      } else {
        throw Error("xhr did not return uint8array");
      }
    }
  };
  function createLazyFile(FS2, parent, name, canRead, canWrite, lazyFileConfig) {
    var lazyArray = new LazyUint8Array(lazyFileConfig);
    var properties = { isDevice: false, contents: lazyArray };
    var node = FS2.createFile(parent, name, properties, canRead, canWrite);
    node.contents = lazyArray;
    Object.defineProperties(node, {
      usedBytes: {
        get: function() {
          return this.contents.length;
        }
      }
    });
    var stream_ops = {};
    var keys = Object.keys(node.stream_ops);
    keys.forEach(function(key) {
      var fn = node.stream_ops[key];
      stream_ops[key] = function forceLoadLazyFile() {
        FS2.forceLoadFile(node);
        return fn.apply(null, arguments);
      };
    });
    stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
      FS2.forceLoadFile(node);
      const contents = stream.node.contents;
      return contents.copyInto(buffer, offset, length, position);
    };
    node.stream_ops = stream_ops;
    return node;
  }

  // src/adv_worker.ts
  var file;
  var DEMO_FILEPATH = "https://ncnr.nist.gov/pub/ncnrdata/ngbsans/202009/nonims294/data/sans114140.nxs.ngb?gzip=false";
  self.onmessage = async function(event) {
    var _a, _b, _c, _d;
    const { action, payload } = event.data;
    if (action === "load") {
      const url = (_a = payload == null ? void 0 : payload.url) != null ? _a : DEMO_FILEPATH;
      const requestChunkSize = (_b = payload == null ? void 0 : payload.requestChunkSize) != null ? _b : 1024 * 1024;
      const LRUSize = (_c = payload == null ? void 0 : payload.LRUSize) != null ? _c : 50;
      const { FS: FS2 } = await ready;
      const config = {
        rangeMapper: (fromByte, toByte) => ({ url, fromByte, toByte }),
        requestChunkSize,
        LRUSize
      };
      createLazyFile(FS2, "/", "current.h5", true, false, config);
      file = new File("current.h5");
    } else if (action === "get") {
      await ready;
      if (file) {
        const path = (_d = payload == null ? void 0 : payload.path) != null ? _d : "entry";
        const item = file.get(path);
        if (item instanceof Group) {
          self.postMessage({
            type: item.type,
            attrs: item.attrs,
            children: [...item.keys()]
          });
        } else if (item instanceof Dataset) {
          const value = payload.slice ? item.slice(payload.slice) : item.value;
          self.postMessage({
            type: item.type,
            attrs: item.attrs,
            value
          });
        } else if (item instanceof BrokenSoftLink || item instanceof ExternalLink) {
          self.postMessage(item);
        } else {
          self.postMessage({
            type: "error",
            value: `item ${path} not found`
          });
        }
      }
    }
  };
})();