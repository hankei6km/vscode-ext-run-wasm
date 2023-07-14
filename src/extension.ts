import { commands, ExtensionContext, Uri, workspace } from 'vscode'
import { Wasm, ProcessOptions, RootFileSystem, Stdio } from '@vscode/wasm-wasi'

export async function activate(context: ExtensionContext) {
  const wasm: Wasm = await Wasm.load()

  // https://github.com/microsoft/vscode-wasm/blob/main/testbeds/python/extension.ts
  commands.registerCommand(
    'wasm-wasi-hello.webshell',
    async (
      _command: string,
      args: string[],
      _cwd: string,
      stdio: Stdio,
      rootFileSystem: RootFileSystem
    ): Promise<number> => {
      const options: ProcessOptions = {
        stdio,
        rootFileSystem,
        args: [...args],
        trace: true
      }
      const filename = Uri.joinPath(
        context.extensionUri,
        'wasm',
        'bin',
        'hello.wasm'
      )
      const bits = await workspace.fs.readFile(filename)
      const module = await WebAssembly.compile(bits)
      const process = await wasm.createProcess('hello', module, options)
      const result = await process.run()
      return result
    }
  )
}

export function deactivate() {}
