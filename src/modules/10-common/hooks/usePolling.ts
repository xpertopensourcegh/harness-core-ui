/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import useTabVisible from './useTabVisible'

const DEFAULT_POLLING_INTERVAL_IN_MS = 5_000

interface UsePollingOptions {
  // in milliseconds. Default is 5ms
  pollingInterval?: number
  // startPolling based on a condition Ex: poll only on first page
  startPolling?: boolean
}

/**
 *
 * @param callback a promise returning function that will be called in every pollingInterval, ex: refetch
 * @param options: UsePollingOptions
 *
 * remembers last call and re-poll only after its resolved
 * @returns boolean
 */
export function usePolling(
  callback: () => Promise<void> | undefined,
  { startPolling = false, pollingInterval = DEFAULT_POLLING_INTERVAL_IN_MS }: UsePollingOptions
): boolean {
  const savedCallback = useRef(callback)
  const [isPolling, setIsPolling] = useState(false)
  const tabVisible = useTabVisible()
  // Remember the latest callback if it changes.
  useLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    // Poll only if tab is visible and additional polling condition from component is met
    if (!(tabVisible && startPolling)) {
      return
    }

    // Poll only when the current request is resolved
    if (!isPolling) {
      const timerId = setTimeout(() => {
        setIsPolling(true)
        savedCallback.current()?.finally(() => {
          setIsPolling(false)
        })
      }, pollingInterval)

      return () => clearTimeout(timerId)
    }
  }, [isPolling, pollingInterval, startPolling, tabVisible])

  return isPolling
}
