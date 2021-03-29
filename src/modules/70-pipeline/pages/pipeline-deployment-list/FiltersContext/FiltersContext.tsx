import React from 'react'

import type { FilterDTO } from 'services/pipeline-ng'
import type { QueryParams } from '../types'

export interface FiltersContextValues {
  savedFilters: FilterDTO[]
  isFetchingFilters: boolean
  refetchFilters(): Promise<void>
  queryParams: QueryParams
}

export const FiltersContext = React.createContext<FiltersContextValues>({
  savedFilters: [],
  isFetchingFilters: true,
  refetchFilters: () => Promise.resolve(),
  queryParams: {}
})

export interface FilterContextProviderProps extends FiltersContextValues {
  children: React.ReactNode
}

export function FilterContextProvider(props: FilterContextProviderProps): React.ReactElement {
  const { children, ...rest } = props

  return <FiltersContext.Provider value={rest}>{children}</FiltersContext.Provider>
}

export function useFiltersContext(): FiltersContextValues {
  return React.useContext(FiltersContext)
}
