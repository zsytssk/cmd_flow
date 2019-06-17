'use strict';

import * as vscode from 'vscode';
import { listCmd, listFile } from './main';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'cmdFlow.listCmd',
      async () => {
        listCmd();
      },
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'cmdFlow.listFile',
      async () => {
        listFile();
      },
    ),
  );
}
