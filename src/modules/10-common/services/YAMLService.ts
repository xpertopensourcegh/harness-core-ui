import type { SnippetInterface } from '../interfaces/SnippetInterface'

export function fetchSnippets(
  _entityType: string,
  _entitySubType?: string,
  _query?: string
): { error?: any; response?: SnippetInterface[] } | undefined {
  return
}
