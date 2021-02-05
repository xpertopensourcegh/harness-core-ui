import React from 'react'
import { StepWizard } from '@wings-software/uicore'
import { pick } from 'lodash-es'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { Connectors, CreateConnectorModalProps } from '@connectors/constants'
import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { useStrings } from 'framework/exports'
import StepArtifactoryAuthentication from './StepAuth/StepArtifactoryAuthentication'

const CreateArtifactoryConnector: React.FC<CreateConnectorModalProps> = props => {
  const { getString } = useStrings()
  const commonProps = pick(props, [
    'isEditMode',
    'connectorInfo',
    'setIsEditMode',
    'accountId',
    'orgIdentifier',
    'projectIdentifier'
  ])
  return (
    <>
      <StepWizard
        icon={getConnectorIconByType(Connectors.ARTIFACTORY)}
        iconProps={{ size: 45 }}
        title={getConnectorTitleTextByType(Connectors.ARTIFACTORY)}
      >
        <ConnectorDetailsStep
          type={Connectors.ARTIFACTORY}
          name={getString('overview')}
          isEditMode={props.isEditMode}
          connectorInfo={props.connectorInfo}
          mock={props.mock}
        />
        <StepArtifactoryAuthentication
          name={getString('details')}
          {...commonProps}
          onConnectorCreated={props.onSuccess}
        />
        <VerifyOutOfClusterDelegate
          name={getString('connectors.stepThreeName')}
          isStep={true}
          isLastStep={true}
          type={Connectors.ARTIFACTORY}
          onClose={props.onClose}
          setIsEditMode={props.setIsEditMode}
        />
      </StepWizard>
    </>
  )
}

export default CreateArtifactoryConnector
