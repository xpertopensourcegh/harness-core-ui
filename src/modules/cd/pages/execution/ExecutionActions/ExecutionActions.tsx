import React from 'react'
import { Button, Popover } from '@wings-software/uikit'
import { Menu, MenuItem } from '@blueprintjs/core'

import type { PipelineExecutionSummaryDTO } from 'services/cd-ng'

import css from './ExecutionActions.module.scss'

export interface ExecutionActionsProps {
  pipelineExecutionStatus: PipelineExecutionSummaryDTO['executionStatus']
}

export default function ExecutionActions(props: ExecutionActionsProps): React.ReactElement {
  const { pipelineExecutionStatus } = props
  return (
    <div className={css.main}>
      <Button icon="pause" minimal />
      <Button icon="stop" minimal />
      <Popover position="bottom-right" minimal>
        <Button icon="more" minimal className={css.more} />
        <Menu>
          <MenuItem text="Edit Pipeline" />
          <MenuItem text="Run" disabled={pipelineExecutionStatus === 'RUNNING'} />
          <MenuItem text="Re-run" disabled={pipelineExecutionStatus !== 'RUNNING'} />
          <MenuItem text="Pause" disabled={pipelineExecutionStatus !== 'RUNNING'} />
          <MenuItem text="Abort" disabled={pipelineExecutionStatus !== 'RUNNING'} />
          <MenuItem text="Resume" disabled={pipelineExecutionStatus !== 'RUNNING'} />
          <MenuItem text="Download logs" />
        </Menu>
      </Popover>
    </div>
  )
}
