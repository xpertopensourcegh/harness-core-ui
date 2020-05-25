// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface KVO<T = any> {
  [key: string]: T
}

/** Route parameters extracted from URL */
export type URLParams = Readonly<KVO<string | number>>

/** Query parameters extracted from URL */
export type URLQueries = URLParams
