import { setProps } from '../utils/utils';
import { CmdBehave } from './cmd';
import { CmdGroupBehave } from './cmdGroup';
import { CmdManagerBehave } from './cmdManager';

type State = {
  cmd_behave: CmdBehave;
  cmd_group_behave: CmdGroupBehave;
  cmd_manager_behave: CmdManagerBehave;
};

let is_init = false;
export const state = {} as State;

export function initState() {
  if (is_init) {
    return;
  }
  is_init = true;
  setProps(state, {
    cmd_behave: new CmdBehave(),
    cmd_group_behave: new CmdGroupBehave(),
    cmd_manager_behave: new CmdManagerBehave(),
  });
}
