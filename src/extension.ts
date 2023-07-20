import { commands, ExtensionContext, workspace } from 'vscode'
import { Wasm, ProcessOptions, RootFileSystem, Stdio } from '@vscode/wasm-wasi'
//import minimist from 'minimist'
import { argsForRun, normalizeFullPath } from './lib/args'

export async function activate(_context: ExtensionContext) {
  const wasm: Wasm = await Wasm.load()

  // https://github.com/microsoft/vscode-wasm/blob/main/testbeds/python/extension.ts
  commands.registerCommand(
    'run-wasm.webshell-rw',
    async (
      _command: string,
      args: string[],
      cwd: string,
      stdio: Stdio,
      rootFileSystem: RootFileSystem
    ): Promise<number> => {
      const runArgs = argsForRun(args)
      const options: ProcessOptions = {
        stdio,
        rootFileSystem,
        args: [...runArgs.cmdArgs],
        trace: true
      }
      const filename = await rootFileSystem.toVSCode(
        normalizeFullPath(cwd, runArgs.cmdPath)
      )
      if (filename !== undefined) {
        const bits = await workspace.fs.readFile(filename)
        const module = await WebAssembly.compile(bits)

        const process = await wasm.createProcess(
          runArgs.cmdName,
          module,
          options
        )
        const result = await process.run()
        return result
      }
      return 1
    }
  )
}

export function deactivate() {}
