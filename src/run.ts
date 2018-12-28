import { createTerminal, runCmd, disposeTerminal } from './terminal';
import { CmdOPt, Code } from './listCmd';

export async function execCmd(opt: CmdOPt, codes: Code[]) {
  const { completeClose } = opt;
  const terminal = createTerminal(opt);
  terminal.show();
  for (let item of codes) {
    await runCmd(terminal, item.text, item.wait);
  }
  if (completeClose) {
    await disposeTerminal(terminal);
  }
}
