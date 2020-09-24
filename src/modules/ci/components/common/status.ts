import i18n from './status.i18n'

// TODO: should be replaced with DTO
export enum ExecutionStatus {
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
  ABORTED = 'ABORTED',
  ERROR = 'ERROR',
  PAUSED = 'PAUSED',
  PAUSING = 'PAUSING',
  WAITING = 'WAITING',
  ABORTING = 'ABORTING',
  RUNNING = 'RUNNING',
  QUEUED = 'QUEUED',
  SKIPPED = 'SKIPPED',
  STARTING = 'STARTING',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

/**
 *  Get message depends on status
 *
 * @export
 * @param {Statuses} status
 * @returns {string}
 */
export function status2Message(status: ExecutionStatus): string {
  switch (status) {
    case ExecutionStatus.SUCCESS:
      return i18n.success
    case ExecutionStatus.SUCCEEDED:
      return i18n.succeeded
    case ExecutionStatus.FAILED:
      return i18n.failed
    case ExecutionStatus.RUNNING:
      return i18n.running
    case ExecutionStatus.WAITING:
      return i18n.waiting
    default:
      return status.toString().toUpperCase()
  }
}
