import {
  commands,
  SymbolInformation,
  Uri,
  workspace,
  window,
  TextDocument,
  Range,
  TerminalOptions,
} from 'vscode';

import { getAllCmdFile } from './utils';

export async function getCmdList(): Promise<CmdSymbols> {
  let result = [];

  const file_info_list = await getAllCmdFile();
  if (!file_info_list.length) {
    window.showInformationMessage(
      'cant find any file for cmdFlow; make sure cmdFlow.globalFile or cmdFlow.workspaceFile are correct!',
    );
    return [];
  }

  for (let item of file_info_list) {
    try {
      const { file, group } = item;
      const uri = Uri.file(file);
      const doc = await workspace.openTextDocument(uri);
      const cmd_list = await getCmdListFromDoc(doc, group);
      result = result.concat(cmd_list);
    } catch (err) {
      console.log(err);
    }
  }
  return result;
}

export type Code = {
  text: string;
  wait: number;
};

type ExternOpt = {
  completeClose?: boolean;
  /** 是否隐藏 */
  hide?: boolean;
  /** 是否先执行其他命令 */
  before?: string[];
};

export type CmdOPt = TerminalOptions & ExternOpt;

type CmdSymbols = {
  name: string;
  group: string;
  opt?: CmdOPt;
  codes: Code[];
}[];

type Symbol = SymbolInformation & {
  range: Range;
};

export async function getCmdListFromDoc(doc, group): Promise<CmdSymbols> {
  const result: CmdSymbols = [];
  let symbols = await commands.executeCommand<Symbol[]>(
    'vscode.executeDocumentSymbolProvider',
    doc.uri,
  );
  if (!symbols) {
    return [];
  }

  for (let item of symbols) {
    let { name } = item;
    const name_match = name.match(nameRegExp);
    name = name_match[1];
    const { codes, opt } = getCmdInfoFromSymbol(doc, item);
    if (!codes.length && !opt) {
      continue;
    }
    result.push({ name, codes, opt, group });
  }

  return result;
}

const nameRegExp = /#+\s+([^#\s]+)/;
const OptRegExp = /```json([^`]+)```/;
const CodeRegExp = /```bash([^`]+)```/;
const CodeItemRegExp = /([^\#+]*)(#wait\((\d+)\))*/;

type CmdInfo = {
  codes: Code[];
  opt?: TerminalOptions;
};
function getCmdInfoFromSymbol(doc: TextDocument, symbol: Symbol): CmdInfo {
  const result = {
    codes: [],
  } as CmdInfo;

  const { range } = symbol;
  const text = doc.getText(range);
  const opt_match = text.match(OptRegExp);
  const code_match = text.match(CodeRegExp);

  if (code_match) {
    const code_str = code_match[1];
    const code_str_arr = code_str.split(/\r?\n/g);
    for (let item of code_str_arr) {
      if (item === '') {
        continue;
      }
      const match_item = item.match(CodeItemRegExp);
      if (!match_item) {
        continue;
      }
      const text = match_item[1];
      const wait = Number(match_item[3]) || 0.5;
      result.codes.push({
        text,
        wait,
      });
    }
  }

  /** opt */
  if (opt_match) {
    const opt_str = opt_match[1];
    try {
      const opt = JSON.parse(opt_str);
      result.opt = opt;
    } catch (err) {
      console.log(err);
    }
  }

  return result;
}
