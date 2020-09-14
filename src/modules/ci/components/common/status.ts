export enum ExecutionStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING'
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
      return 'SUCCESS'
    case ExecutionStatus.FAILED:
      return 'FAILED'
    case ExecutionStatus.IN_PROGRESS:
      return 'IN PROGRESS'
    case ExecutionStatus.PENDING:
      return 'PENDING'
    default:
      return ''
  }
}
