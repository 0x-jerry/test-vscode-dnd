# example for vscode issue

Sometime, I can't drag an item and drop it to an empty tree view.

Reproduce step:

1. pnpm install.
2. Run `Launch Extension` task.
3. Drag all items from `viewA` and drop it to `viewB`
4. Then, drag any item from `viewB` and drop it to `viewA` (Can not drop it.)


FYI, sometime, it can drop to an empty tree view, but I didn't change any code.

![](./issue.mp4)