import React from 'react'
import { StepWizard } from '@wings-software/uicore'
import { pick } from 'lodash-es'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { Connectors, CreateConnectorModalProps } from '@connectors/constants'
import { getConnectorTitleTextByType, getConnectorIconByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { useStrings } from 'framework/exports'
import ConnectorDetailsStep from '../commonSteps/ConnectorDetailsStep'
import Stepk8ClusterDetails from './StepAuth/Stepk8ClusterDetails'

const CreateK8sConnector: React.FC<CreateConnectorModalProps> = props => {
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
    <StepWizard
      icon={getConnectorIconByType(Connectors.KUBERNETES_CLUSTER)}
      iconProps={{ size: 50 }}
      title={getConnectorTitleTextByType(Connectors.KUBERNETES_CLUSTER)}
    >
      <ConnectorDetailsStep
        type={Connectors.KUBERNETES_CLUSTER}
        name={getString('overview')}
        isEditMode={props.isEditMode}
        connectorInfo={props.connectorInfo}
        mock={props.mock}
      />
      <Stepk8ClusterDetails
        name={getString('connectors.k8.stepTwoName')}
        onConnectorCreated={props.onSuccess}
        hideModal={props.hideModal}
        {...commonProps}
      />
      <VerifyOutOfClusterDelegate
        name={getString('connectors.stepThreeName')}
        isStep
        onSuccess={props.onSuccess}
        isLastStep={true}
        type={Connectors.KUBERNETES_CLUSTER}
        hideModal={props.hideModal}
        setIsEditMode={props.setIsEditMode}
      />
    </StepWizard>
  )
}

export default CreateK8sConnector
