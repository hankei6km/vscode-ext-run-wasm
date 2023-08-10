# vscode-ext-run-wasm

## Usage

Experimental - VSCode extension to run `.wasm` on Web Shell

- Open the terminal with Web Shell(Execute the `Terminal: Create New Web Shell` command from the command palette)
- `$ rw /path/to/file.wasm`

![A screenshot of running a .wasm file using the `rw` command](images/screenshot.png)

### MemoryDescriptor

You can specify the memory descriptor via `--memory-*` flags.

An example of executing a `.wasm` file built using [`wasm32-wasi-preview1-threads`](https://doc.rust-lang.org/nightly/rustc/platform-support/wasm32-wasi-preview1-threads.html) target.

```sh
rw --memory-initial=20 --memory-maximum=160 -- /path/to/file.wasm
```

If you want to disable shared memory, you can use `--memory-shared=false` flag.

```sh
rw --memory-initial=20 --memory-shared=false -- /path/to/file.wasm
```

### Print Elapsed time

You can measure the elapsed time of the running `.wasm` file with the `--print-elapsed-time` flag.
(It measures the time before and after calling `process.run()`)

```sh
rw --print-elapsed-time -- /path/to/file.wasm
```

### Print Imports and Exports

You can print the imports and exports of the `.wasm` file with the `--print-imports-exports` flags.

```sh
rw --print-imports--exports -- /path/to/file.wasm
```
