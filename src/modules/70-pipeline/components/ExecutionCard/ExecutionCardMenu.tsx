import React, { useCallback } from 'react'
import * as BP from '@blueprintjs/core'
import { useHistory } from 'react-router-dom'
import type { PipelineExecutionSummaryDTO } from 'services/cd-ng'
import { ExecutionStatus } from '@common/exports'
import { routeCDPipelineStudio } from 'navigation/cd/routes'
import { useRouteParams } from 'framework/exports'
import i18n from './ExecutionCardMenu.i18n'

export interface ExecutionCardMenuProps {
  pipelineExecution: PipelineExecutionSummaryDTO
}

const FinishedExecutionStatus = [
  ExecutionStatus.FAILED,
  ExecutionStatus.SUCCESS,
  ExecutionStatus.ABORTED,
  ExecutionStatus.ERROR,
  ExecutionStatus.REJECTED,
  ExecutionStatus.EXPIRED
]

export const ExecutionCardMenu: React.FC<ExecutionCardMenuProps> = ({ pipelineExecution }) => {
  const {
    params: { orgIdentifier, projectIdentifier }
  } = useRouteParams()
  const { pipelineIdentifier } = pipelineExecution
  const history = useHistory()
  const gotoPipelineStudio = useCallback(() => {
    history.push(
      routeCDPipelineStudio.url({
        orgIdentifier: orgIdentifier as string,
        projectIdentifier: projectIdentifier as string,
        pipelineIdentifier: pipelineIdentifier as string
      })
    )
  }, [orgIdentifier, projectIdentifier, pipelineIdentifier, history])
  const status = pipelineExecution.executionStatus as ExecutionStatus

  return (
    <BP.Menu>
      {FinishedExecutionStatus.indexOf(status) !== -1 && <BP.Menu.Item text={i18n.rerun} />}
      <BP.Menu.Item text={i18n.editPipeline} onClick={gotoPipelineStudio} />
      <BP.Menu.Item text={i18n.otherDeployments} />
      <BP.Menu.Item text={i18n.pinAsBaselineForCV} disabled />
      {/* {status === ExecutionStatus.RUNNING && (
        <>
          <BP.Menu.Item text={i18n.pause} />
          <BP.Menu.Item text={i18n.stop} />
        </>
      )} */}
    </BP.Menu>
  )
}
