import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import cx from 'classnames'

import type { ExecutionNode } from 'services/pipeline-ng'
import { String, useStrings } from 'framework/exports'
import routes from '@common/RouteDefinitions'
import type { PipelineType, ExecutionPathProps } from '@common/interfaces/RouteInterfaces'
import { LogsContent } from '@pipeline/components/LogsContent/LogsContent'
import { isExecutionSkipped, isExecutionCompletedWithBadState } from '@pipeline/utils/statusHelpers'
import LogsContentOld from '@pipeline/pages/execution/ExecutionPipelineView/ExecutionLogView/LogsContent'

import { StepDetails } from '../Common/StepDetails/StepDetails'

import css from './ExecutionStepDetailsTab.module.scss'

export interface ExecutionStepDetailsTabProps {
  step: ExecutionNode
}

export default function ExecutionStepDetailsTab(props: ExecutionStepDetailsTabProps): React.ReactElement {
  const { step } = props

  const { orgIdentifier, executionIdentifier, pipelineIdentifier, projectIdentifier, accountId, module } = useParams<
    PipelineType<ExecutionPathProps>
  >()

  const { getString } = useStrings()
  const history = useHistory()
  const logUrl = routes.toExecutionPipelineView({
    orgIdentifier,
    executionIdentifier,
    pipelineIdentifier,
    projectIdentifier,
    accountId,
    module
  })

  const redirectToLogView = (): void => {
    history.push(`${logUrl}?view=log`)
  }

  const errorMessage = step?.failureInfo?.message || step.executableResponses?.[0]?.skipTask?.message
  const isFailed = isExecutionCompletedWithBadState(step.status)
  const isSkipped = isExecutionSkipped(step.status)

  return (
    <div className={css.detailsTab}>
      {errorMessage ? (
        <div className={cx(css.errorMsg, { [css.error]: isFailed, [css.warn]: isSkipped })}>
          <String className={css.title} stringID="errorSummaryText" tagName="div" />
          <p>{errorMessage}</p>
        </div>
      ) : null}
      <StepDetails step={step} />
      {module === 'cd' ? (
        <LogsContent mode="step-details" toConsoleView={`${logUrl}?view=log`} />
      ) : (
        <LogsContentOld header={getString('execution.stepLogs')} redirectToLogView={redirectToLogView} />
      )}
    </div>
  )
}
