/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import { isEqual } from 'lodash-es'
import { useQueryParams } from './useQueryParams'
import { useUpdateQueryParams } from './useUpdateQueryParams'

/**
 * Works like useState except it reads and sets state in query params
 */

interface UseQueryParamsStateOptions<T> {
  serializer: (data: T) => string
  deserializer: (data: string) => T
}

export function useQueryParamsState<T = unknown>(
  name: string,
  defaultValue: T,
  options: UseQueryParamsStateOptions<T> = {
    serializer: JSON.stringify,
    deserializer: JSON.parse
  }
): [T, (newState: T) => void] {
  const { updateQueryParams } = useUpdateQueryParams()

  const { state } = useQueryParams<{ state: T }>({
    processQueryParams(params) {
      const stateFromQuery = params[name]
      return {
        state: stateFromQuery ? options.deserializer(stateFromQuery) : defaultValue
      }
    }
  })

  const setState: (newState: T) => void = newState => {
    !isEqual(state, newState) && updateQueryParams({ [name]: options.serializer(newState) })
  }

  return [state, setState]
}
