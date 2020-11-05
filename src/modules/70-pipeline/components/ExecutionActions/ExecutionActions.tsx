import React from 'react'
import { Button, Popover, ButtonProps } from '@wings-software/uikit'
import { Menu, MenuItem } from '@blueprintjs/core'
import { Link } from 'react-router-dom'

import { useHandleInterrupt } from 'services/cd-ng'
import { routeCDPipelineStudio } from 'navigation/cd/routes'
import { useToaster } from '@common/exports'
import type { ExecutionStatus } from '@pipeline/utils/statusHelpers'
import { isExecutionComplete, isExecutionInProgress, isExecutionPaused } from '@pipeline/utils/statusHelpers'

import i18n from './ExecutionActions.i18n'
import css from './ExecutionActions.module.scss'

const commonButtonProps: ButtonProps = {
  minimal: true,
  small: true
}

export interface ExecutionActionsProps {
  executionStatus?: ExecutionStatus
  params: {
    orgIdentifier: string
    projectIdentifier: string
    pipelineIdentifier: string
    executionIdentifier: string
    accountId: string
  }
  refetch?(): Promise<void>
}

export default function ExecutionActions(props: ExecutionActionsProps): React.ReactElement {
  const { executionStatus, params } = props
  const { orgIdentifier, executionIdentifier, accountId, projectIdentifier, pipelineIdentifier } = params
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
      // await refetch()
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
      // await refetch()
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
      // await refetch()
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
