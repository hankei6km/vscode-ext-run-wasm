import * as esbuild from 'esbuild'
import * as modulesPlugin from '@esbuild-plugins/node-modules-polyfill'
import * as fs from 'node:fs'
import * as path from 'node:path'

import { toJs } from 'estree-util-to-js'

const files = fs
  .readdirSync(path.join('src', 'test', 'suite'))
  .filter(
    (f) =>
      f.endsWith('test.ts') &&
      fs.statSync(path.join('src', 'test', 'suite', f)).isFile()
  )
  .map((f) => ({
    type: 'ExpressionStatement',
    expression: {
      type: 'AwaitExpression',
      argument: {
        type: 'ImportExpression',
        source: {
          type: 'Literal',
          value: `../suite/${f.replace(/\.ts$/, '.js')}`
        }
      }
    }
  }))
const p = {
  type: 'Program',
  sourceType: 'script',
  body: [
    {
      type: 'FunctionDeclaration',
      id: {
        type: 'Identifier',
        name: 'importAll'
      },
      expression: false,
      generator: false,
      async: true,
      params: [],
      body: {
        type: 'BlockStatement',
        body: files
      }
    }
  ]
}
const importAllFunc = toJs(p).value

await esbuild.build({
  stdin: {
    contents: `${fs.readFileSync(
      'src/test/web/index.ts',
      'utf8'
    )}\n${importAllFunc}`,
    loader: 'ts',
    resolveDir: 'src/test/web'
  },
  outfile: 'out/test/web/index.js',
  bundle: true,
  plugins: [modulesPlugin.NodeModulesPolyfillPlugin()],
  external: ['vscode'],
  sourcemap: true,
  platform: 'browser',
  format: 'cjs',
  logLevel: 'info'
})
