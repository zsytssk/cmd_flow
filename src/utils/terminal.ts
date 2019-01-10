import * as vscode from 'vscode';
import {
  Code,
  isLastStr,
  isNormalCompleteLog,
} from './utils';

type Status = 'busy' | 'idle';
type WaitItem = {
  code: Code;
  fun: () => void;
};
type Item = {
  terminal: vscode.Terminal;
  status: Status;
  wait_info: WaitItem;
};
const terminal_list: Item[] = [];

export function createTerminal(
  opt: vscode.TerminalOptions,
) {
  const { name } = opt;
  let terminal = getIdleTerminalByName(name);
  if (!terminal) {
    terminal = vscode.window.createTerminal(opt);
    const item: Item = {
      terminal,
      status: 'idle',
      wait_info: undefined,
    };
    terminal_list.unshift(item);
    watchTerminal(item);
  }
  return terminal;
}

export function disposeTerminal(terminal: vscode.Terminal) {
  const len = terminal_list.length;
  for (let i = len - 1; i >= 0; i--) {
    const { terminal: terminal_item } = terminal_list[i];
    if (terminal !== terminal_item) {
      continue;
    }
    terminal.dispose();
    terminal_list.splice(i, 1);
  }
}

export function getIdleTerminalByName(
  terminal_name: string,
) {
  if (!terminal_name) {
    return;
  }
  const terminals = vscode.window.terminals;
  for (const item of terminal_list) {
    const { terminal, status } = item;
    if (!terminals || terminals.indexOf(terminal) === -1) {
      disposeTerminal(terminal);
      return;
    }

    const { name } = terminal;
    if (status !== 'idle') {
      continue;
    }
    if (name !== terminal_name) {
      continue;
    }
    return terminal;
  }
}

export type TerminalItem = {
  terminal: vscode.Terminal;
  name: string;
  group: string;
};
export function getActiveTerminals() {
  const len = terminal_list.length;
  const terminals = vscode.window.terminals;
  const result: TerminalItem[] = [];
  for (let i = len - 1; i >= 0; i--) {
    const { terminal } = terminal_list[i];
    if (!terminals || terminals.indexOf(terminal) === -1) {
      disposeTerminal(terminal);
      continue;
    }
    result.unshift({
      terminal,
      name: terminal.name,
      group: 'active terminal',
    });
  }
  return result;
}

export function runCmd(
  terminal: vscode.Terminal,
  code: Code,
): Promise<void> {
  return new Promise((resolve, reject) => {
    for (const item of terminal_list) {
      const { terminal: terminal_item } = item;
      const { text } = code;
      if (terminal !== terminal_item) {
        continue;
      }
      terminal.sendText(text);
      if (terminal !== terminal_item) {
        continue;
      }
      item.wait_info = {
        code,
        fun: resolve,
      };
    }
  });
}

/** 在获得数据过后0.1秒检测最后一个字符是不是terminal_end_str, 如果是就是idle */
function watchTerminal(item: Item) {
  let timeout_check_idle;
  let log = '';
  const { terminal } = item;
  (terminal as any).onDidWriteData(data => {
    const { wait_info } = item;
    log += data;

    if (!wait_info) {
      return;
    }

    const { fun, code } = wait_info;
    const { text, wait_str, no_output } = code;
    /** 只有当前运行的　cmd, 出现在terminal的log中, 才开始监听
     * password 不会 output 就不会有这些信息
     */
    if (item.status === 'idle') {
      if (!no_output && !logHasStr(log, text)) {
        return;
      }
      item.status = 'busy';
    }

    clearTimeout(timeout_check_idle);
    timeout_check_idle = setTimeout(() => {
      if (item.status === 'idle' || !isEnd(log, wait_str)) {
        log = '';
        return;
      }

      item.status = 'idle';
      item.wait_info = undefined;
      fun();
    }, 0.1);
  });
}

function isEnd(log: string, wait_str: string) {
  if (
    (!wait_str && isNormalCompleteLog(log)) ||
    (wait_str && isLastStr(log, wait_str))
  ) {
    return true;
  }
  return false;
}

/** 检测log中是否包含test_str被空格分离的所有item
 * 因为:> 命令行中输出字符会在中间加上一大堆乱七八糟的东西
 * 我也不知道是什么鬼, 也许是高亮的提示...
 */
function logHasStr(log: string, test_str: string) {
  const str_arr = test_str.split(' ');
  for (const item of str_arr) {
    if (log.indexOf(item) === -1) {
      return false;
    }
  }
  return true;
}
