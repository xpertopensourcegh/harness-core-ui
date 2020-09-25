//
// TODO: These statuses are not finalized yet.
// They should come from cd-ng service.
//
export enum ExecutionStatus {
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
