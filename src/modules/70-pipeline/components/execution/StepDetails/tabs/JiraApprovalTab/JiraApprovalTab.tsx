import React from 'react'

import type { ApprovalInstanceResponse, JiraApprovalInstanceDetails } from 'services/pipeline-ng'
import { Duration } from '@common/exports'
import { String } from 'framework/strings'

export type ApprovalData =
  | (ApprovalInstanceResponse & {
      details: JiraApprovalInstanceDetails
    })
  | null

export interface JiraApprovalTabProps {
  approvalData: ApprovalData
  isWaiting: boolean
}

import { JiraCriteria } from './JiraCriteria/JiraCriteria'
import css from './JiraApprovalTab.module.scss'

export function JiraApprovalTab(props: JiraApprovalTabProps): React.ReactElement {
  const { approvalData, isWaiting } = props

  return (
    <React.Fragment>
      <div className={css.info} data-type="jira">
        {isWaiting ? (
          <div className={css.timer}>
            <Duration
              className={css.duration}
              durationText=""
              icon="hourglass"
              startTime={approvalData?.deadline}
              iconProps={{ size: 8 }}
            />
            <String stringID="execution.approvals.timeRemainingSuffix" />
          </div>
        ) : null}
        {approvalData?.details?.issue ? (
          <div className={css.jiraTicket}>
            <String stringID="execution.approvals.jiraTicket" />
            <a href={approvalData.details.issue.url} target="_blank" rel="noopener noreferrer">
              {approvalData.details.issue.key}
            </a>
          </div>
        ) : null}
      </div>
      <div className={css.jiraApproval}>
        {approvalData?.details?.approvalCriteria ? (
          <JiraCriteria type="approval" criteria={approvalData.details.approvalCriteria} />
        ) : null}
        {approvalData?.details?.rejectionCriteria ? (
          <JiraCriteria type="rejection" criteria={approvalData.details.rejectionCriteria} />
        ) : null}
      </div>
    </React.Fragment>
  )
}
