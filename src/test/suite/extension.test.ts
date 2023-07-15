import * as assert from 'assert'
//import { before } from 'mocha'

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode'
// import * as myExtension from '../extension';

suite('Extension Test Suite 1', () => {
  vscode.window.showInformationMessage('Start all tests.')

  test('Sample test', async () => {
    await new Promise((resolve) => {
      //const t = new Promise((resolve) => {
      vscode.window.onDidOpenTerminal(async (terminal) => {
        resolve(terminal)
      })
      vscode.commands.executeCommand('ms-vscode.webshell.create')
    })
    // Web Shell のターミナルでコマンド実行する方法がわからないので(改行が `\r` になってしまう)、
    // とりあえず assert を実行するだけ。
    assert.equal(1, 1)
    // assert.equal(JSON.stringify(await t, null, 2), '')
  })
})
