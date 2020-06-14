import type { ParsedQuery } from 'query-string'

export interface RouteParams {
  params: Readonly<Record<string, string | number | null | undefined> & { accountId: string }>
  query: ParsedQuery
}
