'use strict';

import * as vscode from 'vscode';
import { listCmd, listFile } from './main';
import { DepNodeProvider } from './treeView';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('cmdFlow.listCmd', async () => {
      listCmd();
    }),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('cmdFlow.listFile', async () => {
      listFile();
    }),
  );

  const nodeDependenciesProvider = new DepNodeProvider(
    vscode.workspace.rootPath,
  );
  vscode.window.registerTreeDataProvider(
    'cmdFlowList',
    nodeDependenciesProvider,
  );
}
