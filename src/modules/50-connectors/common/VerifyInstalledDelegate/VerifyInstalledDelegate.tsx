import React, { useState, useEffect } from 'react'
import { Layout, Button, Text, StepsProgress, Intent, Label, CodeBlock, Select, Color } from '@wings-software/uikit'
import {
  useGetDelegatesStatus,
  useGetDelegatesDownloadUrl,
  RestResponseDelegateStatus,
  DelegateInner
} from 'services/portal'
import { useGetTestConnectionResult, ResponseConnectorValidationResult } from 'services/cd-ng'
import type { StepDetails } from '@connectors/interfaces/ConnectorInterface'
import i18n from './VerifyInstallDelegate.i18n'
import css from './VerifyInstallDelegate.module.scss'

interface VerifyInstalledDelegateProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  name: string
  connectorName?: string
  connectorIdentifier?: string
  delegateName?: string
  profile?: string
  hideLightModal?: () => void
  onSuccess?: () => void
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

const VerifyInstalledDelegate = (props: VerifyInstalledDelegateProps) => {
  const [stepDetails, setStepDetails] = useState<StepDetails>({
    step: 1,
    intent: Intent.WARNING,
    status: 'PROCESS'
  })
  const [downloadOverLay, setDownloadOverlay] = useState(true)

  const { accountId } = props
  const {
    data: delegateDowloadUrl,
    refetch: reloadDelegateDownloadUrl,
    error: errorDownload
  } = useGetDelegatesDownloadUrl({
    queryParams: { accountId },
    lazy: true
  })

  const { data: delegateStatus, refetch: reloadDelegateStatus, error: errorStatus } = useGetDelegatesStatus({
    queryParams: { accountId },
    lazy: true
  })

  const { mutate: reloadTestConnection } = useGetTestConnectionResult({
    identifier: props.connectorIdentifier as string,
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier: props.orgIdentifier,
      projectIdentifier: props.projectIdentifier
    },
    requestOptions: {
      headers: {
        'content-type': 'application/json'
      }
    }
  })

  const isSelectedDelegateActive = (delegateStatusResponse: RestResponseDelegateStatus) => {
    const delegateList = delegateStatusResponse?.resource?.delegates
    return delegateList?.filter(function (item: DelegateInner) {
      return item.delegateName === props.delegateName
    })?.length
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
  let intevalOne: any // Remove
  React.useEffect(() => {
    if (stepDetails.step === StepIndex.get(STEP.DELEGATE) && stepDetails.status === 'PROCESS') {
      if (delegateDowloadUrl) {
        const url = `${delegateDowloadUrl.resource?.kubernetesUrl}&delegateName=${props.delegateName}${
          props.profile ? `&delegateProfileId=${props.profile}` : ''
        }`
        window.open(url, '_blank')
        intevalOne = setInterval(() => {
          reloadDelegateStatus()
        }, 10000)
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
      }, 2000)

      return () => {
        clearInterval(interval)
      }
    }
    executeEstablishConnection()
    return () => {
      clearInterval(intevalOne)
    }
  }, [stepDetails, delegateDowloadUrl, errorDownload])

  useEffect(() => {
    if (delegateStatus) {
      if (isSelectedDelegateActive(delegateStatus)) {
        setStepDetails({
          step: 2,
          intent: Intent.SUCCESS,
          status: 'DONE'
        })
        clearInterval(intevalOne)
      }
    }
    return () => {
      clearInterval(intevalOne)
    }
  }, [delegateStatus, errorStatus])
  return (
    <Layout.Vertical className={css.verifyWrapper}>
      <Text font="medium" className={css.heading}>
        {i18n.verifyConnectionText} <span className={css.name}>{props.connectorName}</span>
      </Text>
      <StepsProgress
        steps={[i18n.STEPS.ONE, i18n.STEPS.TWO, i18n.STEPS.THREE]}
        intent={stepDetails.intent}
        current={stepDetails.step}
        currentStatus={stepDetails.status}
      />
      {stepDetails.step === StepIndex.get(STEP.ESTABLISH_CONNECTION) && stepDetails.status === 'PROCESS' ? (
        <Text font="small" className={css.verificationText}>
          {i18n.VERIFICATION_TIME_TEXT}
        </Text>
      ) : null}
      {stepDetails.intent === Intent.DANGER ? (
        <Layout.Horizontal>
          <Button
            intent="primary"
            minimal
            text={i18n.RETEST}
            margin={{ top: 'small', left: 'small' }}
            font={{ size: 'small' }}
            onClick={() => {
              setStepDetails({
                step: 2,
                intent: Intent.WARNING,
                status: 'PROCESS'
              })
            }}
          />
        </Layout.Horizontal>
      ) : null}
      {downloadOverLay ? (
        <section className={css.stepsOverlay}>
          <Layout.Vertical spacing="xxlarge">
            <Layout.Horizontal className={css.overlayHeading}>
              <Text
                font={{ size: 'medium', weight: 'bold' }}
                margin={{ top: 'xsmall', bottom: 'large' }}
                color={Color.GREY_700}
              >
                {i18n.INSTALL.INSTALL_TEXT}
              </Text>
              <Button icon="cross" minimal onClick={() => setDownloadOverlay(false)} />
            </Layout.Horizontal>
            <Layout.Vertical spacing="small">
              <Label>{i18n.INSTALL.SUPPORTED_FORMATS}</Label>
              <Select items={[{ label: 'YAML', value: 'YAML' }]} value={{ label: 'YAML', value: 'YAML' }} disabled />
            </Layout.Vertical>
            <Button
              intent="primary"
              large
              text={i18n.INSTALL.DOWNLOAD_BTN_TEXT}
              icon="bring-data"
              onClick={() => {
                reloadDelegateDownloadUrl()
              }}
            />
            <Layout.Vertical spacing="large">
              <Text className={css.delegateRunInfo}>{i18n.INSTALL.DELEGATE_RUN_INFO}</Text>
              <CodeBlock allowCopy format="pre" snippet={i18n.INSTALL.COMMAND} />
            </Layout.Vertical>
          </Layout.Vertical>
        </section>
      ) : null}
      {stepDetails.step > 1 ? (
        <Layout.Horizontal spacing="large" className={css.btnWrapper}>
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

export default VerifyInstalledDelegate
