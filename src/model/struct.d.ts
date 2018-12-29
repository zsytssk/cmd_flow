import { TerminalOptions } from 'vscode';

type FileInfo = {
  name: string;
  file: string;
};

type CmdManager = {
  group_list: CmdGroup[];
  update(): void;
};

type CmdGroup = {
  name: string;
  cmd_list: Cmd;
};

type ExternOpt = {
  completeClose?: boolean;
  /** 是否隐藏 */
  hide?: boolean;
  /** 是否先执行其他命令 */
  before?: string[];
};

type CmdOPt = TerminalOptions & ExternOpt;

type Cmd = {
  id: string;
  name: string;
  opt: string;
  before: [];
  codes: Code[];
};

type Code = {
  text: string;
  wait: number;
};
