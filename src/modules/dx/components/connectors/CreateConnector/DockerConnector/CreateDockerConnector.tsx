import React, { useState } from 'react'
import { StepWizard } from '@wings-software/uikit'
import ConnectorDetailsStep from 'modules/dx/components/connectors/CreateConnector/commonSteps/ConnectorDetailsStep'
import type { ConnectorConfigDTO, ConnectorRequestDTO } from 'services/cd-ng'
import VerifyOutOfClusterDelegate from 'modules/dx/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import StepDockerAuthentication from './StepAuth/StepDockerAuthentication'
import i18n from './CreateDockerConnector.i18n'

interface CreateDockerConnectorProps {
  accountId: string
  orgIdentifier?: string
  projectIdentifier?: string
  hideLightModal: () => void
  onConnectorCreated?: (data?: ConnectorConfigDTO) => void | Promise<void>
}
const CreateDockerConnector: React.FC<CreateDockerConnectorProps> = props => {
  const [formData, setFormData] = useState<ConnectorConfigDTO | undefined>()
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  return (
    <>
      <StepWizard<ConnectorRequestDTO>>
        <ConnectorDetailsStep
          type={i18n.type}
          name={i18n.STEP_ONE.NAME}
          setFormData={setFormData}
          formData={formData}
        />
        <StepDockerAuthentication
          name={i18n.STEP_TWO.NAME}
          setFormData={setFormData}
          formData={formData}
          onConnectorCreated={props.onConnectorCreated}
          isEditMode={isEditMode}
        />
        <VerifyOutOfClusterDelegate
          name={i18n.STEP_THREE.NAME}
          connectorName={formData?.name}
          connectorIdentifier={formData?.identifier}
          setIsEditMode={() => setIsEditMode(true)}
          renderInModal={true}
          onSuccess={props.onConnectorCreated}
        />
      </StepWizard>
    </>
  )
}

export default CreateDockerConnector
