import * as esbuild from 'esbuild'
import * as globalsPlugin from '@esbuild-plugins/node-globals-polyfill'
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
          // value: `./${f.replace(/\.ts$/, '.js')}`
          value: `../suite/${f.replace(/\.ts$/, '.js')}`
        }
      }
    }
  }))
const p = {
  type: 'Program',
  sourceType: 'script',
  //comments: []
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
        //body: [
        //  {
        //    type: 'ExpressionStatement',
        //    expression: {
        //      type: 'AwaitExpression',
        //      argument: {
        //        type: 'ImportExpression',
        //        source: {
        //          type: 'Literal',
        //          value: 'test.js'
        //        }
        //      }
        //    }
        //  },
        //  {
        //    type: 'ExpressionStatement',
        //    expression: {
        //      type: 'AwaitExpression',
        //      argument: {
        //        type: 'ImportExpression',
        //        source: {
        //          type: 'Literal',
        //          value: 'test1.js'
        //        }
        //      }
        //    }
        //  }
        //]
      }
    }
  ]
}
const importAllFunc = toJs(p).value
//const importAllFunc = ''

await esbuild.build({
  //entryPoints: ['src/test/index.ts'],
  stdin: {
    //contents: c.outputFiles[0].text,
    contents: `${fs.readFileSync(
      'src/test/web/index.ts',
      'utf8'
    )}\n${importAllFunc}`,
    loader: 'ts',
    resolveDir: 'src/test/web'
  },
  //inject: ['node_modules/mocha/mocha.js'],
  outfile: 'out/test/web/index.js',
  bundle: true,
  plugins: [
    globalsPlugin.NodeGlobalsPolyfillPlugin({
      process: true,
      define: {
        //'process.env.NODE_ENV': deploy ? '"production"' : '"development"'
        'process.env.NODE_ENV': '"development"'
      }
    }),
    modulesPlugin.NodeModulesPolyfillPlugin()
  ],
  //define: { suiteFiles: '["./extension.test.js"]' },
  external: ['vscode'],
  sourcemap: true,
  platform: 'browser',
  format: 'cjs',
  logLevel: 'info'
})
