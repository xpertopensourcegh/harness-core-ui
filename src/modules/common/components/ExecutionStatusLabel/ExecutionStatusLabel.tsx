import React from 'react'
import { Text } from '@wings-software/uikit'
import cx from 'classnames'
import type { ExecutionStatus } from 'modules/common/exports'
import i18n from './ExecutionStatusLabel.i18n'
import css from './ExecutionStatusLabel.module.scss'

export const ExecutionStatusLabel: React.FC<{ status: ExecutionStatus; className?: string }> = ({
  status,
  className
}) => {
  const _status = status.toLowerCase().replace(/([-_]\w)/g, g => g[1].toUpperCase())

  return (
    <Text
      inline
      className={cx(css.status, css[_status as keyof typeof css], className)}
      font={{ weight: 'bold', size: 'xsmall' }}
    >
      {i18n[status.toLowerCase() as keyof typeof i18n]}
    </Text>
  )
}
