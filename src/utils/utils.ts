import * as fs from 'fs';
import * as path from 'path';

import { workspace, window } from 'vscode';

export function exists(path_str: string) {
  return new Promise((resolve, reject) => {
    fs.exists(path_str, exist => {
      resolve(exist);
    });
  });
}

export type FileInfo = {
  name: string;
  file: string;
};
export async function getAllCmdFile() {
  let files: FileInfo[] = [];

  const { workspaceFolders } = workspace;
  const cmd_path = workspace
    .getConfiguration()
    .get('cmdFlow.workspaceFile') as string;

  if (cmd_path && workspaceFolders) {
    for (const folder of workspaceFolders) {
      const { name, uri } = folder;
      let file = path.resolve(uri.fsPath, cmd_path);
      if (await exists(file)) {
        file = path.normalize(file);
        files.push({
          file,
          name,
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
      name: 'Global',
      file: global_file,
    });
  }

  files = files.filter((item, pos) => {
    return files.indexOf(item) === pos;
  });

  if (!files.length) {
    window.showInformationMessage(
      'cant find any file for cmdFlow; make sure cmdFlow.globalFile or cmdFlow.workspaceFile are correct!',
    );
  }

  return files;
}

export function generateId() {
  return Math.random()
    .toString()
    .replace('0.', '');
}
