import React from 'react'
import { StepWizard, Color } from '@wings-software/uikit'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'
import type { ConnectorRequestBody, ConnectorInfoDTO, ResponseBoolean } from 'services/cd-ng'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { Connectors } from '@connectors/constants'
import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { useStrings } from 'framework/exports'
import StepDockerAuthentication from './StepAuth/StepDockerAuthentication'

interface CreateDockerConnectorProps {
  hideLightModal: () => void
  onConnectorCreated?: (data?: ConnectorRequestBody) => void | Promise<void>
  mock?: ResponseBoolean
  isEditMode: boolean
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
          name={getString('connectors.stepOneName')}
          isEditMode={props.isEditMode}
          connectorInfo={props.connectorInfo}
          mock={props.mock}
        />
        <StepDockerAuthentication
          name={getString('connectors.docker.stepTwoName')}
          onConnectorCreated={props.onConnectorCreated}
          isEditMode={props.isEditMode}
          connectorInfo={props.connectorInfo}
        />
        <VerifyOutOfClusterDelegate
          name={getString('connectors.stepThreeName')}
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
