import React from 'react'
import { StepWizard } from '@wings-software/uikit'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { Connectors } from '@connectors/constants'
import type { ConnectorRequestBody, ResponseBoolean, ConnectorInfoDTO } from 'services/cd-ng'
import { getConnectorTitleTextByType, getConnectorIconByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { useStrings } from 'framework/exports'
import ConnectorDetailsStep from '../commonSteps/ConnectorDetailsStep'
import Stepk8ClusterDetails from './StepAuth/Stepk8ClusterDetails'

interface CreateK8sConnectorProps {
  hideLightModal: () => void
  onConnectorCreated?: (data?: ConnectorRequestBody) => void | Promise<void>
  mock?: ResponseBoolean
  isCreate: boolean
  connectorInfo?: ConnectorInfoDTO | void
}

const CreateK8sConnector: React.FC<CreateK8sConnectorProps> = props => {
  const { getString } = useStrings()
  return (
    <StepWizard
      icon={getConnectorIconByType('K8sCluster')}
      iconProps={{ size: 37 }}
      title={getConnectorTitleTextByType('K8sCluster')}
    >
      <ConnectorDetailsStep
        type="K8sCluster"
        name={getString('connectors.stepOneName')}
        isEditMode={!props.isCreate}
        connectorInfo={props.connectorInfo}
        mock={props.mock}
      />
      <Stepk8ClusterDetails
        name={getString('connectors.k8.stepTwoName')}
        onConnectorCreated={props.onConnectorCreated}
        isEditMode={!props.isCreate}
      />
      <VerifyOutOfClusterDelegate
        name={getString('connectors.stepThreeName')}
        renderInModal={true}
        onSuccess={props.onConnectorCreated}
        isLastStep={true}
        type={Connectors.K8sCluster}
        hideLightModal={props.hideLightModal}
      />
    </StepWizard>
  )
}

export default CreateK8sConnector
