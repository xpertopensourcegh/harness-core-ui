import React from 'react'
import { StepWizard } from '@wings-software/uicore'
import { Connectors } from '@connectors/constants'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { useStrings } from 'framework/exports'
import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import type { ConnectorRequestBody, ConnectorInfoDTO, ResponseBoolean } from 'services/cd-ng'
import GitDetailsStep from '../commonSteps/GitDetailsStep'
import StepBitbucketAuthentication from './StepAuth/StepBitbucketAuthentication'

interface CreateBitbucketConnectorProps {
  hideLightModal: () => void
  onConnectorCreated: (data?: ConnectorRequestBody) => void | Promise<void>
  isEditMode: boolean
  setIsEditMode: (val: boolean) => void
  connectorInfo: ConnectorInfoDTO | void
  mock?: ResponseBoolean
}
const CreateBitbucketConnector = (props: CreateBitbucketConnectorProps): JSX.Element => {
  const { getString } = useStrings()

  return (
    <StepWizard
      icon={getConnectorIconByType(Connectors.BITBUCKET)}
      iconProps={{ size: 50 }}
      title={getConnectorTitleTextByType(Connectors.BITBUCKET)}
    >
      <GitDetailsStep
        type={Connectors.BITBUCKET}
        name={getString('overview')}
        isEditMode={props.isEditMode}
        connectorInfo={props.connectorInfo}
        mock={props.mock}
      />
      <StepBitbucketAuthentication
        name={getString('connectors.git.bitbucketStepTwoName')}
        onConnectorCreated={props.onConnectorCreated}
        isEditMode={props.isEditMode}
        setIsEditMode={props.setIsEditMode}
        connectorInfo={props.connectorInfo}
      />
      <VerifyOutOfClusterDelegate
        type={Connectors.BITBUCKET}
        name={getString('connectors.stepThreeName')}
        renderInModal={true}
        onSuccess={props.onConnectorCreated}
        isLastStep={true}
        hideLightModal={props.hideLightModal}
      />
    </StepWizard>
  )
}

export default CreateBitbucketConnector
