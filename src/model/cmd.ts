import { TerminalOptions } from 'vscode';
import { CmdSymbols } from '../utils/getCmdListFromDoc';
import { runTask } from '../utils/task';
import {
  createTerminal,
  disposeTerminal,
  runCmd,
} from '../utils/terminal';
import {
  analysisCodeStr,
  Code,
  setProps,
  sleep,
} from '../utils/utils';
import { Cmd, CmdGroup } from './model';
import { state } from './state';

export type CmdOPt = TerminalOptions & {
  completeClose?: boolean;
  /** 是否隐藏(is hide terminal when run cmd) */
  hide?: boolean;
  /** 是否先执行其他命令 (is run other cmd before) */
  before?: string[];
  /** 是否通过task来执行  (is run cmd through task just like workbench.action.tasks.runTask) */
  is_task?: boolean;
};

export type CmdInfo = { id: string; name: string };

export type Code = Code;

export class CmdBehave {
  public generate(info: CmdSymbols) {
    const { name, opt_str, code_str } = info;
    const cmd = this.createCmd(name);

    let opt: CmdOPt = {};
    try {
      opt = JSON.parse(opt_str);
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.log(err);
    }
    const { hide, before, completeClose, is_task } = opt;

    let codes: Code[] = [];
    if (code_str) {
      codes = analysisCodeStr(code_str);
    }

    opt = {
      name,
      ...opt,
    };

    setProps(cmd, {
      name,
      is_task,
      codes,
      opt,
      hide,
      before,
      completeClose,
    });

    return cmd;
  }
  private createCmd(name: string) {
    const cmd = new Cmd();
    setProps(cmd, { name });
    return cmd;
  }
  public getInfo(model: Cmd): CmdInfo {
    const { id, name, hide } = model;
    if (hide) {
      return;
    }
    return {
      id,
      name,
    };
  }
  public async execute(model: Cmd, group: CmdGroup) {
    const {
      codes,
      opt,
      completeClose,
      before,
      is_task,
    } = model;

    const { cmd_group_behave } = state;

    if (before) {
      for (const item_name of before) {
        await cmd_group_behave.executeByName(item_name);
      }
    }
    if (is_task) {
      for (const code of codes) {
        const { text } = code;
        await runTask(text, opt);
      }
      return;
    }

    opt.name = `${opt.name} - ${group.name}`;
    const terminal = await createTerminal(opt);
    for (const code of codes) {
      await runCmd(terminal, code);
    }

    if (!completeClose) {
      return;
    }
    if (typeof completeClose === 'number') {
      await sleep(completeClose);
    }
    disposeTerminal(terminal);
  }
}
