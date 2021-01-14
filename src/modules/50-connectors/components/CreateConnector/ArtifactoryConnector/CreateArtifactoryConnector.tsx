import React from 'react'
import { StepWizard } from '@wings-software/uicore'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { Connectors, CreateConnectorModalProps } from '@connectors/constants'
import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { useStrings } from 'framework/exports'
import StepArtifactoryAuthentication from './StepAuth/StepArtifactoryAuthentication'
import i18n from './CreateArtifactoryConnector.i18n'

const CreateArtifactoryConnector: React.FC<CreateConnectorModalProps> = props => {
  const { getString } = useStrings()
  return (
    <>
      <StepWizard
        icon={getConnectorIconByType(Connectors.ARTIFACTORY)}
        iconProps={{ size: 40 }}
        title={getConnectorTitleTextByType(Connectors.ARTIFACTORY)}
      >
        <ConnectorDetailsStep type={Connectors.ARTIFACTORY} name={getString('overview')} mock={props.mock} />
        <StepArtifactoryAuthentication name={i18n.STEP_TWO.NAME} onConnectorCreated={props.onSuccess} />
        <VerifyOutOfClusterDelegate
          name={getString('connectors.stepThreeName')}
          isStep={true}
          onSuccess={props.onSuccess}
          isLastStep={true}
          type={Connectors.ARTIFACTORY}
          hideModal={props.hideModal}
        />
      </StepWizard>
    </>
  )
}

export default CreateArtifactoryConnector
