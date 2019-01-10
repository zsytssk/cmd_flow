export const name_reg_exp = /#+\s+([^#\s]+)/;
export const opt_reg_exp = /```json([^`]+)```/;
export const code_reg_exp = /```bash([^`]+)```/;
export const code_item_reg_exp = /([^\#+]*)(#waitTime\((\d+)\))*(#waitStr\((.+)\))*/;

// tslint:disable-next-line: max-line-length
export const terminal_end_str = ['[0K[32G', '[0K[?25h', '[0K[33G', '[0K[35G', '[0K[3G[?25h', '[0K[5G[?25h'];
export const terminal_end_char = ['>', '$'];

export const extension_name = 'cmdFlow';
