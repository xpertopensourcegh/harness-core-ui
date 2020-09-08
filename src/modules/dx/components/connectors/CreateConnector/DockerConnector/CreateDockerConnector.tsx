import React from 'react'
import { StepWizard } from '@wings-software/uikit'
import ConnectorDetailsStep from 'modules/dx/components/connectors/CreateConnector/commonSteps/ConnectorDetailsStep'
import type { ConnectorConfigDTO, ConnectorRequestDTO } from 'services/cd-ng'
import VerifyOutOfClusterDelegate from 'modules/dx/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { Connectors } from 'modules/dx/constants'
import StepDockerAuthentication from './StepAuth/StepDockerAuthentication'
import i18n from './CreateDockerConnector.i18n'

interface CreateDockerConnectorProps {
  hideLightModal: () => void
  onConnectorCreated?: (data?: ConnectorConfigDTO) => void | Promise<void>
}
const CreateDockerConnector: React.FC<CreateDockerConnectorProps> = props => {
  return (
    <>
      <StepWizard<ConnectorRequestDTO>>
        <ConnectorDetailsStep type={Connectors.DOCKER} name={i18n.STEP_ONE.NAME} />
        <StepDockerAuthentication name={i18n.STEP_TWO.NAME} />
        <VerifyOutOfClusterDelegate
          name={i18n.STEP_THREE.NAME}
          renderInModal={true}
          onSuccess={props.onConnectorCreated}
          isLastStep={true}
          type={Connectors.DOCKER}
        />
      </StepWizard>
    </>
  )
}

export default CreateDockerConnector
