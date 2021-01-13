import React from 'react'
import { StepWizard, Color } from '@wings-software/uicore'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { Connectors } from '@connectors/constants'
import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { useStrings } from 'framework/exports'
import type { ConnectorRequestBody, ConnectorInfoDTO, ResponseBoolean } from 'services/cd-ng'
import StepDockerAuthentication from './StepAuth/StepDockerAuthentication'

interface CreateDockerConnectorProps {
  hideModal: () => void
  onSuccess?: (data?: ConnectorRequestBody) => void | Promise<void>
  mock?: ResponseBoolean
  isEditMode: boolean
  setIsEditMode: (val: boolean) => void
  connectorInfo?: ConnectorInfoDTO | void
}
const CreateDockerConnector: React.FC<CreateDockerConnectorProps> = props => {
  const { getString } = useStrings()
  return (
    <>
      <StepWizard
        icon={getConnectorIconByType(Connectors.DOCKER)}
        iconProps={{ size: 37, color: Color.WHITE }}
        title={getConnectorTitleTextByType(Connectors.DOCKER)}
      >
        <ConnectorDetailsStep
          type={Connectors.DOCKER}
          name={getString('overview')}
          isEditMode={props.isEditMode}
          connectorInfo={props.connectorInfo}
          mock={props.mock}
        />
        <StepDockerAuthentication
          name={getString('connectors.docker.stepTwoName')}
          onConnectorCreated={props.onSuccess}
          isEditMode={props.isEditMode}
          connectorInfo={props.connectorInfo}
          setIsEditMode={props.setIsEditMode}
        />
        <VerifyOutOfClusterDelegate
          name={getString('connectors.stepThreeName')}
          onSuccess={props.onSuccess}
          renderInModal={true}
          isLastStep={true}
          type={Connectors.DOCKER}
          hideModal={props.hideModal}
        />
      </StepWizard>
    </>
  )
}

export default CreateDockerConnector
