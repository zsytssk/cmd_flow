export type RecentItem = {
  name: string;
  group: string;
};
const recent: RecentItem[] = [];
/** 将最近打开的提前 */
export function recentCmdPop<T extends RecentItem>(cmd_list: T[]): T[] {
  return cmd_list.sort((a, b) => {
    const a_index = recent.findIndex(findIndexFun(a));
    const b_index = recent.findIndex(findIndexFun(b));
    return b_index - a_index;
  });
}
export function addToRecent(cmd: RecentItem) {
  const index = recent.findIndex(findIndexFun(cmd));
  if (index !== -1) {
    recent.splice(index, 1);
  }
  recent.push(cmd);
}

function findIndexFun(ori_item: RecentItem) {
  return (item: RecentItem) => {
    return item.group === ori_item.group && item.name === ori_item.name;
  };
}
