'use strict'

import * as vscode from 'vscode'
import { DnDTreeView } from './DnDTreeView'

export function activate(context: vscode.ExtensionContext) {
  console.log('MemFS says "Hello"')

  const a = new DnDTreeView('a', 'b')

  context.subscriptions.push(
    vscode.window.createTreeView('dnd.a', {
      treeDataProvider: a,
      showCollapseAll: true,
      canSelectMany: true,
      dragAndDropController: a,
    }),
  )

  const b = new DnDTreeView('b', 'a')
  context.subscriptions.push(
    vscode.window.createTreeView('dnd.b', {
      treeDataProvider: b,
      showCollapseAll: true,
      canSelectMany: true,
      dragAndDropController: b,
    }),
  )
}
