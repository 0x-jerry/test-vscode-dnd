/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as path from 'path'
import * as vscode from 'vscode'

class Key {
  constructor(readonly key: string) {}
}

const tree = {
  a: ['a', 'b'].map((n) => new Key(n)),
  b: ['c', 'd'].map((n) => new Key(n)),
}

type Types = keyof typeof tree

const dndMimeType = 'application/vnd.code.tree.dnd'
const _onDidChangeTreeData = new vscode.EventEmitter<Node[] | null>()

export class DnDTreeView
  implements vscode.TreeDataProvider<Node>, vscode.TreeDragAndDropController<Node>
{
  public onDidChangeTreeData: vscode.Event<Node[] | null> = _onDidChangeTreeData.event

  constructor(public type: Types, public acceptType: Types) {}

  getTreeItem(element: Node): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return {
      label: element.key,
    }
  }

  getChildren(element?: Node): vscode.ProviderResult<Node[]> {
    return tree[this.type]
  }

  // dnd
  dropMimeTypes = [dndMimeType + this.acceptType]
  dragMimeTypes = [dndMimeType + this.type]

  public async handleDrop(
    target: Node | undefined,
    sources: vscode.DataTransfer,
    token: vscode.CancellationToken,
  ): Promise<void> {
    const transferItem = sources.get(dndMimeType + this.acceptType)

    if (!transferItem) return

    const items: Node[] = JSON.parse(await transferItem.asString())

    if (!items?.length) {
      return
    }

    const treeItems = items.map(n => tree[this.acceptType].find(k => k.key === n.key)!)

    tree[this.type].push(...treeItems)

    for (const item of treeItems) {
      remove(tree[this.acceptType], item)
    }

    _onDidChangeTreeData.fire(null)
  }

  public async handleDrag(
    source: Node[],
    treeDataTransfer: vscode.DataTransfer,
    token: vscode.CancellationToken,
  ): Promise<void> {
    treeDataTransfer.set(dndMimeType + this.type, new vscode.DataTransferItem(source))
  }
}

type Node = { key: string }

function remove(arr: Node[], item: Node) {
  const idx = arr.findIndex((n) => n.key === item.key)
  if (idx >= 0) arr.splice(idx, 1)
}
