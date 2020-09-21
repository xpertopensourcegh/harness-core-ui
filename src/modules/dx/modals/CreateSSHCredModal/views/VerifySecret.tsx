import { Intent, StepsProgress } from '@wings-software/uikit'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SSHKeyValidationMetadata, useValidateSecret } from 'services/cd-ng'
import { useGetDelegatesStatus } from 'services/portal'

import i18n from '../CreateSSHCredModal.i18n'

interface VerifySecretProps {
  validationMetadata?: SSHKeyValidationMetadata
  identifier: string
  onFinish?: (status: Status) => void
}

enum Step {
  ZERO,
  ONE,
  TWO
}

export enum Status {
  WAIT = 'WAIT',
  PROCESS = 'PROCESS',
  DONE = 'DONE',
  ERROR = 'ERROR'
}

const VerifySecret: React.FC<VerifySecretProps> = ({ identifier, validationMetadata, onFinish }) => {
  const { accountId: accountIdentifier, projectIdentifier, orgIdentifier } = useParams()
  const {
    data: delegateStatus,
    loading: loadingDelegateStatus,
    error: delegateStatusError,
    refetch: getDelegatesStatus
  } = useGetDelegatesStatus({
    queryParams: { accountId: accountIdentifier },
    lazy: true
  })
  const { mutate: validateSecret } = useValidateSecret({
    queryParams: { identifier, accountIdentifier, projectIdentifier, orgIdentifier }
  })
  const [currentStep, setCurrentStep] = useState<Step>(Step.ONE)
  const [currentStatus, setCurrentStatus] = useState<Status>(Status.WAIT)
  const [currentIntent, setCurrentIntent] = useState<Intent>(Intent.WARNING)

  useEffect(() => {
    switch (currentStep) {
      case Step.ONE:
        setCurrentStatus(Status.PROCESS)
        setCurrentIntent(Intent.WARNING)
        getDelegatesStatus()
        break
      case Step.TWO:
        setCurrentStatus(Status.PROCESS)
        if (validationMetadata) {
          validateSecret(validationMetadata).then(response => {
            if (response.data?.success) {
              setCurrentStatus(Status.DONE)
              setCurrentIntent(Intent.SUCCESS)
              onFinish?.(currentStatus)
            } else {
              setCurrentStatus(Status.ERROR)
              setCurrentIntent(Intent.DANGER)
              onFinish?.(currentStatus)
            }
          })
        }
        break
    }
  }, [currentStep])

  useEffect(() => {
    if (loadingDelegateStatus) {
      // wait. do nothing
    } else if (delegateStatusError) {
      setCurrentStatus(Status.ERROR)
      setCurrentIntent(Intent.DANGER)
      onFinish?.(currentStatus)
    } else if (delegateStatus) {
      setCurrentStatus(Status.DONE)
      setCurrentIntent(Intent.SUCCESS)
      setCurrentStep(Step.TWO)
    }
  }, [delegateStatus, loadingDelegateStatus, delegateStatusError])

  return (
    <>
      <StepsProgress
        current={currentStep}
        steps={[i18n.verifyStepOne, i18n.verifyStepTwo]}
        currentStatus={currentStatus}
        intent={currentIntent}
      />
    </>
  )
}

export default VerifySecret
