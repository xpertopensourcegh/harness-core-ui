import React from 'react'
import { Layout, Button } from '@wings-software/uicore'

import type { ResponseConnectorValidationResult } from 'services/cd-ng'
import type { UseGetMockData } from '@common/utils/testUtils'
import useTestConnectionModal from '@connectors/common/useTestConnectionModal/useTestConnectionModal'
import type { ConnectorInfoDTO } from 'services/cv'
import i18n from './TestConnection.i18n'
import css from './TestConnection.module.scss'

interface TestConnectionProps {
  connectorType: ConnectorInfoDTO['type']
  refetchConnector: () => Promise<any>
  connectorIdentifier: string
  url: string
  testConnectionMockData?: UseGetMockData<ResponseConnectorValidationResult>
}
const TestConnection: React.FC<TestConnectionProps> = props => {
  const { openErrorModal } = useTestConnectionModal({
    onClose: () => {
      props.refetchConnector()
    }
  })
  return (
    <Layout.Vertical>
      <Button
        className={css.testButton}
        text={i18n.TEST_CONNECTION}
        onClick={() => {
          openErrorModal(props.connectorIdentifier, props.connectorType, props.url)
        }}
      />
    </Layout.Vertical>
  )
}
export default TestConnection
