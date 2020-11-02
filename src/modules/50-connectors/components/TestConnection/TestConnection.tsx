import React, { useState } from 'react'
import { Layout, Button } from '@wings-software/uikit'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import VerifyExistingDelegate from '@connectors/common/VerifyExistingDelegate/VerifyExistingDelegate'
import type { ConnectorConnectivityDetails, ResponseConnectorValidationResult } from 'services/cd-ng'
import type { UseGetMockData } from '@common/utils/testUtils'
import type { RestResponseDelegateStatus } from 'services/portal'

import i18n from './TestConnection.i18n'
import css from './TestConnection.module.scss'
interface TestConnectionProps {
  connectorType: string
  connectorName: string
  connectorIdentifier: string
  delegateName?: string
  setLastTested: (val: number) => void
  setLastConnected?: (val: number) => void
  setStatus?: (val: ConnectorConnectivityDetails['status']) => void
  delegateStatusMockData?: UseGetMockData<RestResponseDelegateStatus>
  testConnectionMockData?: UseGetMockData<ResponseConnectorValidationResult>
}
const TestConnection: React.FC<TestConnectionProps> = props => {
  const [testEnabled, setTestEnabled] = useState<boolean>(false)

  return (
    <Layout.Vertical>
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
            delegateStatusMockData={props.delegateStatusMockData}
            testConnectionMockData={props.testConnectionMockData}
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
            delegateStatusMockData={props.delegateStatusMockData}
            testConnectionMockData={props.testConnectionMockData}
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
