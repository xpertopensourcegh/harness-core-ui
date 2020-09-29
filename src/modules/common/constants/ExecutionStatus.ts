export enum ExecutionStatus {
  /* Success */
  SUCCESS = 'SUCCESS',

  /* Failure*/
  FAILED = 'FAILED',
  ABORTED = 'ABORTED',
  ERROR = 'ERROR',
  REJECTED = 'REJECTED',

  /** Running */
  PAUSED = 'PAUSED',
  PAUSING = 'PAUSING',
  WAITING = 'WAITING',
  ABORTING = 'ABORTING',
  RUNNING = 'RUNNING',

  /** Not Running, expired */
  QUEUED = 'QUEUED',
  SKIPPED = 'SKIPPED',
  STARTING = 'STARTING',
  NOT_STARTED = 'NOT_STARTED',
  EXPIRED = 'EXPIRED'
}
