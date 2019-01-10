import * as vscode from 'vscode';
import { isNormalCompleteLog, isLastStr } from './utils';

type Status = 'busy' | 'idle';
type WaitItem = {
  wait_str: string;
  fun: () => void;
};
type Item = {
  terminal: vscode.Terminal;
  status: Status;
  wait_info: WaitItem;
};
const terminal_list: Item[] = [];

export function createTerminal(opt: vscode.TerminalOptions) {
  const { name } = opt;
  let terminal = getIdleTerminalByName(name);
  if (!terminal) {
    terminal = vscode.window.createTerminal(opt);
    terminal_list.unshift({
      terminal,
      status: 'idle',
      wait_info: undefined,
    });
    watchTerminal(terminal);
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

export function getIdleTerminalByName(terminal_name: string) {
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
  cmd: string,
  terminal: vscode.Terminal,
  wait_time: number,
  wait_str: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    for (const item of terminal_list) {
      const { terminal: terminal_item } = item;
      if (terminal !== terminal_item) {
        continue;
      }
      item.status = 'busy';
    }
    terminal.sendText(cmd);
    waitTerminalFinish(terminal, wait_time, wait_str).then(() => {
      resolve();
    });
  });
}

function waitTerminalFinish(
  terminal: vscode.Terminal,
  wait_time: number,
  wait_str: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    for (const item of terminal_list) {
      const { terminal: terminal_item, status } = item;
      if (terminal !== terminal_item) {
        continue;
      }
      if (status === 'idle') {
        return resolve();
      }
      item.wait_info = {
        fun: resolve,
        wait_str,
      };
    }
  });
}

/** 在获得数据过后0.1秒检测最后一个字符是不是terminal_end_str, 如果是就是idle */
function watchTerminal(terminal: vscode.Terminal) {
  let timeout_check_idle;
  let log = '';
  (terminal as any).onDidWriteData(data => {
    for (const item of terminal_list) {
      const { terminal: terminal_item } = item;
      if (terminal !== terminal_item) {
        continue;
      }
      log = data;
      clearTimeout(timeout_check_idle);
      timeout_check_idle = setTimeout(() => {
        const { fun, wait_str } = item.wait_info;
        if (
          (!wait_str && isNormalCompleteLog(log)) ||
          (wait_str && isLastStr(log, wait_str))
        ) {
          item.status = 'idle';
          item.wait_info = undefined;
          fun();
          return;
        }

        log = '';
      }, 0.1);
    }
  });
}
