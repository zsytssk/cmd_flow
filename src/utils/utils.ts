import * as fs from 'fs';
import * as path from 'path';
import { window, workspace } from 'vscode';
import {
  terminal_end_str,
  extension_name,
  code_item_reg_exp,
  terminal_end_char,
} from '../const';

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
      `${extension_name}:>cant find any file for cmdFlow; make sure
      cmdFlow.globalFile or cmdFlow.workspaceFile are correct!`,
    );
  }

  return files;
}

export function generateId() {
  return Math.random()
    .toString()
    .replace('0.', '');
}

export function isNormalCompleteLog(str: string) {
  if (!str || str.length === 0) {
    return;
  }
  for (const end_str of terminal_end_str) {
    for (const end_char of terminal_end_char) {
      const test_str = end_char + end_str;
      const index = str.lastIndexOf(test_str);
      if (index === -1) {
        continue;
      }
      if (index + test_str.length === str.length) {
        return true;
      }
    }
  }
}
export function isLastStr(str: string, end: string) {
  if (!str || str.length === 0) {
    return false;
  }
  for (const end_str of terminal_end_str) {
    const test_str = end + end_str;
    const index = str.lastIndexOf(test_str);
    if (index === -1) {
      continue;
    }
    if (index + test_str.length === str.length) {
      return true;
    }
  }
  return false;
}

export type Code = {
  text: string;
  wait_time: number;
  wait_str: string;
};
/** 分析 code str数据 */
export function analysisCodeStr(
  source_str: string,
): Code[] {
  const code_str_arr = source_str.split(/\r?\n/g);
  const result = [] as Code[];
  for (const item of code_str_arr) {
    if (item === '') {
      continue;
    }
    const match_item = item.match(code_item_reg_exp);
    if (!match_item) {
      continue;
    }
    const text = match_item[1];
    const wait_time = Number(match_item[3]) || 0.5;
    const wait_str = match_item[5] || '';
    result.push({
      text,
      wait_time,
      wait_str,
    });
  }
  return result;
}
