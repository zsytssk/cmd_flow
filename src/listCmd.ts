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

const file =
  'file:///D:/zsytssk/other/test/vscode-extension-samples-master/cmd-flow/doc/cmd.md';
export async function getCmdList(): Promise<CmdSymbols> {
  const cur_doc = window.activeTextEditor.document;
  if (cur_doc.languageId !== 'markdown') {
    return [];
  }
  return getCmdListFromDoc(cur_doc);
  // const uri = Uri.parse(file);
  // try {
  //   const doc = await workspace.openTextDocument(uri);
  // } catch (err) {
  //   console.log(err);
  // }
}

type Code = {
  text: string;
  wait: number;
};

type CmdSymbols = {
  name: string;
  opt?: TerminalOptions & { completeClose?: boolean };
  codes: Code[];
}[];

type Symbol = SymbolInformation & {
  range: Range;
};

export async function getCmdListFromDoc(doc): Promise<CmdSymbols> {
  const result: CmdSymbols = [];
  await window.showTextDocument(doc);
  let symbols = await commands.executeCommand<Symbol[]>(
    'vscode.executeDocumentSymbolProvider',
    doc.uri,
  );

  for (let item of symbols) {
    let { name } = item;
    const name_match = name.match(nameRegExp);
    name = name_match[1];
    const { codes, opt } = getCmdInfoFromSymbol(doc, item);
    if (!codes.length && !opt) {
      continue;
    }
    result.push({ name, codes, opt });
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
    const opt = JSON.parse(opt_str);
    result.opt = opt;
  }

  return result;
}
