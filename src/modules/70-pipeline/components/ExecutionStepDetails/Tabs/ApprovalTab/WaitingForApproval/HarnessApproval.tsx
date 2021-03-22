import React from 'react'
import { Button, FormInput } from '@wings-software/uicore'
import { Formik } from 'formik'

import {
  useGetHarnessApprovalInstanceAuthorization,
  useAddHarnessApprovalActivity,
  ApprovalInstanceResponse,
  HarnessApprovalActivityRequest,
  HarnessApprovalInstanceDetails
} from 'services/pipeline-ng'
import { String } from 'framework/exports'

import { HarnessApprover } from '../ApprovalComplete/HarnessApprover'

import css from '../ApprovalStepDetails.module.scss'

export interface HarnessApprovalProps {
  approvalInstanceId: string
  approvalData: ApprovalInstanceResponse & {
    details: HarnessApprovalInstanceDetails
  }
}

export function HarnessApproval(props: HarnessApprovalProps): React.ReactElement {
  const { approvalInstanceId, approvalData } = props

  const { data: authData } = useGetHarnessApprovalInstanceAuthorization({ approvalInstanceId })
  const { mutate: submitApproval } = useAddHarnessApprovalActivity({ approvalInstanceId })
  const action = React.useRef<HarnessApprovalActivityRequest['action']>('APPROVE')
  const isCurrentUserAuthorized = !authData?.data?.authorized

  async function handleSubmit(data: HarnessApprovalActivityRequest): Promise<void> {
    await submitApproval({ ...data, action: action.current })
  }

  return (
    <div className={css.harnessApproval}>
      {(approvalData.details.approvalActivities || []).map((row, i) => (
        <HarnessApprover key={i} approvalActivity={row} />
      ))}
      {isCurrentUserAuthorized ? (
        <Formik<HarnessApprovalActivityRequest>
          initialValues={{
            approverInputs: (approvalData.details.approverInputs || []).map(({ name, defaultValue }) => ({
              name,
              value: defaultValue || ''
            })),
            comments: '',
            action: 'APPROVE'
          }}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ values, submitForm }) => {
            function handleApproveClick(): void {
              action.current = 'APPROVE'
              submitForm()
            }

            function handleRejectClick(): void {
              action.current = 'REJECT'
              submitForm()
            }

            return (
              <div className={css.inputs}>
                <String tagName="div" className={css.heading} stringID="execution.approvals.inputsTitle" />
                {values.approverInputs?.map((row, i) => (
                  <FormInput.Text key={i} label={row.name} name={`approverInputs[${i}].value`} />
                ))}
                <FormInput.TextArea label="comments" name="comments" />
                <div className={css.actions}>
                  <Button intent="primary" onClick={handleApproveClick}>
                    Approve
                  </Button>
                  <Button icon="cross" onClick={handleRejectClick}>
                    Reject
                  </Button>
                </div>
              </div>
            )
          }}
        </Formik>
      ) : null}
    </div>
  )
}
