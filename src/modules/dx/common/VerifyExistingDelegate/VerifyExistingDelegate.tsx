import React, { useState } from 'react'
import ReactTimeago from 'react-timeago'
import { useParams } from 'react-router'
import { Layout, Text, StepsProgress, Intent, Button, Color } from '@wings-software/uikit'
import {
  useGetTestConnectionResult,
  ResponseConnectorValidationResult,
  ConnectorConnectivityDetails
} from 'services/cd-ng'
import { useGetDelegatesStatus, RestResponseDelegateStatus, DelegateInner } from 'services/portal'
import type { UseGetMockData } from 'modules/common/utils/testUtils'
import type { StepDetails } from 'modules/dx/interfaces/ConnectorInterface'
import { getConnectorDisplayName } from 'modules/dx/pages/connectors/utils/ConnectorUtils'
import { ConnectorStatus } from 'modules/dx/constants'
import i18n from './VerifyExistingDelegate.i18n'

import css from './VerifyExistingDelegate.module.scss'

interface VerifyExistingDelegateProps {
  delegateStatusMockData?: UseGetMockData<RestResponseDelegateStatus>
  testConnectionMockData?: UseGetMockData<ResponseConnectorValidationResult>
  name?: string
  connectorName: string
  connectorIdentifier: string
  delegateName: string
  hideLightModal?: () => void
  renderInModal?: boolean
  onSuccess?: () => void
  setLastTested?: (val: number) => void
  setLastConnected?: (val: number) => void
  setStatus?: (val: ConnectorConnectivityDetails['status']) => void
  setTesting?: (val: boolean) => void
  type?: string
  setIsEditMode?: () => void
  previousStep?: () => void
}

interface VerifyExistingDelegateState {
  downloadOverLay: boolean
  setDownloadOverlay: (val: boolean) => void
}

const STEP = {
  DELEGATE: 'DELEGATE',
  ESTABLISH_CONNECTION: 'ESTABLISH_CONNECTION',
  VERIFY: 'VERIFY'
}

const StepIndex = new Map([
  [STEP.DELEGATE, 1],
  [STEP.ESTABLISH_CONNECTION, 2],
  [STEP.VERIFY, 3]
])

export const getStepOneForExistingDelegate = (stepDetails: StepDetails, delegateName: string | undefined) => {
  if (stepDetails.step === StepIndex.get(STEP.DELEGATE)) {
    if (stepDetails.status === 'PROCESS') {
      return `${i18n.STEPS.ONE.PROGRESS}: ${delegateName} `
    } else {
      return `${i18n.STEPS.ONE.FAILED}`
    }
  } else {
    return `${i18n.STEPS.ONE.SUCCESS}: ${delegateName} `
  }
}

const VerifyExistingDelegate = (props: VerifyExistingDelegateProps) => {
  const [stepDetails, setStepDetails] = useState<StepDetails>({
    step: 1,
    intent: Intent.WARNING,
    status: 'PROCESS'
  })
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  // Todo: const [foundDelegateName, setFoundDelegateName] = useState('')

  const [downloadOverLay, setDownloadOverlay] = useState(true)
  const state: VerifyExistingDelegateState = {
    downloadOverLay,
    setDownloadOverlay
  }
  const { connectorIdentifier, renderInModal = false } = props

  const { data: delegateStatus, error } = useGetDelegatesStatus({
    queryParams: { accountId },
    mock: props.delegateStatusMockData
  })
  const { mutate: reloadTestConnection } = useGetTestConnectionResult({
    identifier: connectorIdentifier as string,
    queryParams: { accountIdentifier: accountId, orgIdentifier: orgIdentifier, projectIdentifier: projectIdentifier },
    mock: props.testConnectionMockData,
    requestOptions: {
      headers: {
        'content-type': 'application/json'
      }
    }
  })

  const isSelectedDelegateActive = (delegateStatusResponse: RestResponseDelegateStatus) => {
    const delegateList = delegateStatusResponse?.resource?.delegates
    return delegateList?.filter(function (item: DelegateInner) {
      // if (item.delegateName && item.delegateName === props.delegateName) {
      //   setFoundDelegateName(item.delegateName)
      //   return true
      // }
      return item.delegateName && item.delegateName === props.delegateName
    })?.length
  }

  const getStepTwo = () => {
    if (stepDetails.status === 'ERROR') {
      return i18n.STEPS.TWO.FAILED
    } else {
      return i18n.STEPS.TWO.PROGRESS(getConnectorDisplayName(props.type || ''))
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
    if (stepDetails.step === StepIndex.get(STEP.DELEGATE) && stepDetails.status === 'PROCESS') {
      if (delegateStatus) {
        if (isSelectedDelegateActive(delegateStatus)) {
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
    if (stepDetails.step === StepIndex.get(STEP.DELEGATE) && stepDetails.status === 'DONE') {
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

    if (stepDetails.step !== StepIndex.get(STEP.DELEGATE) && stepDetails.intent === Intent.DANGER) {
      props.setLastTested?.(new Date().getTime() || 0)
      props.setStatus?.(ConnectorStatus.FAILURE)
    }
  }, [stepDetails, delegateStatus, error])
  return (
    <Layout.Vertical padding={{ right: 'small', left: 'small' }}>
      <Text font="medium" className={css.heading}>
        {i18n.verifyConnectionText} <span className={css.name}>{props.connectorName}</span>
      </Text>
      <StepsProgress
        steps={[
          getStepOneForExistingDelegate(stepDetails, props.delegateName),
          getStepTwo(),
          i18n.STEPS.THREE.PROGRESS
        ]}
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
          className={css.selectDelegate}
          text={i18n.SELECT_NEW_DELEGATE}
          onClick={() => {
            props.previousStep?.()
            props.setIsEditMode?.()
          }}
        />
      ) : null}
      {renderInModal && downloadOverLay ? (
        <section className={css.stepsOverlay}>
          <Layout.Vertical spacing="xxlarge">
            <Layout.Horizontal className={css.overlayHeading}>
              <Text
                font={{ size: 'medium', weight: 'bold' }}
                color={Color.GREY_700}
                margin={{ top: 6, bottom: 'large' }}
              >
                {i18n.DELEGATE_FOUND}
              </Text>
              <Button icon="cross" minimal onClick={() => state.setDownloadOverlay(false)} />
            </Layout.Horizontal>
            <Layout.Vertical spacing="small">
              <span>Delegate: {props.delegateName}</span>
              {/* change it with values from api  */}
              <span>
                {i18n.Status}:&nbsp;
                {isSelectedDelegateActive(delegateStatus as RestResponseDelegateStatus) ? i18n.ACTIVE : i18n.NOT_ACTIVE}
              </span>
              {/* Todo <span>Sync:</span> */}
            </Layout.Vertical>
          </Layout.Vertical>
        </section>
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
      {renderInModal && stepDetails.step > 1 ? (
        <Layout.Horizontal padding={{ top: 'xxxlarge' }} style={{ position: 'relative', top: '175px' }}>
          <Button
            onClick={() => {
              props.hideLightModal?.()
            }}
            text={i18n.FINISH}
          />
        </Layout.Horizontal>
      ) : null}
    </Layout.Vertical>
  )
}
export default VerifyExistingDelegate
