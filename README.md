# vscode-ext-run-wasm

## Usage

Experimental - VSCode extension to run `.wasm` on Web Shell

- Open the terminal with Web Shell(Execute the `Terminal: Create New Web Shell` command from the command palette)
- `$ rw /path/to/file.wasm`

![A screenshot of running a .wasm file using the `rw` command](images/screenshot.png)

## MemoryDescriptor

You can specify the memory descriptor via `--memory-*` flags.

```sh
rw --memory-initial=20 --memory-maximum=160 -- /path/to/file.wasm
```

If you want to disable shared memory, you can use `--memory-shared=false` flag.

```sh
rw --memory-initial=20 --memory-shared=false -- /path/to/file.wasm
```
