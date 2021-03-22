import React from 'react'

import type { ApprovalInstanceResponse } from 'services/pipeline-ng'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'

export interface ApprovalCompleteProps {
  approvalData: ApprovalInstanceResponse
  stepType: StepType
}

export function ApprovalComplete(props: ApprovalCompleteProps): React.ReactElement {
  return props.stepType === StepType.HarnessApproval ? <div /> : <div />
}
