import * as path from 'path'
import * as cp from 'child_process'

import {
  runTests,
  downloadAndUnzipVSCode,
  resolveCliArgsFromVSCodeExecutablePath
} from '@vscode/test-electron'

async function go() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '../../')
    const extensionTestsPath = path.resolve(__dirname, './suite')
    const testWorkspace = path.resolve(__dirname, '../../tmp')
    const vscodeExecutablePath = await downloadAndUnzipVSCode('stable')
    const [cliPath, ...args] =
      resolveCliArgsFromVSCodeExecutablePath(vscodeExecutablePath)

    cp.spawnSync(
      cliPath,
      [
        ...args,
        '--install-extension=ms-vscode.wasm-wasi-core@prerelease',
        '--install-extension=ms-vscode.webshell@prerelease',
        '--force'
      ],
      {
        encoding: 'utf-8',
        stdio: 'inherit'
      }
    )

    await runTests({
      vscodeExecutablePath,
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [
        testWorkspace,
        // https://github.com/microsoft/vscode-test/issues/147
        '--no-sandbox',
        '--disable-updates',
        '--skip-welcome',
        '--skip-release-notes',
        '--disable-workspace-trust'
      ]
    })
  } catch (err) {
    console.error('Failed to run tests')
    process.exit(1)
  }
}

go()
