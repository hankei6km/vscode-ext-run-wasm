import minimist from 'minimist'

export type ArgsForRun = {
  runArgs: minimist.ParsedArgs
  cmdName: string
  cmdPath: string
  cmdArgs: string[]
}

export function argsForRun(args: string[]): ArgsForRun {
  const splitIdx = args.findIndex((arg) => arg === '--')
  const runArgs = args.slice(0, splitIdx + 1)
  const cmdPath = args[splitIdx + 1]
  // path 区切りはおそらくどのプラットフォームでも `/` で統一されているはず。
  const cmdName = cmdPath.split('/').pop() || ''
  const cmdArgs = args.slice(splitIdx + 2)
  return {
    runArgs: minimist(runArgs),
    cmdName,
    cmdPath,
    cmdArgs: cmdArgs
  }
}
