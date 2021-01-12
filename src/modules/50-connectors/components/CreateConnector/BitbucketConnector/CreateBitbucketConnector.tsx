import React from 'react'
import { StepWizard } from '@wings-software/uicore'
import { pick } from 'lodash-es'
import { Connectors } from '@connectors/constants'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { useStrings } from 'framework/exports'
import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import type { ConnectorRequestBody, ConnectorInfoDTO, ResponseBoolean } from 'services/cd-ng'
import GitDetailsStep from '../commonSteps/GitDetailsStep'
import StepBitbucketAuthentication from './StepAuth/StepBitbucketAuthentication'

interface CreateBitbucketConnectorProps {
  hideLightModal: () => void
  onSuccess: (data?: ConnectorRequestBody) => void | Promise<void>
  isEditMode: boolean
  setIsEditMode: (val: boolean) => void
  connectorInfo: ConnectorInfoDTO | void
  accountId: string
  orgIdentifier: string
  projectIdentifier: string
  mock?: ResponseBoolean
}
const CreateBitbucketConnector = (props: CreateBitbucketConnectorProps): JSX.Element => {
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
      <GitDetailsStep
        type={Connectors.BITBUCKET}
        name={getString('overview')}
        isEditMode={props.isEditMode}
        connectorInfo={props.connectorInfo}
        mock={props.mock}
      />
      <StepBitbucketAuthentication
        name={getString('connectors.git.bitbucketStepTwoName')}
        {...commonProps}
        onConnectorCreated={props.onSuccess}
      />
      <VerifyOutOfClusterDelegate
        type={Connectors.BITBUCKET}
        name={getString('connectors.stepThreeName')}
        renderInModal={true}
        onSuccess={props.onSuccess}
        isLastStep={true}
        hideLightModal={props.hideLightModal}
      />
    </StepWizard>
  )
}

export default CreateBitbucketConnector
