import React from 'react'
import { Button, Popover, ButtonProps } from '@wings-software/uikit'
import { Menu, MenuItem } from '@blueprintjs/core'
import { useParams, Link } from 'react-router-dom'

import { useHandleInterrupt } from 'services/cd-ng'
import {
  isExecutionComplete,
  isExecutionInProgress,
  isExecutionPaused
} from 'modules/cd/pages/execution/ExecutionUtils'
import type { ExecutionPathParams } from 'modules/cd/pages/execution/ExecutionUtils'
import { useToaster } from 'modules/common/exports'
import { routeCDPipelineStudio } from 'modules/cd/routes'
import type { ExecutionStatus } from 'modules/cd/pages/execution/ExecutionUtils'

import i18n from './ExecutionActions.i18n'
import css from './ExecutionActions.module.scss'

const commonButtonProps: ButtonProps = {
  minimal: true,
  small: true
}

export interface ExecutionActionsProps {
  executionStatus?: ExecutionStatus
  refetch(): Promise<void>
}

export default function ExecutionActions(props: ExecutionActionsProps): React.ReactElement {
  const { executionStatus, refetch } = props
  const { orgIdentifier, executionIdentifier, accountId, projectIdentifier, pipelineIdentifier } = useParams<
    ExecutionPathParams
  >()
  const { mutate: interrupt } = useHandleInterrupt({ planExecutionId: executionIdentifier })
  const { showSuccess } = useToaster()

  const canPause = isExecutionInProgress(executionStatus) && !isExecutionPaused(executionStatus)
  const canAbort = isExecutionInProgress(executionStatus)
  const canRerun = isExecutionComplete(executionStatus)
  const canResume = isExecutionPaused(executionStatus)

  async function abortPipleine(): Promise<void> {
    try {
      await interrupt({} as never, {
        queryParams: {
          orgIdentifier,
          accountIdentifier: accountId,
          projectIdentifier,
          interruptType: 'Abort'
        }
      })
      await refetch()
      showSuccess(i18n.abortedMessage)
    } catch (_) {
      //
    }
  }

  async function pausePipleine(): Promise<void> {
    try {
      await interrupt({} as never, {
        queryParams: {
          orgIdentifier,
          accountIdentifier: accountId,
          projectIdentifier,
          interruptType: 'Pause'
        }
      })
      await refetch()
      showSuccess(i18n.pausedMessage)
    } catch (_) {
      //
    }
  }

  async function resumePipleine(): Promise<void> {
    try {
      await interrupt({} as never, {
        queryParams: {
          orgIdentifier,
          accountIdentifier: accountId,
          projectIdentifier,
          interruptType: 'Resume'
        }
      })
      await refetch()
      showSuccess(i18n.resumedMessage)
    } catch (_) {
      //
    }
  }

  return (
    <div className={css.main}>
      {canResume ? <Button icon="play" onClick={resumePipleine} {...commonButtonProps} /> : null}
      {canRerun ? <Button icon="repeat" {...commonButtonProps} /> : null}
      {canPause ? <Button icon="pause" onClick={pausePipleine} {...commonButtonProps} /> : null}
      {canAbort ? <Button icon="stop" onClick={abortPipleine} {...commonButtonProps} /> : null}
      <Popover position="bottom-right" minimal>
        <Button icon="more" {...commonButtonProps} className={css.more} />
        <Menu>
          <Link
            className="bp3-menu-item"
            to={routeCDPipelineStudio.url({ orgIdentifier, projectIdentifier, pipelineIdentifier })}
          >
            Edit Pipeline
          </Link>
          <MenuItem text="Re-run" disabled={!canRerun} />
          <MenuItem text="Pause" onClick={pausePipleine} disabled={!canPause} />
          <MenuItem text="Abort" onClick={abortPipleine} disabled={!canAbort} />
          <MenuItem text="Resume" onClick={resumePipleine} disabled={!canResume} />
          <MenuItem text="Download logs" />
        </Menu>
      </Popover>
    </div>
  )
}
