import {
  FileInfo,
  getAllCmdFile,
  setProps,
} from '../utils/utils';
import { GroupCmdInfo } from './cmdGroup';
import { CmdManager } from './model';
import { state } from './state';

type DefaultCmdManagerStatus = 'default' | 'going' | 'end';

export class CmdManagerBehave {
  private status = 'default' as DefaultCmdManagerStatus;
  private model: CmdManager;
  public async init() {
    const { cmd_group_behave } = state;
    this.status = 'going';
    const model = new CmdManager();
    const { list } = model;
    const files = await getAllCmdFile();
    for (const item of files) {
      const group = await cmd_group_behave.generate(item);
      list.push(group);
    }
    this.model = model;
    this.status = 'end';
  }
  private async update() {
    const { model } = this;
    if (model) {
      setProps(model, { list: [] });
    }
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

    const { cmd_group_behave } = state;
    let result = [];
    result = result.concat(cmd_group_behave.getAllCmd());
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

    const { cmd_group_behave } = state;
    return cmd_group_behave.getFileInfo();
  }
  public async execute(id: string) {
    const { cmd_group_behave } = state;
    const is_executed = await cmd_group_behave.executeById(
      id,
    );
    return is_executed;
  }
}
