import type { PipelineExecutionSummaryDTO } from 'services/cd-ng'

export type ExecutionStatus = Required<PipelineExecutionSummaryDTO>['executionStatus'] | 'Error'

export function isExecutionRunning(status?: ExecutionStatus): boolean {
  return status === 'Running'
}

export function isExecutionFailed(status?: ExecutionStatus): boolean {
  return status === 'Failed'
}

export function isExecutionExpired(status?: ExecutionStatus): boolean {
  return status === 'Expired'
}

export function isExecutionAborted(status?: ExecutionStatus): boolean {
  return status === 'Aborted'
}

export function isExecutionQueued(status?: ExecutionStatus): boolean {
  return status === 'Queued'
}

export function isExecutionWaiting(status?: ExecutionStatus): boolean {
  return status === 'Waiting'
}

export function isExecutionPaused(status?: ExecutionStatus): boolean {
  return status === 'Paused'
}

export function isExecutionNotStarted(status?: ExecutionStatus): boolean {
  return status === 'NotStarted'
}

export function isExecutionSuccess(status?: ExecutionStatus): boolean {
  return status === 'Success'
}

export function isExecutionSuspended(status?: ExecutionStatus): boolean {
  return status === 'Suspended'
}

export function isExecutionError(status?: ExecutionStatus): boolean {
  return status === 'Error'
}

export function isExecutionComplete(status?: ExecutionStatus): boolean {
  return isExecutionSuccess(status) || isExecutionCompletedWithBadState(status)
}

export function isExecutionCompletedWithBadState(status?: ExecutionStatus): boolean {
  return (
    isExecutionAborted(status) ||
    isExecutionExpired(status) ||
    isExecutionFailed(status) ||
    isExecutionSuspended(status) ||
    isExecutionError(status)
  )
}

export function isExecutionInProgress(status?: ExecutionStatus): boolean {
  return (
    isExecutionPaused(status) ||
    isExecutionRunning(status) ||
    isExecutionNotStarted(status) ||
    isExecutionWaiting(status) ||
    isExecutionQueued(status)
  )
}
