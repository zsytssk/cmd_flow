import { getAllCmdFile } from '../utils';
import { CmdGroup, DefaultCmdGroup, GroupCmdInfo } from './cmdGroup';
import { Behave, Model } from './dop';

export class CmdManager extends Model {
  public list: CmdGroup[] = [];
  constructor() {
    super();
    this.addBehave(new DefaultCmdManager(this));
  }
}

export class DefaultCmdManager extends Behave<CmdManager> {
  public async init() {
    const { list } = this.model;
    const files = await getAllCmdFile();
    for (const item of files) {
      const group = new CmdGroup();
      const behave = group.getBehaveByCtor(DefaultCmdGroup);
      await behave.generate(item);
      list.push(group);
    }
  }
  public getAllCmd(): GroupCmdInfo[] {
    let result = [];
    const { list } = this.model;
    for (const item of list) {
      const behave = item.getBehaveByCtor(DefaultCmdGroup);
      result = result.concat(behave.getAllCmd());
    }
    return result;
  }
  public execute(id: string) {}
  public getFiles() {
    const result = [];
    const { list } = this.model;
    for (const item of list) {
      const behave = item.getBehaveByCtor(DefaultCmdGroup);
      const file_info = behave.getFileInfo();
      result.push(file_info);
    }
    return result;
  }
  public update() {}
}
