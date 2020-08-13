import React, { useState } from 'react'
import { Layout, Text, StepsProgress, Intent, Icon, Button } from '@wings-software/uikit'
import { useGetTestConnectionResult } from 'services/cd-ng'
import { useGetDelegatesStatus, RestResponseDelegateStatus, DelegateInner } from 'services/portal'
import i18n from './VerifyExistingDelegate.i18n'

import css from './VerifyExistingDelegate.module.scss'

interface VerifyExistingDelegateProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  name?: string
  connectorName?: string
  connectorIdentifier?: string
  delegateName?: string
  hideLightModal?: () => void
  renderInModal?: boolean
}

interface VerifyExistingDelegateState {
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

const VerifyExistingDelegate = (props: VerifyExistingDelegateProps) => {
  const [currentStatus, setCurrentStatus] = React.useState(1)
  const [currentIntent, setCurrentIntent] = React.useState<Intent>(Intent.WARNING)
  const [delegateCount, setDelegateCount] = React.useState(0)
  // const [validateError, setValidateError] = useState('')
  const [downloadOverLay, setDownloadOverlay] = useState(true)
  const state: VerifyExistingDelegateState = {
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
  const { accountId, connectorIdentifier, renderInModal = false } = props

  const { loading: loadingStatus, data: delegateStatus, refetch: reloadDelegateStatus } = useGetDelegatesStatus({
    queryParams: { accountId },
    lazy: true
  })
  const {
    loading: testingConnection,
    data: testConnectionResponse,
    refetch: reloadTestConnection
  } = useGetTestConnectionResult({
    accountIdentifier: accountId,
    connectorIdentifier: connectorIdentifier as string,
    queryParams: { orgIdentifier: props.orgIdentifier, projectIdentifier: props.projectIdentifier }
  })

  const isSelectedDelegateActive = (delegateStatusResponse: RestResponseDelegateStatus) => {
    const delegateList = delegateStatusResponse?.resource?.delegates
    return delegateList?.filter(function (item: DelegateInner) {
      return item.delegateName === props.delegateName
    })?.length
  }

  const getStepOne = () => {
    if (currentStatus > 1) {
      return `${i18n.STEPS.ONE.SUCCESS}: ${props.delegateName} `
    } else {
      return i18n.STEPS.ONE.PPROGRESS
    }
  }
  React.useEffect(() => {
    if (currentStatus === 1) {
      reloadDelegateStatus()
      if (!loadingStatus && delegateStatus) {
        const isDelegateActive = isSelectedDelegateActive(delegateStatus)
        if (isDelegateActive) {
          state.setCurrentIntent(Intent.SUCCESS)
          state.setCurrentStatus(2)
        } else {
          state.setCurrentIntent(Intent.DANGER)
        }
      } else if (!loadingStatus && !delegateStatus) {
        state.setCurrentIntent(Intent.DANGER)
      }
    }
    if (currentStatus === 3) {
      reloadTestConnection()
      if (!testingConnection && testConnectionResponse) {
        state.setCurrentIntent(Intent.SUCCESS)
        state.setCurrentStatus(4)
      } else if (!testingConnection && !testConnectionResponse) {
        state.setCurrentIntent(Intent.DANGER)
      }
    } else if (currentStatus === 2) {
      setTimeout(() => {
        setCurrentStatus(currentStatus + 1)
      }, 3000)
    }
  }, [currentStatus, loadingStatus])
  return (
    <Layout.Vertical className={css.verifyWrapper}>
      <Text font="medium" padding="small" className={css.heading}>
        {i18n.verifyConnectionText} <span className={css.name}>{props.connectorName}</span>
      </Text>
      <StepsProgress
        steps={[getStepOne(), i18n.STEPS.TWO.PPROGRESS, i18n.STEPS.THREE.PPROGRESS]}
        intent={currentIntent}
        current={currentStatus}
        currentStatus={'PROCESS'}
      />
      {currentStatus === 3 && (
        <Text font="small" className={css.verificationText}>
          {i18n.VERIFICATION_TIME_TEXT}
        </Text>
      )}
      {/*Todo: {state.validateError?.responseMessages?.[0]?.message && (
          <Text font="small" style={{ color: 'red', padding: 10, width: '95%', margin: 10 }}>
            {state.validateError}
          </Text>
        )} */}
      {renderInModal && downloadOverLay ? (
        <section className={css.stepsOverlay}>
          <Layout.Vertical spacing="xxlarge">
            <Layout.Horizontal className={css.overlayHeading}>
              <Text font="medium" className={css.installText}>
                {i18n.DELEGATE_FOUND}
              </Text>
              <Icon name="cross" onClick={() => state.setDownloadOverlay(false)} />
            </Layout.Horizontal>
            <Layout.Vertical spacing="small">
              <span>Delegate: {props.delegateName}</span>
              {/* change it with values from api  */}
              <span>Status: Active</span>
              {/* Todo <span>Sync:</span> */}
            </Layout.Vertical>
          </Layout.Vertical>
        </section>
      ) : null}
      {currentStatus > 3 ? (
        <Layout.Horizontal spacing="large" className={css.submitWrp}>
          <Button type="submit" onClick={() => props.hideLightModal?.()} color={`var(--blue-500)`} text="Finish" />
        </Layout.Horizontal>
      ) : null}
    </Layout.Vertical>
  )
}
export default VerifyExistingDelegate
