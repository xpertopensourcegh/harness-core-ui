import { camelCase } from 'lodash-es'
import type { PipelineExecutionSummaryDTO } from 'services/cd-ng'

export type ExecutionStatus = Required<PipelineExecutionSummaryDTO>['executionStatus']

export const EXECUTION_STATUS: readonly ExecutionStatus[] = [
  'Aborted',
  'Expired',
  'Failed',
  'NotStarted',
  'Paused',
  'Queued',
  'Running',
  'Success',
  'Suspended',
  'Waiting',
  'Skipped'
]

const changeCase = (status?: string): string => {
  const temp = camelCase(status)

  return temp.charAt(0).toUpperCase() + temp.slice(1)
}

export function isExecutionRunning(status?: string): boolean {
  return changeCase(status) === 'Running'
}

export function isExecutionFailed(status?: string): boolean {
  return changeCase(status) === 'Failed'
}

export function isExecutionExpired(status?: string): boolean {
  return changeCase(status) === 'Expired'
}

export function isExecutionAborted(status?: string): boolean {
  return changeCase(status) === 'Aborted'
}

export function isExecutionQueued(status?: string): boolean {
  return changeCase(status) === 'Queued'
}

export function isExecutionWaiting(status?: string): boolean {
  return changeCase(status) === 'Waiting'
}

export function isExecutionPaused(status?: string): boolean {
  return changeCase(status) === 'Paused'
}

export function isExecutionNotStarted(status?: string): boolean {
  return changeCase(status) === 'NotStarted'
}

export function isExecutionSuccess(status?: string): boolean {
  return changeCase(status) === 'Success'
}

export function isExecutionSuspended(status?: string): boolean {
  return changeCase(status) === 'Suspended'
}

export function isExecutionComplete(status?: string): boolean {
  return isExecutionSuccess(status) || isExecutionCompletedWithBadState(status)
}

export function isExecutionSkipped(status?: string): boolean {
  return changeCase(status) === 'Skipped'
}

export function isExecutionCompletedWithBadState(status?: string): boolean {
  return (
    isExecutionAborted(status) ||
    isExecutionExpired(status) ||
    isExecutionFailed(status) ||
    isExecutionSuspended(status)
  )
}

export function isExecutionActive(status?: string): boolean {
  return (
    isExecutionPaused(status) ||
    isExecutionRunning(status) ||
    isExecutionNotStarted(status) ||
    isExecutionWaiting(status) ||
    isExecutionQueued(status)
  )
}

export function isExecutionRunningLike(status?: string): boolean {
  return isExecutionRunning(status) || isExecutionPaused(status)
}
