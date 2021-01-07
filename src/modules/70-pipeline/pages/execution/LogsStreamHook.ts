import React from 'react'
import { throttle } from 'lodash-es'
import type { Line, LogStreamQueryParams } from 'services/logs'

// NOTE: We are using custom implementation for loading stream logs
// if we gets this info in DTO we can use it from there
const streamEndpoint = '/gateway/log-service/stream'

/**
 * Load logs using server events.
 *
 * To start/stop loading use setEnableStreaming(true|false),
 */
export const useLogsStream = (
  queryVars?: LogStreamQueryParams | undefined,
  config: {
    maxNumberOfLogs: number
    throttleTime: number
  } = {
    maxNumberOfLogs: -1,
    throttleTime: 1000
  }
): { logs: Line[]; setEnableStreaming: (enable: boolean) => void } => {
  const [logs, setLogs] = React.useState<Line[]>([])
  const [enableStreaming, setEnableStreaming] = React.useState(false)

  React.useEffect(() => {
    const cachedLogs: Line[] = []

    const throttledLogs = throttle(() => {
      if (config.maxNumberOfLogs !== -1) {
        const slicedLogs = cachedLogs.slice(Math.max(cachedLogs.length, config.maxNumberOfLogs), 0)
        setLogs(slicedLogs)
      } else {
        setLogs([...cachedLogs])
      }
    }, config.throttleTime)

    const pushLog = (element: Line): void => {
      cachedLogs.push({
        ...element,
        out: element?.out?.replace(`\n`, '')
      })
    }

    if (enableStreaming) {
      const eventSource = new EventSource(
        `${streamEndpoint}?accountID=${queryVars?.accountID}&key=${queryVars?.key}&X-Harness-Token=${queryVars?.['X-Harness-Token']}`
      )

      if (eventSource) {
        eventSource.onmessage = e => {
          if (e.type === 'error') {
            eventSource.close()
          }

          pushLog(JSON.parse(e.data))
          throttledLogs()
        }

        eventSource.onerror = e => {
          if (e.type === 'error') {
            eventSource.close()
          }
        }
      }

      // cleanup
      return function cleanup() {
        eventSource.close()
        setLogs([])
      }
    }
  }, [queryVars?.key, enableStreaming])

  return { logs, setEnableStreaming }
}
