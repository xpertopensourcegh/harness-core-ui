import React from 'react'
import { StepWizard } from '@wings-software/uicore'
import { pick } from 'lodash-es'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'
import type { ConnectorConfigDTO, ResponseBoolean, ConnectorInfoDTO } from 'services/cd-ng'
import { Connectors } from '@connectors/constants'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { useStrings } from 'framework/exports'
import GcpAuthentication from './StepAuth/GcpAuthentication'

interface CreateGCPConnectorProps {
  hideLightModal: () => void
  onSuccess: (data?: ConnectorConfigDTO) => void | Promise<void>
  mock?: ResponseBoolean
  isEditMode: boolean
  setIsEditMode: (val: boolean) => void
  connectorInfo?: ConnectorInfoDTO | void
  accountId: string
  orgIdentifier: string
  projectIdentifier: string
}

const CreateGcpConnector: React.FC<CreateGCPConnectorProps> = props => {
  const { getString } = useStrings()
  const commonProps = pick(props, ['isEditMode', 'setIsEditMode', 'accountId', 'orgIdentifier', 'projectIdentifier'])

  return (
    <>
      <StepWizard
        icon={getConnectorIconByType(Connectors.GCP)}
        iconProps={{ size: 37 }}
        title={getConnectorTitleTextByType(Connectors.GCP)}
      >
        <ConnectorDetailsStep
          type={Connectors.GCP}
          name={getString('overview')}
          isEditMode={props.isEditMode}
          connectorInfo={props.connectorInfo}
          mock={props.mock}
        />
        <GcpAuthentication
          name={getString('connectors.GCP.stepTwoName')}
          {...commonProps}
          onConnectorCreated={props.onSuccess}
          connectorInfo={props.connectorInfo}
        />
        <VerifyOutOfClusterDelegate
          name={getString('connectors.stepThreeName')}
          renderInModal={true}
          isLastStep={true}
          type={Connectors.GCP}
          hideLightModal={props.hideLightModal}
        />
      </StepWizard>
    </>
  )
}

export default CreateGcpConnector
