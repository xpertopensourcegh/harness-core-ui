import React, { useState } from 'react'
import { useParams } from 'react-router'
import { Layout, Text, StepsProgress, Intent, Button, Color } from '@wings-software/uikit'
import { useGetTestConnectionResult, ResponseDTOConnectorValidationResult } from 'services/cd-ng'
import { useGetDelegatesStatus, RestResponseDelegateStatus, DelegateInner } from 'services/portal'
import type { UseGetMockData } from 'modules/common/utils/testUtils'
import type { StepDetails } from 'modules/dx/interfaces/ConnectorInterface'
import { useToaster } from 'modules/common/exports'
import i18n from './VerifyExistingDelegate.i18n'

import css from './VerifyExistingDelegate.module.scss'

interface VerifyExistingDelegateProps {
  delegateStatusMockData?: UseGetMockData<RestResponseDelegateStatus>
  testConnectionMockData?: UseGetMockData<ResponseDTOConnectorValidationResult>
  name?: string
  connectorName?: string
  connectorIdentifier?: string
  delegateName?: string
  hideLightModal?: () => void
  renderInModal?: boolean
  onSuccess?: () => void
  setLastTested?: (val: number) => void
  setLastConnected?: (val: number) => void
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

const VerifyExistingDelegate = (props: VerifyExistingDelegateProps) => {
  const [stepDetails, setStepDetails] = useState<StepDetails>({
    step: 1,
    intent: Intent.WARNING,
    status: 'PROCESS'
  })
  const { showSuccess } = useToaster()
  const { accountId, projectIdentifier, orgIdentifier } = useParams()

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
  const {
    data: testConnectionResponse,
    refetch: reloadTestConnection,
    error: errorTesting
  } = useGetTestConnectionResult({
    accountIdentifier: accountId,
    connectorIdentifier: connectorIdentifier as string,
    queryParams: { orgIdentifier: orgIdentifier, projectIdentifier: projectIdentifier },
    lazy: true,
    mock: props.testConnectionMockData
  })

  const isSelectedDelegateActive = (delegateStatusResponse: RestResponseDelegateStatus) => {
    const delegateList = delegateStatusResponse?.resource?.delegates
    return delegateList?.filter(function (item: DelegateInner) {
      return item.delegateName === props.delegateName
    })?.length
  }

  const getStepOne = () => {
    // if (stepDetails.step === StepIndex.get(STEP.DELEGATE)) {
    if (stepDetails.status === 'PROCESS') {
      return `${i18n.STEPS.ONE.PPROGRESS}: ${props.delegateName} `
    } else if (stepDetails.status === 'DONE') {
      return `${i18n.STEPS.ONE.SUCCESS}: ${props.delegateName} `
    } else {
      return `${i18n.STEPS.ONE.FAILED}`
    }
    // }
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
          if (testConnectionResponse?.data?.valid) {
            setStepDetails({
              step: 3,
              intent: Intent.SUCCESS,
              status: 'DONE'
            })
          } else {
            setStepDetails({
              step: 3,
              intent: Intent.DANGER,
              status: 'ERROR'
            })
          }
        } else if (!testConnectionResponse && errorTesting) {
          setStepDetails({
            step: 3,
            intent: Intent.DANGER,
            status: 'ERROR'
          })
        }
      } else if (stepDetails.status === 'DONE') {
        props.setLastTested?.(testConnectionResponse?.data?.testedAt || 0)
        props.setLastConnected?.(testConnectionResponse?.data?.testedAt || 0)
      }
    }
    if (stepDetails.intent === Intent.DANGER) {
      props.setLastTested?.(testConnectionResponse?.data?.testedAt || 0)
    }
  }, [stepDetails, delegateStatus, testConnectionResponse, error, errorTesting])
  return (
    <Layout.Vertical padding={{ right: 'small', left: 'small' }}>
      <Text font="medium" className={css.heading}>
        {i18n.verifyConnectionText} <span className={css.name}>{props.connectorName}</span>
      </Text>
      <StepsProgress
        steps={[getStepOne(), i18n.STEPS.TWO.PPROGRESS, i18n.STEPS.THREE.PPROGRESS]}
        intent={stepDetails.intent}
        current={stepDetails.step}
        currentStatus={stepDetails.status}
      />
      {stepDetails.step === StepIndex.get(STEP.VERIFY) && stepDetails.status === 'PROCESS' ? (
        <Text font="small" className={css.verificationText}>
          {i18n.VERIFICATION_TIME_TEXT}
        </Text>
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
                Status:&nbsp;
                {isSelectedDelegateActive(delegateStatus as RestResponseDelegateStatus) ? i18n.ACTIVE : i18n.NOT_ACTIVE}
              </span>
              {/* Todo <span>Sync:</span> */}
            </Layout.Vertical>
          </Layout.Vertical>
        </section>
      ) : null}
      {props.renderInModal ? (
        <Layout.Horizontal padding={{ top: 'xxxlarge' }}>
          <Button
            onClick={() => {
              props.hideLightModal?.()
              props.onSuccess?.()
              showSuccess(`Connector '${props.connectorName}' created successfully`)
            }}
            text={i18n.FINISH}
          />
        </Layout.Horizontal>
      ) : stepDetails.intent === Intent.DANGER ? (
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
          :
        </Layout.Horizontal>
      ) : null}
    </Layout.Vertical>
  )
}
export default VerifyExistingDelegate
