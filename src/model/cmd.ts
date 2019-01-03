import { TerminalOptions, window } from 'vscode';
import { code_item_reg_exp } from '../const';
import { CmdSymbols } from '../utils/getCmdListFromDoc';
import { generateId } from '../utils/utils';
import { Behave, Model } from './dop';
import { createTerminal, runCmd, disposeTerminal } from '../utils/terminal';

export type ExternOpt = {
  completeClose?: boolean;
  /** 是否隐藏 */
  hide?: boolean;
  /** 是否先执行其他命令 */
  before?: string[];
};

export type CmdOPt = TerminalOptions & ExternOpt;

export type Code = {
  text: string;
  wait: number;
};

export type CmdInfo = { id: string; name: string };

export class Cmd extends Model {
  public id: string;
  public name: string;
  public opt: TerminalOptions;
  public hide: boolean;
  public completeClose: boolean;
  public before?: string[];
  public codes?: Code[];
  constructor() {
    super();
    this.addBehave(new DefaultCmd(this));
  }
}

export class DefaultCmd extends Behave<Cmd> {
  public generate(info: CmdSymbols) {
    const { name, opt_str, code_str } = info;
    const codes: Code[] = [];

    const id = generateId();

    let opt: CmdOPt = {};
    try {
      opt = JSON.parse(opt_str);
    } catch (err) {
      console.log(err);
    }
    const { hide, before, completeClose } = opt;

    if (code_str) {
      const code_str_arr = code_str.split(/\r?\n/g);
      for (const item of code_str_arr) {
        if (item === '') {
          continue;
        }
        const match_item = item.match(code_item_reg_exp);
        if (!match_item) {
          continue;
        }
        const text = match_item[1];
        const wait = Number(match_item[3]) || 0.5;
        codes.push({
          text,
          wait,
        });
      }
    }

    opt = {
      name,
      ...opt,
    };
    this.setData({ id, name, codes, opt, hide, before, completeClose });
  }
  public getInfo(): CmdInfo {
    const { id, name, hide } = this.model;
    if (hide) {
      return;
    }
    return {
      id,
      name,
    };
  }
  public async execute() {
    const { codes, opt, completeClose } = this.model;
    const terminal = createTerminal(opt);
    terminal.show();

    setInterval(() => {
      terminal.processId.then(processId => {
        if (processId) {
          console.log(processId);
        } else {
          window.showInformationMessage('Terminal does not have a process ID');
        }
      });
    }, 300);

    for (const code of codes) {
      const { text, wait } = code;
      await runCmd(terminal, text, wait);
    }

    if (completeClose) {
      disposeTerminal(terminal);
    }
  }
}
