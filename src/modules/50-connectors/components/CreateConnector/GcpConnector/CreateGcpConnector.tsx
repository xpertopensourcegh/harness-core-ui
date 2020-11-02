import React from 'react'
import { StepWizard } from '@wings-software/uikit'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'
import type { ConnectorConfigDTO, ConnectorInfoDTO, ResponseBoolean } from 'services/cd-ng'
import { Connectors } from '@connectors/constants'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import GcpAuthentication from './StepAuth/GcpAuthentication'
import i18n from './CreateGcpConnector.i18n'

interface CreateGCPConnectorProps {
  hideLightModal: () => void
  onConnectorCreated?: (data?: ConnectorConfigDTO) => void | Promise<void>
  mock?: ResponseBoolean
}

const CreateGcpConnector: React.FC<CreateGCPConnectorProps> = props => {
  return (
    <>
      <StepWizard<ConnectorInfoDTO>>
        <ConnectorDetailsStep type={Connectors.GCP} name={i18n.STEP_ONE.NAME} mock={props.mock} />
        <GcpAuthentication name={i18n.STEP_TWO.NAME} isEditMode={false} onConnectorCreated={props.onConnectorCreated} />
        <VerifyOutOfClusterDelegate
          name={i18n.STEP_THREE.NAME}
          renderInModal={true}
          isLastStep={true}
          type={Connectors.GCP}
          hideLightModal={props.hideLightModal}
        />
      </StepWizard>
    </>
  )
}

export default CreateGcpConnector
