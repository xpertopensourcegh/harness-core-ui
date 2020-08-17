import React, { useState } from 'react'
import { Layout, Button, Text, StepsProgress, Intent, Label, CodeBlock, Select, Color } from '@wings-software/uikit'
import {
  useGetDelegatesStatus,
  useGetDelegatesDownloadUrl,
  RestResponseDelegateStatus,
  DelegateInner
} from 'services/portal'
import { useGetTestConnectionResult } from 'services/cd-ng'
import type { StepDetails } from 'modules/dx/interfaces/ConnectorInterface'
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

  const {
    data: testConnectionResponse,
    refetch: reloadTestConnection,
    error: errorTesting
  } = useGetTestConnectionResult({
    accountIdentifier: props.accountId,
    connectorIdentifier: props.connectorIdentifier as string,
    queryParams: { orgIdentifier: props.orgIdentifier, projectIdentifier: props.projectIdentifier },
    lazy: true
  })

  const isSelectedDelegateActive = (delegateStatusResponse: RestResponseDelegateStatus) => {
    const delegateList = delegateStatusResponse?.resource?.delegates
    return delegateList?.filter(function (item: DelegateInner) {
      return item.delegateName === props.delegateName
    })?.length
  }

  React.useEffect(() => {
    if (stepDetails.step === StepIndex.get(STEP.DELEGATE) && stepDetails.status === 'PROCESS') {
      if (delegateDowloadUrl) {
        const url = `${delegateDowloadUrl.resource?.downloadUrl}&delegateName=${props.delegateName}${
          props.profile ? `&delegateProfileId=${props.profile}` : ''
        }`
        window.open(url, '_blank')
        setStepDetails({
          step: 1,
          intent: Intent.SUCCESS,
          status: 'DONE'
        })
      } else if (!delegateStatus && errorDownload) {
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
      reloadDelegateStatus()
      if (delegateStatus) {
        if (isSelectedDelegateActive(delegateStatus)) {
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
      } else if (!delegateStatus && errorStatus) {
        setStepDetails({
          step: 2,
          intent: Intent.DANGER,
          status: 'ERROR'
        })
      }
    }

    if (stepDetails.step === StepIndex.get(STEP.ESTABLISH_CONNECTION) && stepDetails.status === 'DONE') {
      setStepDetails({
        step: 3,
        intent: Intent.SUCCESS,
        status: 'PROCESS'
      })
    }

    if (stepDetails.step === StepIndex.get(STEP.VERIFY) && stepDetails.status === 'PROCESS') {
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
    }
  }, [
    stepDetails,
    delegateStatus,
    testConnectionResponse,
    errorStatus,
    errorTesting,
    delegateDowloadUrl,
    errorDownload
  ])
  return (
    <Layout.Vertical className={css.verifyWrapper}>
      <Text font="medium" className={css.heading}>
        {i18n.verifyConnectionText} <span className={css.name}>{props.connectorName}</span>
      </Text>
      <StepsProgress
        steps={[i18n.STEPS.ONE, downloadOverLay ? i18n.STEPS.TWO_HIDDEN : i18n.STEPS.TWO, i18n.STEPS.THREE]}
        intent={stepDetails.intent}
        current={stepDetails.step}
        currentStatus={stepDetails.status}
      />
      {stepDetails.step === StepIndex.get(STEP.VERIFY) && stepDetails.status !== 'DONE' ? (
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
      <Layout.Horizontal spacing="large" className={css.submitWrp}>
        {/* TODO: <Button type="submit" onClick={() => props.hideLightModal} style={{ color: 'var(--blue-500)' }} text="Close" /> */}
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export default VerifyInstalledDelegate
