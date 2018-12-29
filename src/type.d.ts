type FuncVoid = (...args: any[]) => void;
type Func<T> = (...args: any[]) => T;
type FuncListener = (data: AnyObj) => void;
type AnyObj = { [x: string]: any };
type ValOfObj<T> = T[keyof T];
type PartialAll<T, U> = {
  [p in keyof (T & U)]: p extends keyof T
    ? T[p]
    : p extends keyof U
    ? U[p]
    : never
};
type Point = {
  x: number;
  y: number;
};
declare module '*.json' {
  const value: any;
  export default value;
}

/** 抽取class的属性... */
type ClassProps<T> = { [k in keyof T]?: T[k] extends Function ? never : T[k] };
type Ctor<T> = new (...args) => T;
