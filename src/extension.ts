import { commands, ExtensionContext, workspace } from 'vscode'
import {
  Wasm,
  ProcessOptions,
  RootFileSystem,
  Stdio,
  WasmProcess
} from '@vscode/wasm-wasi'
//import minimist from 'minimist'
import { argsForRun, memoryDescriptor, normalizeFullPath } from './lib/args'

function stdoutWrite(stdout: Stdio['out'], data: string) {
  stdout?.kind === 'terminal' && stdout.terminal.write(data)
}

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

        if (runArgs.runArgs['print-imports-exports']) {
          if (stdio.out !== undefined) {
            for (const imp of WebAssembly.Module.imports(module)) {
              stdoutWrite(
                stdio.out,
                `import: ${imp.module} ${imp.name} ${imp.kind}\n`
              )
            }
            for (const exp of WebAssembly.Module.exports(module)) {
              stdoutWrite(stdio.out, `export: ${exp.name} ${exp.kind}\n`)
            }
          }
          return 0
        }
        const memory = memoryDescriptor(runArgs.runArgs)
        let process: WasmProcess | undefined

        if (memory !== undefined) {
          process = await wasm.createProcess(
            runArgs.cmdName,
            module,
            memory,
            options
          )
        } else {
          process = await wasm.createProcess(runArgs.cmdName, module, options)
        }
        const result = await process.run()
        return result
      }
      return 1
    }
  )
}

export function deactivate() {}
