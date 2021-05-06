import React from 'react'
import { Button } from '@wings-software/uicore'

import type { ResponseConnectorValidationResult, ConnectorInfoDTO } from 'services/cd-ng'
import type { UseGetMockData } from '@common/utils/testUtils'
import useTestConnectionModal from '@connectors/common/useTestConnectionModal/useTestConnectionModal'
import { useStrings } from 'framework/strings'

interface TestConnectionProps {
  refetchConnector: () => Promise<any>
  connector: ConnectorInfoDTO
  url: string
  testConnectionMockData?: UseGetMockData<ResponseConnectorValidationResult>
  className?: string
}
const TestConnection: React.FC<TestConnectionProps> = props => {
  const { openErrorModal } = useTestConnectionModal({
    onClose: () => {
      props.refetchConnector()
    }
  })
  const { getString } = useStrings()
  return (
    <Button
      withoutBoxShadow
      className={props.className}
      text={getString('connectors.stepThreeName')}
      onClick={() => {
        openErrorModal(props.connector, props.url)
      }}
    />
  )
}
export default TestConnection
