export const name_reg_exp = /#+\s+([^#\s]+)/;
export const opt_reg_exp = /```json([^`]+)```/;
export const code_reg_exp = /```bash([^`]+)```/;
export const code_item_reg_exp = /([^\#+]+)(#waitTime\((\d+)\))*(#waitStr\((.+)\))*/;

export const terminal_end_char = ['>', '\\$'];
export const extension_name = 'cmdFlow';
