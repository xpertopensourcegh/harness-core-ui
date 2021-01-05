import React from 'react'
import { StepWizard } from '@wings-software/uicore'
import { Connectors } from '@connectors/constants'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { useStrings } from 'framework/exports'
import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import type { ConnectorRequestBody, ConnectorInfoDTO, ResponseBoolean } from 'services/cd-ng'
import GitDetailsStep from './GitlabDetailsStep'
import StepGitlabAuthentication from './StepAuth/StepGitlabAuthentication'

interface CreateGitlabConnectorProps {
  hideLightModal: () => void
  onConnectorCreated: (data?: ConnectorRequestBody) => void | Promise<void>
  isEditMode: boolean
  connectorInfo: ConnectorInfoDTO | void
  mock?: ResponseBoolean
}
const CreateGitlabConnector = (props: CreateGitlabConnectorProps): JSX.Element => {
  const { getString } = useStrings()

  return (
    <StepWizard
      icon={getConnectorIconByType(Connectors.GITLAB)}
      iconProps={{ size: 37 }}
      title={getConnectorTitleTextByType(Connectors.GITLAB)}
    >
      <GitDetailsStep
        type={Connectors.GITLAB}
        name={getString('overview')}
        isEditMode={props.isEditMode}
        connectorInfo={props.connectorInfo}
        mock={props.mock}
      />
      <StepGitlabAuthentication
        name={getString('connectors.git.gitlabStepTwoName')}
        onConnectorCreated={props.onConnectorCreated}
        isEditMode={props.isEditMode}
        connectorInfo={props.connectorInfo}
      />
      <VerifyOutOfClusterDelegate
        name={getString('connectors.stepThreeName')}
        renderInModal={true}
        onSuccess={props.onConnectorCreated}
        isLastStep={true}
        type={Connectors.GITLAB}
        hideLightModal={props.hideLightModal}
      />
    </StepWizard>
  )
}

export default CreateGitlabConnector
