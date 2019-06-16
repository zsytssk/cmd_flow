import { QuickPickItem, window, workspace } from 'vscode';
import { extension_name } from './const';
import { GroupCmdInfo } from './model/cmdGroup';
import {
  CmdManager,
  DefaultCmdManager,
} from './model/cmdManager';
import {
  addToRecent,
  recentCmdPop,
  RecentItem,
} from './recent';
import {
  getActiveTerminals,
  TerminalItem,
} from './utils/terminal';

const cmd_manager = new CmdManager();
export async function listCmd() {
  const behave = cmd_manager.getBehaveByCtor(
    DefaultCmdManager,
  );
  let all_list: RecentItem[] = [];
  const cmd_list = await behave.getAllCmd();
  if (!cmd_list.length) {
    window.showInformationMessage(
      `${extension_name}:>Cant find cmd_flow in cur file and global file !`,
    );
    return;
  }
  let active_terminals = getActiveTerminals();
  active_terminals = recentCmdPop(active_terminals);
  all_list = all_list.concat(active_terminals, cmd_list);

  const input_list: QuickPickItem[] = [];
  for (const all_item of all_list) {
    const { name, group } = all_item;
    input_list.push({
      description: group,
      label: name,
    });
  }

  const item = await window.showQuickPick(input_list, {
    placeHolder: 'select cmd to run',
  });

  const cur_item = all_list.find(cmd_item => {
    return (
      cmd_item.group === item.description &&
      cmd_item.name === item.label
    );
  });
  addToRecent(cur_item);
  if ((cur_item as TerminalItem).terminal) {
    (cur_item as TerminalItem).terminal.show();
    return;
  } else {
    behave.execute((cur_item as GroupCmdInfo).id);
  }
}

export async function listFile() {
  const behave = cmd_manager.getBehaveByCtor(
    DefaultCmdManager,
  );
  const files = await behave.getFiles();

  const input_list = [];
  for (const file of files) {
    const { name: label, file: description } = file;
    input_list.push({ label, description });
  }
  const item = await window.showQuickPick(input_list, {
    placeHolder: 'select file to open',
  });
  const index = files.findIndex(item_file => {
    return item.label === item_file.name;
  });
  if (index === -1) {
    return;
  }

  const { file } = files[index];
  const doc = await workspace.openTextDocument(file);
  await window.showTextDocument(doc);
}

process.on('unhandledRejection', reason => {
  console.log('unhandledRejection');
  console.log(reason);
});
