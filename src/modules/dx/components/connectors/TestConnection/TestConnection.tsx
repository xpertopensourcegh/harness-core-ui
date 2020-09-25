import React, { useState } from 'react'
import { Layout, Button } from '@wings-software/uikit'
import VerifyOutOfClusterDelegate from 'modules/dx/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import VerifyExistingDelegate from 'modules/dx/common/VerifyExistingDelegate/VerifyExistingDelegate'
import type { ConnectorConnectivityDetails } from 'services/cd-ng'
import i18n from './TestConnection.i18n'
import css from './TestConnection.module.scss'

interface TestConnectionProps {
  connectorType: string
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  connectorName: string
  connectorIdentifier: string
  delegateName?: string
  setLastTested: (val: number) => void
  setLastConnected?: (val: number) => void
  setStatus?: (val: ConnectorConnectivityDetails['status']) => void
}
const TestConnection: React.FC<TestConnectionProps> = props => {
  const [testEnabled, setTestEnabled] = useState<boolean>(false)

  return (
    <Layout.Vertical padding="xlarge" border={{ left: true }}>
      {testEnabled ? (
        props.delegateName ? (
          <VerifyExistingDelegate
            connectorName={props.connectorName}
            connectorIdentifier={props.connectorIdentifier}
            delegateName={props.delegateName}
            renderInModal={false}
            setLastTested={props.setLastTested}
            setLastConnected={props.setLastConnected}
            setStatus={props.setStatus}
            type={props.connectorType}
            setTesting={setTestEnabled}
          />
        ) : (
          <VerifyOutOfClusterDelegate
            connectorName={props.connectorName}
            connectorIdentifier={props.connectorIdentifier}
            renderInModal={false}
            setLastTested={props.setLastTested}
            setLastConnected={props.setLastConnected}
            setStatus={props.setStatus}
            type={props.connectorType}
            setTesting={setTestEnabled}
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
