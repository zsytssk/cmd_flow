import { TerminalOptions } from 'vscode';
import { Code } from '../utils/utils';

export class CmdManager {
  public list: CmdGroup[] = [];
}
export class CmdGroup {
  public list: Cmd[] = [];
  public name: string;
  public file: string;
}
export class Cmd {
  public group: CmdGroup;
  public id: string;
  public name: string;
  public is_task: boolean;
  public opt: TerminalOptions;
  public hide: boolean;
  public no_output: boolean;
  public completeClose: boolean | number;
  public before?: string[];
  public codes?: Code[];
}
