import { window, workspace, QuickPickItem } from 'vscode';
import { runCmd, createTerminal, disposeTerminal } from './terminal';
import { getCmdList } from './listCmd';
import { getAllCmdFile } from './utils';
import { execCmd } from './run';

export async function listCmd() {
  const cmd_list = await getCmdList();

  if (!cmd_list.length) {
    window.showInformationMessage(
      'cant find cmd_flow in cur file and global file !',
    );
    return;
  }

  const input_list: QuickPickItem[] = [];
  for (let cmd of cmd_list) {
    input_list.push({
      label: cmd.name,
      description: cmd.group,
    });
  }

  const item = await window.showQuickPick(input_list, {
    placeHolder: 'select cmd to run',
  });
  const index = input_list.indexOf(item);
  const cur_cmd = cmd_list[index];
  if (!cur_cmd) {
    return;
  }

  const { codes, opt = {} } = cur_cmd;
  let default_opt = {
    name: 'cmd-flow',
  };

  const terminal_opt = {
    ...default_opt,
    ...opt,
  };

  execCmd(terminal_opt, codes);
}

export async function listFile() {
  const files = await getAllCmdFile();
  if (!files.length) {
    window.showInformationMessage(
      'cant find any file for cmdFlow; make sure cmdFlow.globalFile or cmdFlow.workspaceFile are correct!',
    );
  }

  const input_list = [];
  for (let file of files) {
    input_list.push(file);
  }
  const item = await window.showQuickPick(input_list, {
    placeHolder: 'select file to open',
  });
  const doc = await workspace.openTextDocument(item);
  await window.showTextDocument(doc);
}
