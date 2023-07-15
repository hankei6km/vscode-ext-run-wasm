import * as assert from 'assert'

import { argsForRun } from '../../../lib/args'

suite('Args Test Suite', () => {
  test('argsForRun', () => {
    assert.deepEqual(argsForRun(['foo', 'bar', '--baz', '1']), {
      runArgs: { _: [] },
      cmdName: 'foo',
      cmdPath: 'foo',
      cmdArgs: ['bar', '--baz', '1']
    })
    assert.deepEqual(argsForRun(['/workspace/foo', 'bar', '--baz', '1']), {
      runArgs: { _: [] },
      cmdName: 'foo',
      cmdPath: '/workspace/foo',
      cmdArgs: ['bar', '--baz', '1']
    })
    assert.deepEqual(argsForRun(['--', 'foo', 'bar', '--baz', '1']), {
      runArgs: { _: [] },
      cmdName: 'foo',
      cmdPath: 'foo',
      cmdArgs: ['bar', '--baz', '1']
    })
    assert.deepEqual(argsForRun(['--baz', '1', '--', 'foo', 'bar']), {
      runArgs: { _: [], baz: 1 },
      cmdName: 'foo',
      cmdPath: 'foo',
      cmdArgs: ['bar']
    })
    assert.deepEqual(
      argsForRun([
        '--baz',
        '1',
        '--',
        '/workspace/foo',
        '--qux',
        '2',
        '--',
        'bar',
        '--quux'
      ]),
      {
        runArgs: { _: [], baz: 1 },
        cmdName: 'foo',
        cmdPath: '/workspace/foo',
        cmdArgs: ['--qux', '2', '--', 'bar', '--quux']
      }
    )
  })
})
