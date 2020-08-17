import React, { useState } from 'react'
import ReactTimeago from 'react-timeago'
import { StepsProgress, Layout, Button, Text, Intent, Color } from '@wings-software/uikit'
import { useGetDelegatesStatus, RestResponseDelegateStatus } from 'services/portal'
import { useGetTestConnectionResult } from 'services/cd-ng'
import { useToaster } from 'modules/common/exports'
import type { StepDetails } from 'modules/dx/interfaces/ConnectorInterface'
import i18n from './VerifyOutOfClusterDelegate.i18n'
import css from './VerifyOutOfClusterDelegate.module.scss'

interface VerifyOutOfClusterDelegateProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  hideLightModal?: () => void
  previousStep?: () => void
  connectorName: string | undefined
  connectorIdentifier?: string
  name?: string
  onSuccess?: () => void
  renderInModal: boolean
  setIsEditMode?: () => void
  setLastTested?: (val: number) => void
  setLastConnected?: (val: number) => void
}

interface VerifyOutOfClusterDelegateState {
  delegateCount: RestResponseDelegateStatus | null
  setDelegateCount: (val: RestResponseDelegateStatus | null) => void

  validateError: RestResponseDelegateStatus | null
  setValidateError: (val: RestResponseDelegateStatus | null) => void

  stepDetails: StepDetails
  setStepDetails: (val: StepDetails) => void
}
const TOTAL_STEPS = 3

const STEP = {
  CHECK_DELEGATE: 'CHECK_DELEGATE',
  ESTABLISH_CONNECTION: 'ESTABLISH_CONNECTION',
  VERIFY: 'VERIFY'
}
const StepIndex = new Map([
  [STEP.CHECK_DELEGATE, 1],
  [STEP.ESTABLISH_CONNECTION, 2],
  [STEP.VERIFY, 3]
])

const getStepOne = (state: VerifyOutOfClusterDelegateState) => {
  const count = state.delegateCount?.resource?.delegates?.length
  if (state.stepDetails.step === StepIndex.get(STEP.CHECK_DELEGATE)) {
    return `${count ? count : 'No'} delegates found`
  } else {
    return i18n.STEPS.ONE
  }
}

const VerifyOutOfClusterDelegate = (props: VerifyOutOfClusterDelegateProps) => {
  const [delegateCount, setDelegateCount] = useState({} as RestResponseDelegateStatus | null)
  const [validateError, setValidateError] = useState({} as RestResponseDelegateStatus | null)
  const [stepDetails, setStepDetails] = useState<StepDetails>({
    step: 1,
    intent: Intent.WARNING,
    status: 'PROCESS'
  })
  const { showSuccess } = useToaster()
  const state: VerifyOutOfClusterDelegateState = {
    delegateCount,
    setDelegateCount,
    validateError,
    setValidateError,
    stepDetails,
    setStepDetails
  }

  const { data: delegateStatus, error } = useGetDelegatesStatus({
    queryParams: { accountId: props.accountId }
  })
  const {
    data: testConnectionResponse,
    refetch: reloadTestConnection,
    error: errorTesting
  } = useGetTestConnectionResult({
    accountIdentifier: props.accountId,
    connectorIdentifier: props.connectorIdentifier as string,
    lazy: true,
    queryParams: { orgIdentifier: props.orgIdentifier, projectIdentifier: props.projectIdentifier }
  })

  React.useEffect(() => {
    if (stepDetails.step === StepIndex.get(STEP.CHECK_DELEGATE) && stepDetails.status === 'PROCESS') {
      if (delegateStatus) {
        setDelegateCount(delegateStatus)
        if (delegateStatus.resource?.delegates?.length) {
          setStepDetails({
            step: 1,
            intent: Intent.SUCCESS,
            status: 'DONE'
          })
        } else {
          setStepDetails({
            step: 1,
            intent: Intent.DANGER,
            status: 'ERROR'
          })
        }
      } else if (!delegateStatus && error) {
        setStepDetails({
          step: 1,
          intent: Intent.DANGER,
          status: 'ERROR'
        })
      }
    }

    if (stepDetails.step === StepIndex.get(STEP.CHECK_DELEGATE) && stepDetails.status === 'DONE') {
      setStepDetails({
        step: 2,
        intent: Intent.SUCCESS,
        status: 'PROCESS'
      })
    }
    if (stepDetails.step === StepIndex.get(STEP.ESTABLISH_CONNECTION) && stepDetails.status === 'PROCESS') {
      const interval = setInterval(() => {
        setStepDetails({
          step: 3,
          intent: Intent.SUCCESS,
          status: 'PROCESS'
        })
      }, 2000)

      return () => {
        clearInterval(interval)
      }
    }
    if (stepDetails.step === StepIndex.get(STEP.VERIFY)) {
      if (stepDetails.status === 'PROCESS') {
        reloadTestConnection()
        if (testConnectionResponse) {
          setStepDetails({
            step: 3,
            intent: Intent.SUCCESS,
            status: 'DONE'
          })
        } else if (!testConnectionResponse && errorTesting) {
          setStepDetails({
            step: 3,
            intent: Intent.DANGER,
            status: 'ERROR'
          })
        }
      } else if (stepDetails.status === 'DONE') {
        props.setLastTested?.(new Date().getTime())
        props.setLastConnected?.(new Date().getTime())
      }
    }
    if (stepDetails.intent === Intent.DANGER) {
      props.setLastTested?.(new Date().getTime())
    }
  }, [stepDetails, delegateStatus, testConnectionResponse, error, errorTesting])
  return (
    <Layout.Vertical padding="small" height={'100%'}>
      <Layout.Vertical height={'90%'}>
        <Text font="medium" color={Color.GREY_700} padding={{ right: 'small', left: 'small' }}>
          Verify Connection to <span className={css.name}>{props.connectorName}</span>
        </Text>
        <StepsProgress
          steps={[getStepOne(state), i18n.STEPS.TWO, i18n.STEPS.THREE]}
          intent={stepDetails.intent}
          current={stepDetails.step}
          currentStatus={stepDetails.status}
        />
        {props.renderInModal && stepDetails.step === StepIndex.get(STEP.VERIFY) && stepDetails.status === 'ERROR' ? (
          <Button
            intent="primary"
            minimal
            className={css.editCreds}
            text={i18n.EDIT_CREDS}
            onClick={() => {
              props.setIsEditMode?.()
              props.previousStep?.()
            }}
          />
        ) : null}

        {!props.renderInModal && stepDetails.step === StepIndex.get(STEP.VERIFY) && stepDetails.status === 'DONE' ? (
          <Text padding={{ top: 'small', left: 'large' }}>
            {i18n.LAST_CONNECTED} {<ReactTimeago date={new Date().getTime()} />}
          </Text>
        ) : null}
        {!props.renderInModal && stepDetails.intent === Intent.DANGER ? (
          <Layout.Horizontal>
            <Button
              intent="primary"
              minimal
              text={i18n.RETEST}
              margin={{ top: 'small' }}
              font={{ size: 'small' }}
              onClick={() => {
                setStepDetails({
                  step: 1,
                  intent: Intent.WARNING,
                  status: 'PROCESS'
                })
              }}
            />
          </Layout.Horizontal>
        ) : null}

        {/* Show same in error handler  {state.validateError?.responseMessages?.[0]?.message && (
          <Text font="small" className={css.validateError}>
            {state.validateError}
          </Text>
        )}
         */}
      </Layout.Vertical>
      {props.renderInModal && stepDetails.step === TOTAL_STEPS && stepDetails.status === 'DONE' ? (
        <Layout.Horizontal spacing="large" className={css.btnWrapper}>
          <Button
            type="submit"
            onClick={() => {
              props.hideLightModal?.()
              props.onSuccess?.()
              showSuccess(`Connector '${props.connectorName}' created successfully`)
            }}
            text={i18n.FINISH}
          />
        </Layout.Horizontal>
      ) : null}
    </Layout.Vertical>
  )
}

export default VerifyOutOfClusterDelegate
