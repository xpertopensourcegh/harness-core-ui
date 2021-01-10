import React from 'react'
import { StepWizard } from '@wings-software/uicore'
import { Connectors } from '@connectors/constants'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { useStrings } from 'framework/exports'
import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import type { ConnectorRequestBody, ConnectorInfoDTO, ResponseBoolean } from 'services/cd-ng'
import GitDetailsStep from '../commonSteps/GitDetailsStep'
import StepGitAuthentication from './StepAuth/StepGitAuthentication'

interface CreateGitConnectorProps {
  hideLightModal: () => void
  onConnectorCreated: (data?: ConnectorRequestBody) => void | Promise<void>
  isEditMode: boolean
  setIsEditMode: (val: boolean) => void
  connectorInfo: ConnectorInfoDTO | void
  accountId: string
  orgIdentifier: string | void
  projectIdentifier: string | void
  mock?: ResponseBoolean
}
const CreateGitConnector = (props: CreateGitConnectorProps): JSX.Element => {
  const { getString } = useStrings()

  return (
    <StepWizard
      icon={getConnectorIconByType(Connectors.GIT)}
      iconProps={{ size: 50 }}
      title={getConnectorTitleTextByType(Connectors.GIT)}
    >
      <GitDetailsStep
        type={Connectors.GIT}
        name={getString('overview')}
        isEditMode={props.isEditMode}
        connectorInfo={props.connectorInfo}
        mock={props.mock}
      />
      <StepGitAuthentication name={getString('connectors.git.gitStepTwoName')} {...props} />
      <VerifyOutOfClusterDelegate
        name={getString('connectors.stepThreeName')}
        renderInModal={true}
        onSuccess={props.onConnectorCreated}
        isLastStep={true}
        type={Connectors.GIT}
        hideLightModal={props.hideLightModal}
      />
    </StepWizard>
  )
}

export default CreateGitConnector
