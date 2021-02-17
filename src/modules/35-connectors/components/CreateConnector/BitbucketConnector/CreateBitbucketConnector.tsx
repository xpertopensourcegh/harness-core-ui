import React from 'react'
import { StepWizard } from '@wings-software/uicore'
import { pick } from 'lodash-es'
import { Connectors, CreateConnectorModalProps } from '@connectors/constants'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { useStrings } from 'framework/exports'
import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import ConnectorDetailsStep from '../commonSteps/ConnectorDetailsStep'
import GitDetailsStep from '../commonSteps/GitDetailsStep'
import StepBitbucketAuthentication from './StepAuth/StepBitbucketAuthentication'

const CreateBitbucketConnector = (props: CreateConnectorModalProps): JSX.Element => {
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
      icon={getConnectorIconByType(Connectors.BITBUCKET)}
      iconProps={{ size: 50 }}
      title={getConnectorTitleTextByType(Connectors.BITBUCKET)}
    >
      <ConnectorDetailsStep
        type={Connectors.BITBUCKET}
        name={getString('overview')}
        isEditMode={props.isEditMode}
        connectorInfo={props.connectorInfo}
        mock={props.mock}
      />
      <GitDetailsStep
        type={Connectors.BITBUCKET}
        name={getString('details')}
        isEditMode={props.isEditMode}
        connectorInfo={props.connectorInfo}
        mock={props.mock}
      />
      <StepBitbucketAuthentication
        name={getString('credentials')}
        {...commonProps}
        onConnectorCreated={props.onSuccess}
      />
      <VerifyOutOfClusterDelegate
        type={Connectors.BITBUCKET}
        name={getString('connectors.stepThreeName')}
        isStep={true}
        isLastStep={true}
        onClose={props.onClose}
      />
    </StepWizard>
  )
}

export default CreateBitbucketConnector
