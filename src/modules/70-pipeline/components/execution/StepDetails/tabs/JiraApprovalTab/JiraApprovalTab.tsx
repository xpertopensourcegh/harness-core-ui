import React from 'react'

import type { ApprovalInstanceResponse, JiraApprovalInstanceDetails } from 'services/pipeline-ng'
import { Duration } from '@common/exports'
import { ApprovalStatus } from '@pipeline/utils/approvalUtils'
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
  const wasApproved = !isWaiting && approvalData?.status === ApprovalStatus.APPROVED
  const wasRejected = !isWaiting && approvalData?.status === ApprovalStatus.REJECTED

  const jiraKey = approvalData?.details.issue.key
  const jiraUrl = approvalData?.details.issue.url

  return (
    <React.Fragment>
      <div className={css.info} data-type="jira">
        {isWaiting ? (
          <>
            <div className={css.timer}>
              <Duration
                className={css.duration}
                durationText=""
                icon="hourglass"
                startTime={approvalData?.deadline}
                iconProps={{ size: 8 }}
              />
              <String stringID="pipeline.timeRemainingSuffix" />
            </div>
            {jiraKey && jiraUrl ? (
              <div className={css.jiraTicket}>
                <String stringID="pipeline.jiraApprovalStep.execution.jiraTicket" />

                <a href={jiraUrl} target="_blank" rel="noopener noreferrer">
                  {jiraKey}
                </a>
              </div>
            ) : null}
          </>
        ) : null}
        {wasApproved && jiraUrl && jiraKey ? (
          <div className={css.jiraTicket}>
            <String stringID="pipeline.jiraApprovalStep.execution.wasApproved" />

            <a href={jiraUrl} target="_blank" rel="noopener noreferrer">
              {jiraKey}
            </a>
          </div>
        ) : null}

        {wasRejected && jiraUrl && jiraKey ? (
          <div className={css.jiraTicket}>
            <String stringID="pipeline.jiraApprovalStep.execution.wasRejected" />

            <a href={jiraUrl} target="_blank" rel="noopener noreferrer">
              {jiraKey}
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
