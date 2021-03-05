import React from 'react'
import { StepWizard } from '@wings-software/uicore'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'
import { Connectors, CreateConnectorModalProps } from '@connectors/constants'
import { useStrings } from 'framework/exports'
import { getConnectorIconByType, getConnectorTitleIdByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import type { ConnectorInfoDTO } from 'services/cd-ng'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import AWSCCAuthStep from './AWSCCAuthStep'
import AWSCCDetailsStep from './AWSCCDetailsStep'

export default function CreateAWSCodeCommitConnector(props: CreateConnectorModalProps) {
  const { getString } = useStrings()
  return (
    <StepWizard
      icon={getConnectorIconByType(Connectors.AWS_CODE_COMMIT)}
      iconProps={{ size: 37 }}
      title={getString(getConnectorTitleIdByType(Connectors.AWS_CODE_COMMIT))}
    >
      <ConnectorDetailsStep
        type={Connectors.AWS_CODE_COMMIT}
        name={getString('overview')}
        isEditMode={props.isEditMode}
        connectorInfo={props.connectorInfo}
      />
      <AWSCCDetailsStep
        name={getString('details')}
        isEditMode={props.isEditMode}
        connectorInfo={props.connectorInfo as ConnectorInfoDTO}
      />
      <AWSCCAuthStep
        name={getString('credentials')}
        isEditMode={props.isEditMode}
        connectorInfo={props.connectorInfo as ConnectorInfoDTO}
        onSuccess={props.onSuccess}
        setIsEditMode={props.setIsEditMode}
      />
      <VerifyOutOfClusterDelegate
        name={getString('connectors.stepThreeName')}
        isStep
        isLastStep
        type={Connectors.AWS_CODE_COMMIT}
        onClose={props.onClose}
      />
    </StepWizard>
  )
}
