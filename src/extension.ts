'use strict';

import * as vscode from 'vscode';
import { main } from './main';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('cmdFlow.run', async () => {
      main();
    }),
  );
}
