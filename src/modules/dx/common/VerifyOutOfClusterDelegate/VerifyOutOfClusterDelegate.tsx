import React, { useState } from 'react'
import { useParams } from 'react-router'
import ReactTimeago from 'react-timeago'
import { StepsProgress, Layout, Button, Text, Intent, Color, StepProps } from '@wings-software/uikit'
import { useGetDelegatesStatus, RestResponseDelegateStatus } from 'services/portal'
import {
  useGetTestConnectionResult,
  ResponseConnectorValidationResult,
  ConnectorConfigDTO,
  ConnectorConnectivityDetails
} from 'services/cd-ng'
import { getConnectorDisplayName } from 'modules/dx/pages/connectors/utils/ConnectorUtils'
import type { UseGetMockData } from '@common/utils/testUtils'
import type { StepDetails } from 'modules/dx/interfaces/ConnectorInterface'
import { ConnectorStatus } from 'modules/dx/constants'
import i18n from './VerifyOutOfClusterDelegate.i18n'
import css from './VerifyOutOfClusterDelegate.module.scss'

interface VerifyOutOfClusterDelegateProps {
  delegateStatusMockData?: UseGetMockData<RestResponseDelegateStatus>
  testConnectionMockData?: UseGetMockData<ResponseConnectorValidationResult>
  hideLightModal?: () => void
  connectorName?: string
  connectorIdentifier?: string
  name?: string
  onSuccess?: () => void
  renderInModal?: boolean
  setIsEditMode?: () => void
  setLastTested?: (val: number) => void
  setLastConnected?: (val: number) => void
  setStatus?: (val: ConnectorConnectivityDetails['status']) => void
  setTesting?: (val: boolean) => void
  isLastStep?: boolean
  type?: string
}
export interface VerifyOutOfClusterStepProps extends ConnectorConfigDTO {
  isEditMode?: boolean
}

interface VerifyOutOfClusterDelegateState {
  delegateCount: RestResponseDelegateStatus | null
  setDelegateCount: (val: RestResponseDelegateStatus | null) => void

  validateError: RestResponseDelegateStatus | null
  setValidateError: (val: RestResponseDelegateStatus | null) => void

  stepDetails: StepDetails
  setStepDetails: (val: StepDetails) => void
}
export const STEP = {
  CHECK_DELEGATE: 'CHECK_DELEGATE',
  ESTABLISH_CONNECTION: 'ESTABLISH_CONNECTION',
  VERIFY: 'VERIFY'
}
export const StepIndex = new Map([
  [STEP.CHECK_DELEGATE, 1],
  [STEP.ESTABLISH_CONNECTION, 2],
  [STEP.VERIFY, 3]
])

const VerifyOutOfClusterDelegate: React.FC<
  StepProps<VerifyOutOfClusterStepProps> & VerifyOutOfClusterDelegateProps
> = props => {
  const { prevStepData, nextStep, isLastStep = false, renderInModal = false } = props
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const [delegateCount, setDelegateCount] = useState({} as RestResponseDelegateStatus | null)
  const [validateError, setValidateError] = useState({} as RestResponseDelegateStatus | null)
  const [stepDetails, setStepDetails] = useState<StepDetails>({
    step: 1,
    intent: Intent.WARNING,
    status: 'PROCESS'
  })

  const state: VerifyOutOfClusterDelegateState = {
    delegateCount,
    setDelegateCount,
    validateError,
    setValidateError,
    stepDetails,
    setStepDetails
  }

  const { data: delegateStatus, error } = useGetDelegatesStatus({
    queryParams: { accountId: accountId },
    mock: props.delegateStatusMockData
  })
  const { mutate: reloadTestConnection } = useGetTestConnectionResult({
    identifier: props.connectorIdentifier || prevStepData?.identifier || '',
    queryParams: { accountIdentifier: accountId, orgIdentifier: orgIdentifier, projectIdentifier: projectIdentifier },
    mock: props.testConnectionMockData,
    requestOptions: {
      headers: {
        'content-type': 'application/json'
      }
    }
  })

  const getStepOne = () => {
    const count = state.delegateCount?.resource?.delegates?.length
    if (stepDetails.step !== StepIndex.get(STEP.CHECK_DELEGATE)) {
      return i18n.delegateFound(count)
    } else {
      return i18n.STEPS.ONE
    }
  }

  const getStepTwo = () => {
    if (stepDetails.step === StepIndex.get(STEP.ESTABLISH_CONNECTION) && stepDetails.status === 'ERROR') {
      return i18n.STEPS.TWO.FAILED
    } else {
      return i18n.STEPS.TWO.SUCCESS(getConnectorDisplayName(props.type || ''))
    }
  }

  let testConnectionResponse: ResponseConnectorValidationResult
  const executeEstablishConnection = async (): Promise<void> => {
    if (stepDetails.step === StepIndex.get(STEP.ESTABLISH_CONNECTION)) {
      if (stepDetails.status === 'PROCESS') {
        try {
          testConnectionResponse = await reloadTestConnection()
          if (testConnectionResponse?.data?.valid) {
            setStepDetails({
              step: 2,
              intent: Intent.SUCCESS,
              status: 'DONE'
            })
          } else {
            setStepDetails({
              step: 2,
              intent: Intent.DANGER,
              status: 'ERROR'
            })
          }
        } catch (err) {
          setStepDetails({
            step: 2,
            intent: Intent.DANGER,
            status: 'ERROR'
          })
        }
      }
    }
  }
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

    if (stepDetails.step === StepIndex.get(STEP.ESTABLISH_CONNECTION) && stepDetails.status === 'DONE') {
      setStepDetails({
        step: 3,
        intent: Intent.SUCCESS,
        status: 'PROCESS'
      })
    }
    if (stepDetails.step === StepIndex.get(STEP.VERIFY) && stepDetails.status === 'PROCESS') {
      const interval = setInterval(() => {
        setStepDetails({
          step: 3,
          intent: Intent.SUCCESS,
          status: 'DONE'
        })

        props.setStatus?.(ConnectorStatus.SUCCESS)
        props.setLastTested?.(new Date().getTime() || 0)
        props.setLastConnected?.(new Date().getTime() || 0)
      }, 2000)

      return () => {
        clearInterval(interval)
      }
    }
    executeEstablishConnection()

    if (stepDetails.step !== StepIndex.get(STEP.CHECK_DELEGATE) && stepDetails.intent === Intent.DANGER) {
      props.setLastTested?.(new Date().getTime() || 0)
      props.setStatus?.(ConnectorStatus.FAILURE)
    }
  }, [stepDetails, delegateStatus, error])
  return (
    <Layout.Vertical padding="small" height={'100%'}>
      <Layout.Vertical>
        <Text font="medium" color={Color.GREY_700} padding={{ right: 'small', left: 'small' }}>
          {i18n.HEADING} <span className={css.name}>{props.connectorName || prevStepData?.name}</span>
        </Text>

        <StepsProgress
          steps={[getStepOne(), getStepTwo(), i18n.STEPS.THREE]}
          intent={stepDetails.intent}
          current={stepDetails.step}
          currentStatus={stepDetails.status}
        />
        {renderInModal &&
        stepDetails.step === StepIndex.get(STEP.ESTABLISH_CONNECTION) &&
        stepDetails.status === 'PROCESS' ? (
          <Text font="small" className={css.verificationText}>
            {i18n.VERIFICATION_TIME_TEXT}
          </Text>
        ) : null}
        {renderInModal &&
        stepDetails.step === StepIndex.get(STEP.ESTABLISH_CONNECTION) &&
        stepDetails.status === 'ERROR' ? (
          <Button
            intent="primary"
            minimal
            className={css.editCreds}
            text={i18n.EDIT_CREDS}
            onClick={() => {
              props.previousStep?.({ ...prevStepData, isEditMode: true })
              props.setIsEditMode?.() // Remove after removing support from all parent components
            }}
          />
        ) : null}

        {!renderInModal && stepDetails.step === StepIndex.get(STEP.VERIFY) && stepDetails.status === 'DONE' ? (
          <Text padding={{ top: 'small', left: 'large' }}>
            {i18n.LAST_CONNECTED} {<ReactTimeago date={new Date().getTime()} />}
          </Text>
        ) : null}
        {(!renderInModal && stepDetails.step === StepIndex.get(STEP.VERIFY) && stepDetails.status === 'DONE') ||
        stepDetails.intent === Intent.DANGER ? (
          <Layout.Horizontal margin={{ left: 'small' }}>
            <Button
              intent="primary"
              minimal
              padding={{ left: 'large' }}
              margin={{ top: 'small' }}
              text={i18n.RETEST}
              font={{ size: 'small' }}
              onClick={() => {
                setStepDetails({
                  step: 1,
                  intent: Intent.WARNING,
                  status: 'PROCESS'
                })
              }}
            />
            {!renderInModal &&
            ((stepDetails.step === StepIndex.get(STEP.VERIFY) && stepDetails.status === 'DONE') ||
              stepDetails.intent === Intent.DANGER) ? (
              <Button
                intent="primary"
                minimal
                padding={{ left: 'large' }}
                margin={{ top: 'small' }}
                text={i18n.CLOSE}
                font={{ size: 'small' }}
                onClick={() => {
                  props.setTesting?.(false)
                }}
              />
            ) : null}
          </Layout.Horizontal>
        ) : null}
      </Layout.Vertical>
      {isLastStep && stepDetails.step > 1 ? (
        <Layout.Horizontal spacing="large" className={css.btnWrapper}>
          <Button
            onClick={() => {
              props.hideLightModal?.()
              props.onSuccess?.()
            }}
            text={i18n.FINISH}
          />
        </Layout.Horizontal>
      ) : null}

      {!isLastStep && renderInModal ? (
        <Layout.Horizontal spacing="large" className={css.btnWrapper}>
          <Button
            onClick={() => {
              nextStep?.({ ...prevStepData })
            }}
            text={i18n.CONTINUE}
          />
        </Layout.Horizontal>
      ) : null}
    </Layout.Vertical>
  )
}

export default VerifyOutOfClusterDelegate
