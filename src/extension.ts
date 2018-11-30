'use strict';

import * as vscode from 'vscode';
import { main } from './main';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('cmdFlow.curFile', async () => {
      main('curFile');
    }),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('cmdFlow.global', async () => {
      main('global');
    }),
  );
}
