import { Uri, workspace } from 'vscode';
import { getCmdListFromDoc } from '../listCmd';
import { FileInfo } from '../utils';
import { Cmd, CmdInfo, DefaultCmd } from './cmd';
import { Behave, Model } from './dop';

export type GroupCmdInfo = CmdInfo & {
  group: string;
};

export class CmdGroup extends Model {
  public list: Cmd[] = [];
  public name: string;
  public file: string;
  constructor() {
    super();
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

    for (const item of cmd_list) {
      const cmd = new Cmd();
      const behave = cmd.getBehaveByCtor(DefaultCmd);
      behave.generate(item);
      list.push(cmd);
    }
    this.setData({ name, file });
  }
  public getAllCmd(): GroupCmdInfo[] {
    const result = [];
    const { list } = this.model;
    for (const item of list) {
      const behave = item.getBehaveByCtor(DefaultCmd);
      const info = behave.getInfo();
      if (!info) {
        continue;
      }
      result.push({
        ...info,
        group: this.name,
      });
    }
    return result;
  }
  public getFileInfo(): FileInfo {
    const { name, file } = this.model;
    return { name, file };
  }
}
