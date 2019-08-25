import { Uri, workspace } from 'vscode';
import { getCmdListFromDoc } from '../utils/getCmdListFromDoc';
import { FileInfo, setProps } from '../utils/utils';
import { CmdInfo } from './cmd';
import { ModelMap } from './dop';
import { Cmd, CmdGroup } from './model';
import { state } from './state';

export type GroupCmdInfo = CmdInfo & {
  group: string;
};
export class CmdGroupBehave {
  private model_map: ModelMap<CmdGroup> = new Map();
  public async generate(info: FileInfo) {
    const { model_map } = this;
    const { cmd_behave } = state;
    const cmd_group = new CmdGroup();

    model_map.set('', cmd_group);
    const { list } = cmd_group;
    const { file, name } = info;
    const uri = Uri.file(file);
    const doc = await workspace.openTextDocument(uri);
    const cmd_list = await getCmdListFromDoc(doc);

    try {
      for (const item of cmd_list) {
        const cmd = cmd_behave.generate(item);
        list.push(cmd);
      }
      setProps(cmd_group, { name, file });
    } catch (error) {
      console.log(error);
    }

    return cmd_group;
  }
  public getAllCmd(): GroupCmdInfo[] {
    const { cmd_behave } = state;
    const { model_map } = this;
    const result = [];
    for (const [name, item_group] of model_map) {
      const { list } = item_group;
      for (const item of list) {
        const info = cmd_behave.getInfo(item);
        if (!info) {
          continue;
        }
        result.push({
          ...info,
          group: name,
        });
      }
    }
    return result;
  }
  public getFileInfo(): FileInfo[] {
    const list = [] as FileInfo[];
    for (const [name, group] of this.model_map) {
      list.push({ name, file: group.file });
    }
    return list;
  }
  public async executeByName(name: string) {
    const { cmd_behave } = state;
    const result = this.findCmdBy(match_item => {
      return match_item.name === name;
    });
    if (result) {
      await cmd_behave.execute(...result);
      return true;
    }
    return false;
  }
  public async executeById(id: string) {
    const { cmd_behave } = state;
    const result = this.findCmdBy(match_item => {
      return match_item.id === id;
    });
    if (result) {
      await cmd_behave.execute(...result);
      return true;
    }
    return false;
  }
  private findCmdBy(
    match_fun: (cmd: Cmd) => boolean,
  ): [Cmd, CmdGroup] {
    for (const [, item_group] of this.model_map) {
      const { list } = item_group;
      for (const item of list) {
        if (match_fun(item)) {
          return [item, item_group];
        }
      }
    }
    return;
  }
}
