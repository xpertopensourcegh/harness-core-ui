import React from 'react'
import { StepWizard } from '@wings-software/uikit'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'
import type { ConnectorRequestBody, ConnectorInfoDTO, ResponseBoolean } from 'services/cd-ng'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { Connectors } from '@connectors/constants'
import StepNexusAuthentication from './StepAuth/StepNexusAuthentication'
import i18n from './CreateNexusConnector.i18n'

interface CreateNexusConnectorProps {
  hideLightModal: () => void
  onConnectorCreated?: (data?: ConnectorRequestBody) => void | Promise<void>
  mock?: ResponseBoolean
}
const CreateNexusConnector: React.FC<CreateNexusConnectorProps> = props => {
  return (
    <>
      <StepWizard<ConnectorInfoDTO>>
        <ConnectorDetailsStep type={Connectors.NEXUS} name={i18n.STEP_ONE.NAME} mock={props.mock} />
        <StepNexusAuthentication name={i18n.STEP_TWO.NAME} onConnectorCreated={props.onConnectorCreated} />
        <VerifyOutOfClusterDelegate
          name={i18n.STEP_THREE.NAME}
          renderInModal={true}
          onSuccess={props.onConnectorCreated}
          isLastStep={true}
          type={Connectors.NEXUS}
          hideLightModal={props.hideLightModal}
        />
      </StepWizard>
    </>
  )
}

export default CreateNexusConnector
