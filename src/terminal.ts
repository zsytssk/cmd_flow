import * as vscode from 'vscode';

export function createTerminal(opt: vscode.TerminalOptions) {
  const terminal = vscode.window.createTerminal(opt);
  listenerTerminal(terminal);
  return terminal;
}

export function disposeTerminal(terminal: vscode.Terminal) {
  offListener(terminal);
  terminal.dispose();
}

export function runCmd(
  terminal: vscode.Terminal,
  cmd: string,
  wait: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    terminal.sendText(cmd);
    waitTerminalIdle(terminal, wait).then(() => {
      resolve();
    });
  });
}

function waitTerminalIdle(
  terminal: vscode.Terminal,
  wait: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let idle_timeout;
    const listener = data => {
      clearTimeout(idle_timeout);
      idle_timeout = setTimeout(() => {
        resolve();
        offListener(terminal, listener);
      }, wait * 1000);
    };
    addListener(terminal, listener);
  });
}

type Listener = {
  terminal: vscode.Terminal;
  listener: Function;
};
const listeners: Listener[] = [];

function listenerTerminal(terminal: vscode.Terminal) {
  (terminal as any).onDidWriteData(data => {
    for (const item of listeners) {
      const { listener } = item;
      listener(data);
    }
  });
}

function offListener(terminal: vscode.Terminal, listener?: Function) {
  for (let len = listeners.length, i = len - 1; i >= 0; i--) {
    const { listener: i_listener, terminal: i_terminal } = listeners[i];
    if (terminal !== i_terminal) {
      continue;
    }
    if (listener && i_listener !== listener) {
      continue;
    }
    listeners.splice(i, 1);
  }
}

function addListener(terminal: vscode.Terminal, listener: Function) {
  listeners.push({
    terminal,
    listener,
  });
}
