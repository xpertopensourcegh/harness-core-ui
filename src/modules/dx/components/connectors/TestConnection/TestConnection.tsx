import React, { useState } from 'react'
import { Layout, Button } from '@wings-software/uikit'
import VerifyOutOfClusterDelegate from 'modules/dx/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import VerifyExistingDelegate from 'modules/dx/common/VerfiyExistingDelegate/VerifyExistingDelegate'
import { DelegateTypes } from 'modules/dx/pages/connectors/Forms/KubeFormHelper'
import type { ConnectorConnectivityDetails } from 'services/cd-ng'
import i18n from './TestConnection.i18n'
import css from './TestConnection.module.scss'

interface TestConnectionProps {
  delegateType: string
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  connectorName: string
  connectorIdentifier: string
  delegateName?: string
  setLastTested: (val: number) => void
  setLastConnected?: (val: number) => void
  setStatus?: (val: ConnectorConnectivityDetails) => void
}
const TestConnection: React.FC<TestConnectionProps> = props => {
  const [testEnabled, setTestEnabled] = useState<boolean>(false)

  return (
    <Layout.Vertical padding="xlarge" border={{ left: true }}>
      {testEnabled ? (
        props.delegateType === DelegateTypes.DELEGATE_OUT_CLUSTER ? (
          <VerifyOutOfClusterDelegate
            accountId={props.accountId}
            orgIdentifier={props.orgIdentifier}
            projectIdentifier={props.projectIdentifier}
            connectorName={props.connectorName}
            connectorIdentifier={props.connectorIdentifier}
            renderInModal={false}
            setLastTested={props.setLastTested}
            setLastConnected={props.setLastConnected}
            setStatus={props.setStatus}
          />
        ) : (
          <VerifyExistingDelegate
            accountId={props.accountId}
            orgIdentifier={props.orgIdentifier}
            projectIdentifier={props.projectIdentifier}
            connectorName={props.connectorName}
            connectorIdentifier={props.connectorIdentifier}
            delegateName={props.delegateName}
            setLastTested={props.setLastTested}
            setLastConnected={props.setLastConnected}
          />
        )
      ) : (
        <Button
          className={css.testButton}
          text={i18n.TEST_CONNECTION}
          onClick={() => {
            setTestEnabled(true)
          }}
        />
      )}
    </Layout.Vertical>
  )
}
export default TestConnection
