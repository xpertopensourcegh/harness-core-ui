import React from 'react'

import { String } from 'framework/exports'
import type { ApprovalInstanceResponse } from 'services/pipeline-ng'
import { Duration } from '@common/exports'
import { StepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'

import { HarnessApproval, HarnessApprovalProps } from './HarnessApproval'
import { JiraApproval } from './JiraApproval'

import css from '../ApprovalStepDetails.module.scss'

export interface WaitingForApprovalProps {
  approvalInstanceId: string
  approvalData: ApprovalInstanceResponse
  stepType: StepType
}

export function WaitingForApproval(props: WaitingForApprovalProps): React.ReactElement {
  const { approvalData, approvalInstanceId, stepType } = props

  return (
    <React.Fragment>
      <div className={css.info}>
        <div className={css.timer}>
          <Duration
            className={css.duration}
            durationText=""
            icon="hourglass"
            startTime={approvalData.deadline}
            iconProps={{ size: 8 }}
          />
          <String stringID="execution.approvals.timeRemainingSuffix" />
        </div>
        <div className={css.reviewMsg}>{approvalData.approvalMessage}</div>
        <String
          tagName="div"
          stringID="execution.approvals.statusMsg"
          vars={{
            count: approvalData.details.approvalActivities?.length || 0,
            total: approvalData.details.approvers?.minimumCount || 1
          }}
        />
      </div>
      {stepType === StepType.HarnessApproval ? (
        <HarnessApproval
          approvalInstanceId={approvalInstanceId}
          approvalData={approvalData as HarnessApprovalProps['approvalData']}
        />
      ) : null}
      {stepType === StepType.JiraApproval ? <JiraApproval /> : null}
    </React.Fragment>
  )
}
