import { Uri, workspace } from 'vscode';
import { getCmdListFromDoc } from '../utils/getCmdListFromDoc';
import { FileInfo } from '../utils/utils';
import { Cmd, CmdInfo, DefaultCmd } from './cmd';
import { Behave, Model } from './dop';

export type GroupCmdInfo = CmdInfo & {
  group: string;
};

export class CmdGroup extends Model {
  public list: Cmd[] = [];
  public name: string;
  public file: string;
  constructor(top?: Model) {
    super(top);
    this.addBehave(new DefaultCmdGroup(this));
  }
}

export class DefaultCmdGroup extends Behave<CmdGroup> {
  public async generate(info: FileInfo) {
    const { model } = this;
    const { list } = model;
    const { file, name } = info;
    const uri = Uri.file(file);
    const doc = await workspace.openTextDocument(uri);
    const cmd_list = await getCmdListFromDoc(doc);

    try {
      for (const item of cmd_list) {
        const cmd = new Cmd(model);
        const behave = cmd.getBehaveByCtor(DefaultCmd);
        behave.generate(item);
        list.push(cmd);
      }
      this.setData({ name, file });
    } catch (error) {
      console.log(error);
    }
  }
  public getAllCmd(): GroupCmdInfo[] {
    const result = [];
    const { list, name: group } = this.model;
    for (const item of list) {
      const behave = item.getBehaveByCtor(DefaultCmd);
      const info = behave.getInfo();
      if (!info) {
        continue;
      }
      result.push({
        ...info,
        group,
      });
    }
    return result;
  }
  public getFileInfo(): FileInfo {
    const { name, file } = this.model;
    return { name, file };
  }
  public async executeByName(name: string) {
    const { list } = this.model;
    for (const item of list) {
      const { name: item_name } = item;
      if (name !== item_name) {
        continue;
      }
      const behave = item.getBehaveByCtor(DefaultCmd);
      await behave.execute();
      return true;
    }
    return;
  }
  public async executeById(id: string) {
    const { list } = this.model;
    for (const item of list) {
      const { id: item_id } = item;
      if (item_id !== id) {
        continue;
      }
      const behave = item.getBehaveByCtor(DefaultCmd);
      await behave.execute();
      return true;
    }
    return;
  }
}
