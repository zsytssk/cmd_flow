import { window } from 'vscode';
import { runCmd, createTerminal, disposeTerminal } from './terminal';
import { getCmdList } from './listCmd';

export async function main() {
  const cmd_list = await getCmdList();

  if (!cmd_list.length) {
    window.showInformationMessage('cant find cmd_flow in this file!');
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
    terminal.dispose();
  }
}
