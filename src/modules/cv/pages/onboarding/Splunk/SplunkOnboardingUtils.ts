import type { SplunkSavedSearch } from '@wings-software/swagger-ts/definitions'
import type { SelectOption } from '@wings-software/uikit'

export function transformQueriesFromSplunk(splunkSavedQueries: SplunkSavedSearch[]): SelectOption[] {
  return !splunkSavedQueries?.length
    ? []
    : splunkSavedQueries
        .filter(query => query?.title && query?.searchQuery)
        .map((query: SplunkSavedSearch) => ({
          label: query.title || '',
          value: query.searchQuery || ''
        }))
}
