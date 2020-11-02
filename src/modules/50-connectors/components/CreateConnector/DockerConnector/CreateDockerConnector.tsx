import React from 'react'
import { StepWizard } from '@wings-software/uikit'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'
import type { ConnectorRequestBody, ConnectorInfoDTO } from 'services/cd-ng'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { Connectors } from '@connectors/constants'
import StepDockerAuthentication from './StepAuth/StepDockerAuthentication'
import i18n from './CreateDockerConnector.i18n'

interface CreateDockerConnectorProps {
  hideLightModal: () => void
  onConnectorCreated?: (data?: ConnectorRequestBody) => void | Promise<void>
}
const CreateDockerConnector: React.FC<CreateDockerConnectorProps> = props => {
  return (
    <>
      <StepWizard<ConnectorInfoDTO>>
        <ConnectorDetailsStep type={Connectors.DOCKER} name={i18n.STEP_ONE.NAME} />
        <StepDockerAuthentication name={i18n.STEP_TWO.NAME} onConnectorCreated={props.onConnectorCreated} />
        <VerifyOutOfClusterDelegate
          name={i18n.STEP_THREE.NAME}
          renderInModal={true}
          isLastStep={true}
          type={Connectors.DOCKER}
          hideLightModal={props.hideLightModal}
        />
      </StepWizard>
    </>
  )
}

export default CreateDockerConnector
