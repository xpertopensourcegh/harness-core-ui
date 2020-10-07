import React from 'react'
import { Button, Popover, ButtonProps } from '@wings-software/uikit'
import { Menu, MenuItem } from '@blueprintjs/core'

import type { PipelineExecutionSummaryDTO } from 'services/cd-ng'

import { isExecutionComplete, isExecutionInProgress, isExecutionPaused } from '../ExecutionUtils'

import css from './ExecutionActions.module.scss'

type ExecutionStatus = PipelineExecutionSummaryDTO['executionStatus']

const commonButtonProps: ButtonProps = {
  minimal: true,
  small: true
}

export interface ExecutionActionsProps {
  executionStatus: ExecutionStatus
}

export default function ExecutionActions(props: ExecutionActionsProps): React.ReactElement {
  const { executionStatus } = props

  const canPause = isExecutionInProgress(executionStatus) && !isExecutionPaused(executionStatus)
  const canAbort = isExecutionInProgress(executionStatus)
  const canRerun = isExecutionComplete(executionStatus)
  const canResume = isExecutionPaused(executionStatus)

  return (
    <div className={css.main}>
      {canResume ? <Button icon="play" {...commonButtonProps} /> : null}
      {canRerun ? <Button icon="repeat" {...commonButtonProps} /> : null}
      {canPause ? <Button icon="pause" {...commonButtonProps} /> : null}
      {canAbort ? <Button icon="stop" {...commonButtonProps} /> : null}
      <Popover position="bottom-right" minimal>
        <Button icon="more" {...commonButtonProps} className={css.more} />
        <Menu>
          <MenuItem text="Edit Pipeline" />
          <MenuItem text="Re-run" disabled={!canRerun} />
          <MenuItem text="Pause" disabled={!canPause} />
          <MenuItem text="Abort" disabled={!canAbort} />
          <MenuItem text="Resume" disabled={!canResume} />
          <MenuItem text="Download logs" />
        </Menu>
      </Popover>
    </div>
  )
}
