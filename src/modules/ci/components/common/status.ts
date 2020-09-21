import i18n from './status.i18n'

// TODO: should be replaced with DTO
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
      return i18n.success
    case ExecutionStatus.FAILED:
      return i18n.failed
    case ExecutionStatus.IN_PROGRESS:
      return i18n.inProgress
    case ExecutionStatus.PENDING:
      return i18n.pending
    default:
      return ''
  }
}
