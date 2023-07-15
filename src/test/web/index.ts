// imports mocha for the browser, defining the `mocha` global.
require('mocha/mocha')
declare var importAll: Function | undefined

export function run(): Promise<void> {
  return new Promise(async (c, e) => {
    mocha.setup({
      ui: 'tdd',
      reporter: undefined,
      timeout: 5000
    })
    typeof importAll === 'function' && (await importAll())

    try {
      // Run the mocha test
      mocha.run((failures) => {
        if (failures > 0) {
          e(new Error(`${failures} tests failed.`))
        } else {
          c()
        }
      })
    } catch (err) {
      console.error(err)
      e(err)
    }
  })
}

//async function importAll() {
//  await import('./extension.test.js')
//  await import('./extension2.test.js')
//}
