import { ShellExecution, Task, tasks, TerminalOptions } from 'vscode';

export function runTask(cmd: string, opt: TerminalOptions): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const { name, cwd: ori_cwd, shellArgs, env } = opt;
    const cwd = ori_cwd as string;
    const task = new Task(
      { type: 'shell' },
      2,
      name,
      cmd,
      new ShellExecution(cmd, {
        cwd,
        shellArgs,
        env,
      }),
    );

    const result = await tasks.executeTask(task);
    tasks.onDidEndTask(event => {
      if (event.execution === result) {
        resolve();
      }
    });
  });
}
