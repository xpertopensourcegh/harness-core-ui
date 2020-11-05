import React from 'react'
import { ConfirmActionButton, Layout } from '@wings-software/uikit'
import { ExecutionStatus } from '@common/exports'
import type { PipelineExecutionSummaryDTO } from 'services/cd-ng'
import i18n from './ExecutionActionButtons.i18n'
import css from './ExecutionActionButtons.module.scss'

export interface ExecutionActionButtonsProps {
  pipelineExecution: PipelineExecutionSummaryDTO
}

export default function ExecutionActionButtons({
  pipelineExecution
}: ExecutionActionButtonsProps): React.ReactElement | null {
  const status = pipelineExecution.executionStatus as ExecutionStatus

  if (status !== ExecutionStatus.RUNNING) {
    return null
  }

  return (
    <Layout.Horizontal className={css.actionButtons}>
      <ConfirmActionButton
        minimal
        icon="pause"
        title={i18n.title}
        message={i18n.pauseMessage}
        confirmText={i18n.confirm}
        cancelText={i18n.cancel}
      />
      <ConfirmActionButton
        minimal
        icon="stop"
        title={i18n.title}
        message={i18n.stopMessage}
        confirmText={i18n.confirm}
        cancelText={i18n.cancel}
      />
    </Layout.Horizontal>
  )
}
