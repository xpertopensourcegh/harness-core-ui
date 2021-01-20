import React from 'react'
import { StepWizard } from '@wings-software/uicore'
import { pick } from 'lodash-es'
import type { ConnectorInfoDTO } from 'services/cd-ng'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'
import { Connectors, CreateConnectorModalProps } from '@connectors/constants'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { useStrings } from 'framework/exports'
import GcrAuthentication from './StepAuth/GcrAuthentication'

const CreateGcrConnector: React.FC<CreateConnectorModalProps> = props => {
  const { getString } = useStrings()
  const commonProps = pick(props, ['isEditMode', 'setIsEditMode', 'accountId', 'orgIdentifier', 'projectIdentifier'])

  return (
    <StepWizard
      icon={getConnectorIconByType(Connectors.GCR)}
      iconProps={{ size: 37 }}
      title={getConnectorTitleTextByType(Connectors.GCR)}
    >
      <ConnectorDetailsStep
        type={('Gcr' as unknown) as ConnectorInfoDTO['type']}
        name={getString('overview')}
        isEditMode={props.isEditMode}
        connectorInfo={props.connectorInfo}
        mock={props.mock}
      />
      <GcrAuthentication
        name={getString('connectors.GCR.stepTwoName')}
        {...commonProps}
        onConnectorCreated={props.onSuccess}
        connectorInfo={props.connectorInfo}
      />
      <VerifyOutOfClusterDelegate
        name={getString('connectors.stepThreeName')}
        isStep={true}
        isLastStep={true}
        type={Connectors.GCR}
        onClose={props.onClose}
      />
    </StepWizard>
  )
}

export default CreateGcrConnector
