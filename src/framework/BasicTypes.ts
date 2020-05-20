/*
 * Basic type definitions which are common for Framework and Modules.
 * Keep this file minimal. If it has more than 500 lines of code, something is wrong.
 */

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
