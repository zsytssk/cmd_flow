import { QuickPickItem, window, workspace } from 'vscode';
import { CmdManager, DefaultCmdManager } from './model/cmdManager';

const cmd_manager = new CmdManager();

export async function listCmd() {
  const behave = cmd_manager.getBehaveByCtor(DefaultCmdManager);
  const cmd_list = await behave.getAllCmd();
  if (!cmd_list.length) {
    window.showInformationMessage(
      'cant find cmd_flow in cur file and global file !',
    );
    return;
  }

  const input_list: QuickPickItem[] = [];
  for (const cmd of cmd_list) {
    const { name, group } = cmd;

    input_list.push({
      description: group,
      label: name,
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

  behave.execute(cur_cmd.id);
}

export async function listFile() {
  const behave = cmd_manager.getBehaveByCtor(DefaultCmdManager);
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

window.registerTreeDataProvider('nodeDependencies', new DepNodeProvider());
