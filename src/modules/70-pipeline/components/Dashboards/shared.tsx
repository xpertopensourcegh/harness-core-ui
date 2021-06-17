import React from 'react'
import moment from 'moment'

export function roundNumber(value?: number, precision = 2) {
  if (typeof value !== 'number') {
    return value
  }
  if (Number.isInteger(precision) && precision >= 0) {
    const factor = 10 ** precision
    return Math.round(value * factor) / factor
  }
}

export function formatDuration(value?: number | string) {
  if (typeof value === 'string') {
    value = Number.parseInt(value)
  }
  if (typeof value !== 'number') {
    return
  }
  let signPrefix = undefined
  let h = 0
  let m = 0
  let s = 0
  if (value < 0) {
    signPrefix = '-'
    value = Math.abs(value)
  }
  if (value >= 3600) {
    h = Math.floor(value / 3600)
    value = value % 3600
  }
  if (value >= 60) {
    m = Math.floor(value / 60)
    value = value % 60
  }
  s = value

  if (h > 0) {
    // truncate seconds for large intervals
    s = 0
  }

  const labelStyle = {
    fontSize: '0.7em',
    marginRight: '0.2em'
  }
  return (
    <>
      {signPrefix}
      {h > 0 && (
        <span>
          {h}
          <span style={labelStyle}>h</span>
        </span>
      )}
      {m > 0 && (
        <span style={{ fontSize: h > 0 ? '0.8em' : '1em' }}>
          {m}
          <span style={labelStyle}>m</span>
        </span>
      )}
      {s > 0 && (
        <span style={{ fontSize: m > 0 ? '0.8em' : '1em' }}>
          {s}
          <span style={labelStyle}>s</span>
        </span>
      )}
    </>
  )
}

export function diffStartAndEndTime(startTime?: number, endTime?: number): string | undefined {
  if (startTime && startTime > -1 && endTime && endTime > -1) {
    const diffMins = moment(endTime).diff(startTime, 'minutes')
    if (diffMins === 0) {
      return `${moment(endTime).diff(startTime, 'seconds')}s`
    } else if (diffMins < 180) {
      return `${diffMins}m`
    } else {
      return `${moment(endTime).diff(startTime, 'hours')}h`
    }
  }
}

export type NarrowedCardStatus = 'PENDING' | 'ACTIVE' | 'FAILED' | 'SUCCESS'

export function mapCardStatus(status?: string): NarrowedCardStatus | undefined {
  switch (status) {
    case 'INTERVENTIONWAITING':
    case 'APPROVALWAITING':
    case 'WAITING':
    case 'RESOURCEWAITING':
    case 'NOTSTARTED':
    case 'QUEUED':
    case 'SKIPPED':
      return 'PENDING'
    case 'RUNNING':
    case 'ASYNCWAITING':
    case 'TASKWAITING':
    case 'TIMEDWAITING':
    case 'PAUSED':
    case 'PAUSING':
    case 'DISCONTINUING':
    case 'SUSPENDED':
      return 'ACTIVE'
    case 'FAILED':
    case 'ABORTED':
    case 'EXPIRED':
    case 'IGNOREFAILED':
    case 'ERRORED':
    case 'APPROVALREJECTED':
      return 'FAILED'
    case 'SUCCESS':
      return 'SUCCESS'
  }
}

export function mapActiveCardStatus(status?: string): 'RUNNING' | 'PENDING' | undefined {
  const narrowedStatus = mapCardStatus(status)
  if (narrowedStatus === 'ACTIVE') {
    return 'RUNNING'
  } else if (narrowedStatus === 'PENDING') {
    return 'PENDING'
  }
}
