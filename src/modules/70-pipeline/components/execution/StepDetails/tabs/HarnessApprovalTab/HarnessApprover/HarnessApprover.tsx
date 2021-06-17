import React from 'react'
import { Icon, IconName } from '@wings-software/uicore'
import moment from 'moment'

import type { HarnessApprovalActivity } from 'services/pipeline-ng'
import { String } from 'framework/strings'
import type { StringKeys } from 'framework/strings'
import { Collapse } from '@pipeline/components/execution/StepDetails/common/Collapse/Collapse'

import css from './HarnessApprover.module.scss'

const iconMap: Record<HarnessApprovalActivity['action'], IconName> = {
  APPROVE: 'tick',
  REJECT: 'cross'
}

const statusStringMap: Record<HarnessApprovalActivity['action'], StringKeys> = {
  APPROVE: 'pipeline.approvalStep.status.APPROVE',
  REJECT: 'pipeline.approvalStep.status.REJECT'
}

export interface HarnessApproverProps {
  approvalActivity: HarnessApprovalActivity
}

export function HarnessApprover(props: HarnessApproverProps): React.ReactElement {
  const { approvalActivity } = props

  return (
    <div className={css.approver}>
      <Collapse
        title={
          <React.Fragment>
            <div className={css.approverName}>{approvalActivity.user?.name}</div>
            <div className={css.status} data-status={approvalActivity.action}>
              <Icon name={iconMap[approvalActivity.action]} size={12} />
              <String stringID={statusStringMap[approvalActivity.action]} />
            </div>
            <div className={css.time}>
              {approvalActivity.approvedAt ? moment(approvalActivity.approvedAt).fromNow() : '-'}
            </div>
          </React.Fragment>
        }
        titleContentClassName={css.summary}
      >
        <React.Fragment>
          <String tagName="div" className={css.label} stringID="inputs" />
          <ul className={css.approverInputs}>
            {Array.isArray(approvalActivity.approverInputs) && approvalActivity.approverInputs.length > 0 ? (
              (approvalActivity.approverInputs || []).map((row, i) => (
                <li key={i}>
                  <span>{row.name}:</span>
                  <span>{row.value}</span>
                </li>
              ))
            ) : (
              <String stringID="pipeline.execution.noInputsText" />
            )}
          </ul>
          <String tagName="div" className={css.label} stringID="common.comments" />
          <div className={css.comments}>{approvalActivity.comments || '-'}</div>
        </React.Fragment>
      </Collapse>
    </div>
  )
}
