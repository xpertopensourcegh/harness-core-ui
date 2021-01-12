import React from 'react'
import { StepWizard } from '@wings-software/uicore'
import { pick } from 'lodash-es'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { Connectors } from '@connectors/constants'
import type { ConnectorRequestBody, ResponseBoolean, ConnectorInfoDTO } from 'services/cd-ng'
import { getConnectorTitleTextByType, getConnectorIconByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { useStrings } from 'framework/exports'
import ConnectorDetailsStep from '../commonSteps/ConnectorDetailsStep'
import Stepk8ClusterDetails from './StepAuth/Stepk8ClusterDetails'

interface CreateK8sConnectorProps {
  hideLightModal: () => void
  onSuccess: (data?: ConnectorRequestBody) => void | Promise<void>
  mock?: ResponseBoolean
  isEditMode: boolean
  setIsEditMode: (val: boolean) => void
  connectorInfo: ConnectorInfoDTO | void
  accountId: string
  orgIdentifier: string
  projectIdentifier: string
}

const CreateK8sConnector: React.FC<CreateK8sConnectorProps> = props => {
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
        {...commonProps}
      />
      <VerifyOutOfClusterDelegate
        name={getString('connectors.stepThreeName')}
        renderInModal={true}
        onSuccess={props.onSuccess}
        isLastStep={true}
        type={Connectors.KUBERNETES_CLUSTER}
        hideLightModal={props.hideLightModal}
        setIsEditMode={props.setIsEditMode}
      />
    </StepWizard>
  )
}

export default CreateK8sConnector
