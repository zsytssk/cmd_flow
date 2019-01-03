import { getAllCmdFile, FileInfo } from '../utils/utils';
import { CmdGroup, DefaultCmdGroup, GroupCmdInfo } from './cmdGroup';
import { Behave, Model } from './dop';

export class CmdManager extends Model {
  public list: CmdGroup[] = [];
  constructor() {
    super();
    this.addBehave(new DefaultCmdManager(this));
  }
}

type DefaultCmdManagerStatus = 'default' | 'going' | 'end';

export class DefaultCmdManager extends Behave<CmdManager> {
  private status: DefaultCmdManagerStatus = 'default';
  public async init() {
    this.status = 'going';
    const { list } = this.model;
    const files = await getAllCmdFile();
    for (const item of files) {
      const group = new CmdGroup();
      const behave = group.getBehaveByCtor(DefaultCmdGroup);
      await behave.generate(item);
      list.push(group);
    }
    this.status = 'end';
  }
  private async update() {
    this.setData({ list: [] });
    await this.init();
  }
  public async getAllCmd(): Promise<GroupCmdInfo[]> {
    if (this.status === 'going') {
      return;
    } else if (this.status === 'default') {
      await this.init();
    } else {
      await this.update();
    }

    let result = [];
    const { list } = this.model;
    for (const item of list) {
      const behave = item.getBehaveByCtor(DefaultCmdGroup);
      result = result.concat(behave.getAllCmd());
    }
    return result;
  }
  public async getFiles(): Promise<FileInfo[]> {
    if (this.status === 'going') {
      return;
    } else if (this.status === 'default') {
      await this.init();
    } else {
      await this.update();
    }

    const result = [];
    const { list } = this.model;
    for (const item of list) {
      const behave = item.getBehaveByCtor(DefaultCmdGroup);
      const file_info = behave.getFileInfo();
      result.push(file_info);
    }
    return result;
  }
  public execute(id: string) {
    const { list } = this.model;
    for (const item of list) {
      const behave = item.getBehaveByCtor(DefaultCmdGroup);
      const is_executed = behave.execute(id);
      if (is_executed) {
        return;
      }
    }
  }
}
