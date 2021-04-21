import React from 'react'
import { Text } from '@wings-software/uicore'
import cx from 'classnames'

import type { ExecutionStatus } from '@pipeline/utils/statusHelpers'
import { useStrings } from 'framework/strings'
import type { StringKeys } from 'framework/strings'

import css from './ExecutionStatusLabel.module.scss'

const stringsMap: Record<ExecutionStatus, StringKeys> = {
  Aborted: 'pipeline.executionStatus.Aborted',
  Running: 'pipeline.executionStatus.Running',
  Failed: 'pipeline.executionStatus.Failed',
  NotStarted: 'pipeline.executionStatus.NotStarted',
  Expired: 'pipeline.executionStatus.Expired',
  Queued: 'pipeline.executionStatus.Queued',
  Paused: 'pipeline.executionStatus.Paused',
  Waiting: 'pipeline.executionStatus.Waiting',
  Skipped: 'pipeline.executionStatus.Skipped',
  Success: 'pipeline.executionStatus.Success',
  Suspended: 'pipeline.executionStatus.Suspended',
  Pausing: 'pipeline.executionStatus.Pausing',
  ApprovalRejected: 'pipeline.executionStatus.ApprovalRejected'
}

export interface ExecutionStatusLabelProps {
  status?: ExecutionStatus
  className?: string
}

export default function ExecutionStatusLabel({
  status,
  className
}: ExecutionStatusLabelProps): React.ReactElement | null {
  const { getString } = useStrings()
  if (!status) return null

  return (
    <Text
      inline
      className={cx(css.status, css[status.toLowerCase() as keyof typeof css], className)}
      font={{ weight: 'bold', size: 'xsmall' }}
    >
      {getString(stringsMap[status])}
    </Text>
  )
}
