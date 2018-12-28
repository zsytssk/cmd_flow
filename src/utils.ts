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

export type FileInfo = {
  group: string;
  file: string;
};
export async function getAllCmdFile() {
  let files: FileInfo[] = [];

  const { workspaceFolders } = workspace;
  const cmd_path = workspace
    .getConfiguration()
    .get('cmdFlow.workspaceFile') as string;

  if (cmd_path && workspaceFolders) {
    for (let folder of workspaceFolders) {
      const { name: group, uri } = folder;
      let file = path.resolve(uri.fsPath, cmd_path);
      if (await exists(file)) {
        file = path.normalize(file);
        files.push({
          file,
          group,
        });
      }
    }
  }

  let global_file = workspace
    .getConfiguration()
    .get('cmdFlow.globalFile') as string;
  if (global_file) {
    global_file = path.normalize(global_file);
    files.push({
      group: 'Global',
      file: global_file,
    });
  }

  files = files.filter(function(item, pos) {
    return files.indexOf(item) == pos;
  });

  return files;
}
