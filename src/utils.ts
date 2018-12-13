import * as fs from 'fs';
import * as path from 'path';

import { workspace } from 'vscode';

export function exists(path) {
  return new Promise((resolve, reject) => {
    fs.exists(path, exist => {
      resolve(exist);
    });
  });
}

export async function getAllCmdFile() {
  let files = [];

  const { workspaceFolders } = workspace;
  const cmd_path = workspace
    .getConfiguration()
    .get('cmdFlow.workspaceFile') as string;

  if (cmd_path && workspaceFolders) {
    for (let folder of workspaceFolders) {
      const file = path.resolve(folder.uri.fsPath, cmd_path);
      if (await exists(file)) {
        files.push(file);
      }
    }
  }

  const global_file = workspace
    .getConfiguration()
    .get('cmdFlow.globalFile') as string;

  if (global_file) {
    files.push(global_file);
  }

  files = files.map(function(item, pos) {
    return path.normalize(item);
  });
  files = files.filter(function(item, pos) {
    return files.indexOf(item) == pos;
  });

  return files;
}
