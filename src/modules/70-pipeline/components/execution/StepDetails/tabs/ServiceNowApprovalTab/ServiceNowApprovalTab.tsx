import React from 'react'

import { FontVariation, Text } from '@wings-software/uicore'
import type { ApprovalInstanceResponse, ServiceNowApprovalInstanceDetails } from 'services/pipeline-ng'
import { Duration } from '@common/exports'
import { ApprovalStatus } from '@pipeline/utils/approvalUtils'
import { String } from 'framework/strings'

export type ApprovalData =
  | (ApprovalInstanceResponse & {
      details: ServiceNowApprovalInstanceDetails
    })
  | null

export interface ServiceNowApprovalTabProps {
  approvalData: ApprovalData
  isWaiting: boolean
}

import { ServiceNowCriteria } from './ServiceNowCriteria/ServiceNowCriteria'
import css from './ServiceNowApprovalTab.module.scss'

export function ServiceNowApprovalTab(props: ServiceNowApprovalTabProps): React.ReactElement {
  const { approvalData, isWaiting } = props
  const wasApproved = !isWaiting && approvalData?.status === ApprovalStatus.APPROVED
  const wasRejected =
    !isWaiting && (approvalData?.status === ApprovalStatus.REJECTED || approvalData?.status === ApprovalStatus.EXPIRED)
  const wasFailed = !isWaiting && approvalData?.status === ApprovalStatus.FAILED
  const serviceNowKey = approvalData?.details.ticket.key
  const serviceNowUrl = approvalData?.details.ticket.url

  return (
    <React.Fragment>
      <div className={css.info} data-type="serviceNow">
        {wasFailed ? (
          <Text font={{ variation: FontVariation.FORM_MESSAGE_WARNING }}>
            <String stringID="failed" />
          </Text>
        ) : null}
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
            {serviceNowKey && serviceNowUrl ? (
              <div className={css.serviceNowTicket}>
                <String stringID="pipeline.serviceNowApprovalStep.execution.serviceNowTicket" />

                <a href={serviceNowUrl} target="_blank" rel="noopener noreferrer">
                  {serviceNowKey}
                </a>
              </div>
            ) : null}
          </>
        ) : null}
        {wasApproved && serviceNowUrl && serviceNowKey ? (
          <div className={css.serviceNowTicket}>
            <String stringID="pipeline.serviceNowApprovalStep.execution.wasApproved" />

            <a href={serviceNowUrl} target="_blank" rel="noopener noreferrer">
              {serviceNowKey}
            </a>
          </div>
        ) : null}

        {wasRejected && serviceNowUrl && serviceNowKey ? (
          <div className={css.serviceNowTicket}>
            {approvalData?.status === ApprovalStatus.REJECTED ? (
              <String stringID="pipeline.serviceNowApprovalStep.execution.wasRejected" />
            ) : null}
            {approvalData?.status === ApprovalStatus.EXPIRED ? (
              <String stringID="pipeline.serviceNowApprovalStep.execution.wasExpired" />
            ) : null}
            <a href={serviceNowUrl} target="_blank" rel="noopener noreferrer">
              {serviceNowKey}
            </a>
          </div>
        ) : null}
      </div>
      <div className={css.serviceNowApproval}>
        {approvalData?.details?.approvalCriteria ? (
          <ServiceNowCriteria type="approval" criteria={approvalData.details.approvalCriteria} />
        ) : null}
        {approvalData?.details?.rejectionCriteria ? (
          <ServiceNowCriteria type="rejection" criteria={approvalData.details.rejectionCriteria} />
        ) : null}
      </div>
    </React.Fragment>
  )
}
