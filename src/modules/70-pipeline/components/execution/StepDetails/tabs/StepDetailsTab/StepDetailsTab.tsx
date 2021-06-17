import React from 'react'
import { useLocation } from 'react-router-dom'
import cx from 'classnames'
import type { ResponseMessage } from 'services/cd-ng'
import type { ExecutionNode } from 'services/pipeline-ng'
import { String } from 'framework/strings'
import { ErrorHandler } from '@common/components/ErrorHandler/ErrorHandler'
import { LogsContent } from '@pipeline/components/LogsContent/LogsContent'
import { isExecutionSkipped, isExecutionCompletedWithBadState } from '@pipeline/utils/statusHelpers'
import { StepDetails } from '@pipeline/components/execution/StepDetails/common/StepDetails/StepDetails'

import css from './StepDetailsTab.module.scss'

export interface ExecutionStepDetailsTabProps {
  step: ExecutionNode
}

export function StepDetailsTab(props: ExecutionStepDetailsTabProps): React.ReactElement {
  const { step } = props
  const { pathname, search } = useLocation()

  const logUrl = `${pathname}?${search.replace(/^\?/, '')}&view=log`

  const errorMessage = step?.failureInfo?.message || step.executableResponses?.[0]?.skipTask?.message
  const isFailed = isExecutionCompletedWithBadState(step.status)
  const isSkipped = isExecutionSkipped(step.status)

  return (
    <div className={css.detailsTab}>
      {step.failureInfo?.responseMessages?.length ? (
        <ErrorHandler responseMessages={step.failureInfo?.responseMessages as ResponseMessage[]} />
      ) : errorMessage ? (
        <div className={cx(css.errorMsg, { [css.error]: isFailed, [css.warn]: isSkipped })}>
          <String className={css.title} stringID="errorSummaryText" tagName="div" />
          <p>{errorMessage}</p>
        </div>
      ) : null}
      <StepDetails step={step} />
      <LogsContent mode="step-details" toConsoleView={logUrl} />
    </div>
  )
}
