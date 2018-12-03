import { window, workspace } from 'vscode';
import { runCmd, createTerminal, disposeTerminal } from './terminal';
import { getCurCmdList, getGlobalCmdList } from './listCmd';

export async function showCmdList() {
  const get_cur_list = getCurCmdList();
  const get_global_list = getGlobalCmdList();

  const cmd_list = await Promise.all([get_cur_list, get_global_list]).then(
    list => {
      return list[0].concat(list[1]);
    },
  );

  if (!cmd_list.length) {
    window.showInformationMessage(
      'cant find cmd_flow in cur file and global file !',
    );
    return;
  }

  const input_list = [];
  for (let cmd of cmd_list) {
    input_list.push(cmd.name);
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
  const { completeClose } = opt;

  const terminal_opt = {
    ...default_opt,
    ...opt,
  };

  const terminal = createTerminal(terminal_opt);
  terminal.show();
  for (let item of codes) {
    await runCmd(terminal, item.text, item.wait);
  }
  if (completeClose) {
    disposeTerminal(terminal);
  }
}

export async function openGlobalFile() {
  const file = workspace.getConfiguration().get('cmdFlow.global') as string;
  if (!file) {
    window.showErrorMessage('cant find setting for cmdFlow.global!');
    return [];
  }
  const doc = await workspace.openTextDocument(file);
  await window.showTextDocument(doc);
}
