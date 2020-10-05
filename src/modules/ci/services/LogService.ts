import { throttle } from 'lodash-es'
import React from 'react'

export interface LogResponse {
  args?: any
  level: string
  out: string
  pos: number
  time: string
}

export interface Logs {
  logLevel: string
  createdAt: string
  logLine: string
}

const endpoint = 'https://qb.harness.io/log-service/api'

/**
 * Get Logs from blob
 */

// TODO migrate to useGet restfull react, after demo
export async function getLogsFromBlob(
  accountIdentifier: string,
  orgIdentifier: string,
  projectIdentifier: string,
  buildIdentifier: string,
  stageIdentifier: string,
  stepIdentifier: string,
  setLogs: Function
): Promise<void> {
  try {
    fetch(
      `${endpoint}/accounts/${accountIdentifier}/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds/${buildIdentifier}/logs/${stageIdentifier}/${stepIdentifier}/blob`
    )
      .then(resp => resp.text())
      .then(resp => {
        const lines = resp.split('\n')
        const data = lines.filter(line => line.length > 0).map(line => line && JSON.parse(line))
        const parsedData = data.map((item: LogResponse) => {
          return {
            logLevel: item?.level.toUpperCase(),
            createdAt: item.time,
            logLine: item?.out.replace(`\n`, '')
          }
        })
        setLogs(parsedData)
      })
  } catch (e) {
    // console.log(e);
  }
}

export const useLogs = (
  accountIdentifier: string,
  orgIdentifier: string,
  projectIdentifier: string,
  buildIdentifier: string,
  stageIdentifier: string,
  stepIdentifier: string,
  shouldCall: boolean
) => {
  const [logs, setLogs] = React.useState<Logs[]>([])

  React.useEffect(() => {
    const cachedLogs: Logs[] = []

    const throttledLogs = throttle(() => {
      const slicedLogs = cachedLogs.slice(Math.max(cachedLogs.length - 500, 0))
      setLogs(slicedLogs)
    }, 1000)

    const pushLog = (element: LogResponse): void => {
      cachedLogs.push({
        logLevel: element?.level.toUpperCase(),
        createdAt: element.time,
        logLine: element?.out.replace(`\n`, '')
      })
    }
    const eventSource =
      shouldCall &&
      new EventSource(
        `${endpoint}/accounts/${accountIdentifier}/orgs/${orgIdentifier}/projects/${projectIdentifier}/builds/${buildIdentifier}/logs/${stageIdentifier}/${stepIdentifier}/stream`
      )
    if (shouldCall && eventSource) {
      eventSource.onmessage = e => {
        if (e.type === 'error') {
          eventSource.close()
        }

        pushLog(JSON.parse(e.data))
        throttledLogs()
      }
      eventSource.onerror = e => {
        e.type === 'error' && eventSource.close()
      }
    }
    return function cleanup() {
      eventSource && eventSource.close()
      setLogs([])
    }
  }, [stepIdentifier])

  return [logs]
}
