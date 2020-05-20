// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface KVO<T = any> {
  [key: string]: T
}

/** Harness Module Names */
export enum ModuleName {
  CD = 'CD',
  CE = 'CE',
  CI = 'CI',
  CV = 'CV',
  DX = 'DX',
  COMMON = 'COMMON'
}
