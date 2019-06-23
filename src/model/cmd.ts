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
  generateId,
  sleep,
} from '../utils/utils';
import { CmdGroup, DefaultCmdGroup } from './cmdGroup';
import { Behave, Model } from './dop';

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

export class Cmd extends Model {
  public id: string;
  public name: string;
  public is_task: boolean;
  public opt: TerminalOptions;
  public hide: boolean;
  public no_output: boolean;
  public completeClose: boolean | number;
  public before?: string[];
  public codes?: Code[];
  constructor(top?: Model) {
    super(top);
    this.addBehave(new DefaultCmd(this));
  }
}

export class DefaultCmd extends Behave<Cmd> {
  public generate(info: CmdSymbols) {
    const { name, opt_str, code_str } = info;

    const id = generateId();

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
    this.setData({
      id,
      name,
      is_task,
      codes,
      opt,
      hide,
      before,
      completeClose,
    });
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
    const {
      codes,
      opt,
      completeClose,
      before,
      is_task,
    } = this.model;
    const top: CmdGroup = this.model.closest();

    if (before) {
      const top_behave = top.getBehaveByCtor(
        DefaultCmdGroup,
      );
      for (const item_name of before) {
        await top_behave.executeByName(item_name);
      }
    }
    if (is_task) {
      for (const code of codes) {
        const { text } = code;
        await runTask(text, opt);
      }
      return;
    }

    opt.name = `${opt.name} - ${top.name}`;
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
