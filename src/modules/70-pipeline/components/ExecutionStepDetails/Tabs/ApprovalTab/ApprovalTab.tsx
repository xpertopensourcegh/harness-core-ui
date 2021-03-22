import React from 'react'
import { get } from 'lodash-es'

import type { ExecutionNode } from 'services/cd-ng'
import { useGetApprovalInstance } from 'services/pipeline-ng'
import { isExecutionWaiting } from '@pipeline/utils/statusHelpers'
import type { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'

import { WaitingForApproval } from './WaitingForApproval/WaitingForApproval'
import { ApprovalComplete } from './ApprovalComplete/ApprovalComplete'
import css from './ApprovalStepDetails.module.scss'

export interface ApprovalTabProps {
  step: ExecutionNode
}

export function ApprovalTab(props: ApprovalTabProps): React.ReactElement | null {
  const { step } = props
  const approvalInstanceId = get(step, 'executableResponses[0].async.callbackIds[0]') || ''
  const isWaiting = isExecutionWaiting(step.status)

  const { data: approvalData } = useGetApprovalInstance({ approvalInstanceId })

  if (!approvalData || !approvalData.data) return null

  return (
    <div className={css.approvalTab}>
      {isWaiting ? (
        <WaitingForApproval
          approvalData={approvalData.data}
          approvalInstanceId={approvalInstanceId}
          stepType={step.stepType as StepType}
        />
      ) : (
        <ApprovalComplete approvalData={approvalData.data} stepType={step.stepType as StepType} />
      )}
    </div>
  )
}
