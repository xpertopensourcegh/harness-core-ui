import React, { useState, useRef } from 'react'
import { StepsProgress, Layout, Button, Text, Intent, Color } from '@wings-software/uikit'
import { useGetDelegatesStatus, RestResponseDelegateStatus } from 'services/portal'
import { useGetTestConnectionResult } from 'services/cd-ng'
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
}

interface VerifyOutOfClusterDelegateState {
  delegateCount: RestResponseDelegateStatus | null
  setDelegateCount: (val: RestResponseDelegateStatus | null) => void
  currentStep: number
  setCurrentStep: (val: number) => void
  currentIntent: Intent
  setCurrentIntent: (val: Intent) => void
  validateError: RestResponseDelegateStatus | null
  setValidateError: (val: RestResponseDelegateStatus | null) => void
  currentStatus: string
  setCurrentStatus: (status: string) => void
}

const getStepOne = (state: VerifyOutOfClusterDelegateState) => {
  if (state.currentStep > 1) {
    return `${state.delegateCount?.resource?.delegates?.length} delegates found`
  } else {
    return i18n.STEPS.ONE
  }
}

const VerifyOutOfClusterDelegate = (props: VerifyOutOfClusterDelegateProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [currentIntent, setCurrentIntent] = useState<Intent>(Intent.WARNING)
  const [delegateCount, setDelegateCount] = useState({} as RestResponseDelegateStatus | null)
  const [validateError, setValidateError] = useState({} as RestResponseDelegateStatus | null)
  const [currentStatus, setCurrentStatus] = useState('PROCESS')
  const state: VerifyOutOfClusterDelegateState = {
    delegateCount,
    setDelegateCount,
    currentStep,
    setCurrentStep,
    currentIntent,
    setCurrentIntent,
    validateError,
    setValidateError,
    currentStatus,
    setCurrentStatus
  }

  const { loading: loadingStatus, data: delegateStatus } = useGetDelegatesStatus({
    queryParams: { accountId: props.accountId }
  })
  const {
    loading: testingConnection,
    data: testConnectionResponse,
    refetch: reloadTestConnection
  } = useGetTestConnectionResult({
    accountIdentifier: props.accountId,
    connectorIdentifier: props.connectorIdentifier as string,
    lazy: true,
    queryParams: { orgIdentifier: props.orgIdentifier, projectIdentifier: props.projectIdentifier }
  })
  const mounted = useRef(false)
  React.useEffect(() => {
    if (mounted.current && !loadingStatus) {
      if (currentStep === 1) {
        if (delegateStatus) {
          setDelegateCount(delegateStatus)
          setCurrentStatus('DONE')
          setCurrentIntent(Intent.SUCCESS)
          setCurrentStep(2)
          setCurrentStatus('PROCESS')
        }
      } else if (!delegateStatus) {
        setCurrentStatus('ERROR')
        setCurrentIntent(Intent.DANGER)
      }
    }
    if (currentStep === 3) {
      reloadTestConnection()
      if (!testingConnection) {
        if (testConnectionResponse) {
          state.setCurrentIntent(Intent.SUCCESS)
          state.setCurrentStatus('DONE')
          setCurrentStep(4)
        } else if (!testConnectionResponse) {
          state.setCurrentIntent(Intent.DANGER)
          state.setCurrentStatus('ERROR')
        }
      }
    } else if (currentStep === 2) {
      const interval = setInterval(() => {
        setCurrentIntent(Intent.SUCCESS)
        setCurrentStatus('DONE')
        setCurrentStep(currentStep + 1)
        setCurrentStatus('PROCESS')
      }, 10000)
      return () => {
        clearInterval(interval)
      }
    } else {
      mounted.current = true
    }
  }, [loadingStatus, currentStep, delegateStatus])
  return (
    <Layout.Vertical padding="small" height={'100%'}>
      <Layout.Vertical height={'90%'}>
        <Text font="medium" color={Color.GREY_700} padding={{ right: 'small', left: 'small' }}>
          Verify Connection to <span className={css.name}>{props.connectorName}</span>
        </Text>
        <StepsProgress
          steps={[getStepOne(state), i18n.STEPS.TWO, i18n.STEPS.THREE]}
          intent={currentIntent}
          current={currentStep}
          currentStatus={currentStatus}
        />
        {currentStep === 3 && (
          <Text font="small" color={Color.GREY_400} padding="none" width={300}>
            {i18n.VERIFICATION_TIME_TEXT}
          </Text>
        )}
        {state.validateError?.responseMessages?.[0]?.message && (
          <Text font="small" className={css.validateError}>
            {state.validateError}
          </Text>
        )}
      </Layout.Vertical>

      <Layout.Horizontal spacing="large" className={css.btnWrapper}>
        <Button type="submit" onClick={() => props.hideLightModal?.()} className={css.submitBtn} text="Finish" />
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export default VerifyOutOfClusterDelegate
