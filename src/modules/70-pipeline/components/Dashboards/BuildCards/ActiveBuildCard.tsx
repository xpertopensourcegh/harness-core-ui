import React, { useMemo } from 'react'
import { Container, Text, Icon, Color } from '@wings-software/uicore'
import classnames from 'classnames'
import type { ExecutionStatus } from '@pipeline/utils/statusHelpers'
import { useStrings } from 'framework/strings'
import { stringsMap } from '@pipeline/components/ExecutionStatusLabel/ExecutionStatusLabel'
import pendingIcon from './PendingApproval.svg'
import { mapToExecutionStatus } from '../shared'
import styles from './BuildCards.module.scss'
export interface ActiveBuildCardProps {
  title: string
  message: string
  icon?: React.ReactNode
  status?: string
}

export default function ActiveBuildCard({ title, message, icon, status }: ActiveBuildCardProps) {
  const { getString } = useStrings()
  const executionStatus = useMemo(() => mapToExecutionStatus(status), [status])
  return (
    <Container className={styles.activeBuildCard}>
      {icon || <Icon name="ci-active-build" className={styles.buildIcon} />}
      <Container className={styles.titleAndMessage}>
        <Text className={styles.title} margin={{ bottom: 'xsmall' }} color={Color.BLACK} lineClamp={1}>
          {title}
        </Text>
        <Text style={{ fontSize: 'var(--ci-font-size-small)' }} color={Color.BLACK} lineClamp={1}>
          {message}
        </Text>
      </Container>
      <Container>
        {status && (
          <div
            className={classnames(styles.statusLabel, {
              [styles.runningLabel]: status === 'RUNNING',
              [styles.pendingLabel]: status !== 'RUNNING'
            })}
          >
            {status === 'RUNNING' ? (
              <Icon size={10} style={{ color: 'var(--ci-color-blue-400)' }} name="spinner" />
            ) : (
              <img src={pendingIcon} alt="" />
            )}
            {getString(stringsMap[executionStatus as ExecutionStatus] || 'pipeline.executionStatus.Unknown')}
          </div>
        )}
      </Container>
    </Container>
  )
}
