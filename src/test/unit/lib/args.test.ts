import * as assert from 'assert'

import {
  argsForRun,
  memoryDescriptor,
  normalizeFullPath
} from '../../../lib/args'

suite('Args Test Suite', () => {
  test('normalizeFullPath', () => {
    assert.equal(normalizeFullPath('/workspace', 'foo'), '/workspace/foo')
    assert.equal(normalizeFullPath('/workspace', './foo'), '/workspace/./foo')
    assert.equal(normalizeFullPath('/workspace', '/path/tofoo'), '/path/tofoo')
  })

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

  test('memoryDescriptor', () => {
    assert.deepEqual(memoryDescriptor({ _: [] }), undefined)
    assert.deepEqual(
      memoryDescriptor({ _: [], 'memory-initial': 10, 'memory-maximum': 160 }),
      {
        initial: 10,
        maximum: 160,
        shared: true
      }
    )
    assert.deepEqual(
      memoryDescriptor({
        _: [],
        'memory-initial': '10',
        'memory-maximum': 160
      }),
      undefined
    )
    assert.deepEqual(
      memoryDescriptor({
        _: [],
        'memory-initial': 10,
        'memory-shared': 'false'
      }),
      {
        initial: 10,
        shared: false
      }
    )
  })
})
