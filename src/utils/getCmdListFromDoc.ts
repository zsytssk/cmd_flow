import { commands, Range, SymbolInformation, TextDocument } from 'vscode';
import { code_reg_exp, name_reg_exp, opt_reg_exp } from '../const';

export type CmdSymbols = {
  name: string;
  opt_str: string;
  code_str: string;
};

type SymbolInfo = SymbolInformation & {
  range: Range;
};

export async function getCmdListFromDoc(doc): Promise<CmdSymbols[]> {
  const result: CmdSymbols[] = [];
  const symbols = await commands.executeCommand<SymbolInfo[]>(
    'vscode.executeDocumentSymbolProvider',
    doc.uri,
  );
  if (!symbols) {
    return [];
  }

  for (const item of symbols) {
    let { name } = item;
    const name_match = name.match(name_reg_exp);
    name = name_match[1];
    const { opt_str, code_str } = getCmdInfoFromSymbol(doc, item);
    result.push({ name, opt_str, code_str });
  }

  return result;
}

type CmdStrInfo = {
  opt_str: string;
  code_str: string;
};
function getCmdInfoFromSymbol(
  doc: TextDocument,
  symbol: SymbolInfo,
): CmdStrInfo {
  const { range } = symbol;
  const symbol_text = doc.getText(range);
  const opt_match = symbol_text.match(opt_reg_exp);
  const code_match = symbol_text.match(code_reg_exp);

  let code_str: string;
  let opt_str: string;

  if (code_match) {
    code_str = code_match[1];
  }

  /** opt */
  if (opt_match) {
    opt_str = opt_match[1];
  }

  return { code_str, opt_str };
}
