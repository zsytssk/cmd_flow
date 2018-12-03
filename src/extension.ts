'use strict';

import * as vscode from 'vscode';
import { showCmdList, openGlobalFile } from './main';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('cmdFlow.show', async () => {
      showCmdList();
    }),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('cmdFlow.openGlobal', async () => {
      openGlobalFile();
    }),
  );
}
