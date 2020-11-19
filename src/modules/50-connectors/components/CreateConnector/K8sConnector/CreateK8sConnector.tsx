import React from 'react'
import { StepWizard } from '@wings-software/uikit'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { Connectors } from '@connectors/constants'
import type { ConnectorRequestBody, ResponseBoolean } from 'services/cd-ng'
import { getConnectorTitleTextByType, getConnectorIconByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { useStrings } from 'framework/exports'
import ConnectorDetailsStep from '../commonSteps/ConnectorDetailsStep'
import Stepk8ClusterDetails from './StepAuth/Stepk8ClusterDetails'

interface CreateK8sConnectorProps {
  hideLightModal: () => void
  onConnectorCreated?: (data?: ConnectorRequestBody) => void | Promise<void>
  mock?: ResponseBoolean
}

const CreateK8sConnector: React.FC<CreateK8sConnectorProps> = props => {
  const { getString } = useStrings('connectors')
  return (
    <StepWizard
      icon={getConnectorIconByType('K8sCluster')}
      iconProps={{ size: 37 }}
      title={getConnectorTitleTextByType('K8sCluster')}
    >
      <ConnectorDetailsStep type="K8sCluster" name={getString('stepOneName')} mock={props.mock} />
      <Stepk8ClusterDetails name={getString('k8.stepTwoName')} onConnectorCreated={props.onConnectorCreated} />
      <VerifyOutOfClusterDelegate
        name={getString('stepThreeName')}
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
