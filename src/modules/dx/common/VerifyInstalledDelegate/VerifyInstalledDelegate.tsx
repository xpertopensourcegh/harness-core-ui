import React, { useState } from 'react'
import { Layout, Button, Text, StepsProgress, Intent, Label, CodeBlock, Select, Icon } from '@wings-software/uikit'
import i18n from './VerifyInstallDelegate.i18n'
import css from './VerifyInstallDelegate.module.scss'
import { useGetDelegatesStatus, useGetDelegatesDownloadUrl } from 'services/portal'

interface VerifyInstalledDelegateProps {
  accountId: string
  name: string
  // ToDo : connectorName:string
}
interface VerifyInstalledDelegateState {
  delegateCount: number
  setDelegateCount: (val: number) => void
  currentStatus: number
  setCurrentStatus: (val: number) => void
  currentIntent: Intent
  setCurrentIntent: (val: Intent) => void
  // validateError: string
  // setValidateError: (val: string) => void
  downloadOverLay: boolean
  setDownloadOverlay: (val: boolean) => void
}

const VerifyInstalledDelegate = (props: VerifyInstalledDelegateProps) => {
  const [currentStatus, setCurrentStatus] = React.useState(1)
  const [currentIntent, setCurrentIntent] = React.useState<Intent>(Intent.WARNING)
  const [delegateCount, setDelegateCount] = React.useState(0)
  // const [validateError, setValidateError] = useState('')
  const [downloadOverLay, setDownloadOverlay] = useState(true)
  const state: VerifyInstalledDelegateState = {
    delegateCount,
    setDelegateCount,
    currentStatus,
    setCurrentStatus,
    currentIntent,
    setCurrentIntent,
    // validateError,
    // setValidateError,
    downloadOverLay,
    setDownloadOverlay
  }
  const { accountId } = props
  const { loading, data: delegateDowloadUrl, refetch: reloadDelegateDownloadUrl } = useGetDelegatesDownloadUrl({
    queryParams: { accountId },
    lazy: true
  })

  const { loading: loadingStatus, data: delegateStatus, refetch: reloadDelegateStatus } = useGetDelegatesStatus({
    queryParams: { accountId },
    lazy: true
  })

  React.useEffect(() => {
    if (currentStatus === 1) {
      if (delegateDowloadUrl) {
        setCurrentStatus(2)
        window.open(delegateDowloadUrl?.resource?.downloadUrl, '_blank')
        state.setCurrentIntent(Intent.SUCCESS)
      } else if (!loading && !delegateDowloadUrl) {
        state.setCurrentIntent(Intent.DANGER)
      }
    }
    if (currentStatus === 3) {
      reloadDelegateStatus()
      if (!loadingStatus && delegateStatus) {
        state.setCurrentIntent(Intent.SUCCESS)
        state.setCurrentStatus(4)
      } else if (!loadingStatus && !delegateStatus) {
        state.setCurrentIntent(Intent.DANGER)
      }
    } else if (currentStatus === 2) {
      setTimeout(() => {
        setCurrentStatus(currentStatus + 1)
      }, 3000)
    }
  }, [currentStatus, loadingStatus, loading])
  return (
    <Layout.Vertical padding="small">
      <Text font="medium" padding="small" className={css.heading}>
        {i18n.verifyConnectionText} <span className={css.name}>Kubernetes</span>
      </Text>
      <StepsProgress
        steps={[i18n.STEPS.ONE, i18n.STEPS.TWO, i18n.STEPS.THREE]}
        intent={currentIntent}
        current={currentStatus}
        currentStatus={'PROCESS'}
      />
      {currentStatus === 3 && (
        <Text font="small" className={css.verificationText}>
          {i18n.VERIFICATION_TIME_TEXT}
        </Text>
      )}
      {/*Todo  {state.validateError?.responseMessages?.[0]?.message && (
        <Text font="small" style={{ color: 'red', padding: 10, width: '95%', margin: 10 }}>
          {state.validateError}
        </Text>
      )} */}
      {downloadOverLay ? (
        <section className={css.stepsOverlay}>
          <Layout.Vertical spacing="xxlarge">
            <Layout.Horizontal>
              <Text font="medium" className={css.installText}>
                {i18n.INSTALL.INSTALL_TEXT}
              </Text>
              <Icon name="cross" onClick={() => state.setDownloadOverlay(false)} />
            </Layout.Horizontal>
            <Layout.Vertical spacing="small">
              <Label>{i18n.INSTALL.SUPPORTED_FORMATS}</Label>
              <Select items={[{ label: 'YAML', value: 'YAML' }]} />
            </Layout.Vertical>
            <Button
              intent="primary"
              large
              text={i18n.INSTALL.DOWNLOAD_BTN_TEXT}
              icon="bring-data"
              onClick={() => {
                reloadDelegateDownloadUrl()
                setTimeout(() => {
                  setCurrentStatus(currentStatus + 1)
                }, 3000)
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
