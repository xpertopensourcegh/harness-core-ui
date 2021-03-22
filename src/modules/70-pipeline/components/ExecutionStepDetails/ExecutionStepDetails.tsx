import React from 'react'
import { Button } from '@wings-software/uicore'

import { useExecutionContext } from '@pipeline/pages/execution/ExecutionContext/ExecutionContext'
import ExecutionLayout from '@pipeline/components/ExecutionLayout/ExecutionLayout'
import { isExecutionWaiting } from '@pipeline/utils/statusHelpers'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'

import { StepDetailTabs } from './StepDetailTabs'
import css from './ExecutionStepDetails.module.scss'

export interface ExecutionStepDetailsProps {
  selectedStep: string
  closeDetails(): void
}

export default function ExecutionStepDetails(props: ExecutionStepDetailsProps): React.ReactElement {
  const { selectedStep, closeDetails } = props
  const { allNodeMap } = useExecutionContext()

  const step = allNodeMap?.[selectedStep] || {}
  const isApprovalStep = step.stepType === StepType.HarnessApproval || step.stepType === StepType.JiraApproval
  const isWaiting = isExecutionWaiting(step.status)

  return (
    <div className={css.main}>
      <div className={css.header}>
        <div className={css.title}>Step: {step.name}</div>
        {isApprovalStep && isWaiting ? (
          <Button minimal small>
            Refresh
          </Button>
        ) : null}
        <div className={css.actions}>
          <ExecutionLayout.Toggle />
          <Button minimal icon="cross" onClick={closeDetails} />
        </div>
      </div>
      <StepDetailTabs step={step} />
    </div>
  )
}
