import React, { useState } from 'react'
import { StepsProgress, Layout, Button, Text, Intent } from '@wings-software/uikit'
import i18n from './VerifyOutOfClusterDelegate.i18n'
import { useGetDelegatesStatus, RestResponseDelegateStatus } from 'services/portal'
import css from './VerifyOutOfClusterDelegate.module.scss'

interface VerifyOutOfClusterDelegateProps {
  accountId: string
  hideLightModal: () => void
  previousStep?: () => void
  connectorName: string | undefined
  name: string
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

  React.useEffect(() => {
    if (currentStep === 1) {
      if (!loadingStatus && delegateStatus) {
        setDelegateCount(delegateStatus)
        setCurrentStep(2)
        setCurrentIntent(Intent.SUCCESS)
      } else if (!loadingStatus && !delegateStatus) {
        setCurrentIntent(Intent.DANGER)
        setCurrentStatus('ERROR')
      }
    } else if (currentStep === 3) {
      setCurrentStatus('ERROR')
      // Todo: const data = buildKubPayload(props.state.formData)
      // validateCreds(data, state)
    } else if (currentStep > 1 && currentStep < 5) {
      const interval = setInterval(() => setCurrentStep(currentStep + 1), 5000)
      return () => {
        clearInterval(interval)
      }
    }
  }, [loadingStatus, currentStep])
  return (
    <Layout.Vertical padding="small" className={css.outCluster}>
      <Text font="medium" padding="small" className={css.heading}>
        Verify Connection to <span className={css.name}>{props.connectorName}</span>
      </Text>
      <StepsProgress
        steps={[getStepOne(state), i18n.STEPS.TWO, i18n.STEPS.THREE]}
        intent={currentIntent}
        current={currentStep}
        currentStatus={currentStatus}
      />
      {currentStep === 3 && (
        <Text font="small" className={css.verificationText}>
          {i18n.VERIFICATION_TIME_TEXT}
        </Text>
      )}
      {state.validateError?.responseMessages?.[0]?.message && (
        <Text font="small" className={css.validateError}>
          {state.validateError}
        </Text>
      )}

      <Layout.Horizontal spacing="large" className={css.btnWrapper}>
        <Button onClick={() => props.previousStep?.()} text="Back" />
        <Button type="submit" onClick={() => props.hideLightModal()} className={css.submitBtn} text="Close" />
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export default VerifyOutOfClusterDelegate
