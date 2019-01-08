import * as vscode from 'vscode';
import { terminal_end_str } from '../const';

type Status = 'busy' | 'idle';
type WaitFun = () => void;
type Item = {
  terminal: vscode.Terminal;
  status: Status;
  wait_list: WaitFun[];
};
const terminal_list: Item[] = [];

export function createTerminal(opt: vscode.TerminalOptions) {
  const { name } = opt;
  let terminal = getIdleTerminalByName(name);
  if (!terminal) {
    terminal = vscode.window.createTerminal(opt);
    terminal_list.push({
      terminal,
      status: 'idle',
      wait_list: [],
    });
    watchTerminal(terminal);
  }
  return terminal;
}

export function disposeTerminal(terminal: vscode.Terminal) {
  const len = terminal_list.length;
  for (let i = len - 1; i >= 0; i++) {
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
  for (const item of terminal_list) {
    const { terminal, status } = item;
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

export function runCmd(
  cmd: string,
  terminal: vscode.Terminal,
  wait: number,
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
    waitTerminalFinish(terminal, wait).then(() => {
      resolve();
    });
  });
}

function waitTerminalFinish(
  terminal: vscode.Terminal,
  wait: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    for (const item of terminal_list) {
      const { terminal: terminal_item, status, wait_list } = item;
      if (terminal !== terminal_item) {
        continue;
      }
      if (status === 'idle') {
        resolve();
      }
      wait_list.push(resolve);
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
      log += data;
      clearTimeout(timeout_check_idle);
      timeout_check_idle = setTimeout(() => {
        if (!isLastStr(log)) {
          // log = '';
          return;
        }
        item.status = 'idle';
        const { wait_list } = item;
        for (const fun of wait_list) {
          fun();
        }
        item.wait_list = [];
      }, 0.1);
    }
  });
}

function isLastStr(str: string) {
  if (!str || str.length === 0) {
    return;
  }
  for (const end of terminal_end_str) {
    const index = str.lastIndexOf(end);
    if (index + end.length === str.length) {
      return true;
    }
  }
}
