import React from 'react'
import { StepWizard, Color } from '@wings-software/uicore'
import { pick } from 'lodash-es'
import { Connectors } from '@connectors/constants'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { useStrings } from 'framework/exports'
import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import type { ConnectorRequestBody, ConnectorInfoDTO, ResponseBoolean } from 'services/cd-ng'
import GitDetailsStep from '../commonSteps/GitDetailsStep'
import StepGithubAuthentication from './StepAuth/StepGithubAuthentication'

interface CreateGithubConnectorProps {
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
const CreateGithubConnector = (props: CreateGithubConnectorProps): JSX.Element => {
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
      icon={getConnectorIconByType(Connectors.GITHUB)}
      iconProps={{ size: 37, color: Color.BLACK }}
      title={getConnectorTitleTextByType(Connectors.GITHUB)}
    >
      <GitDetailsStep
        type={Connectors.GITHUB}
        name={getString('overview')}
        isEditMode={props.isEditMode}
        connectorInfo={props.connectorInfo}
        mock={props.mock}
      />
      <StepGithubAuthentication
        name={getString('connectors.git.githubStepTwoName')}
        {...commonProps}
        onConnectorCreated={props.onSuccess}
      />
      <VerifyOutOfClusterDelegate
        name={getString('connectors.stepThreeName')}
        renderInModal={true}
        onSuccess={props.onSuccess}
        isLastStep={true}
        type={Connectors.GITHUB}
        hideLightModal={props.hideLightModal}
      />
    </StepWizard>
  )
}

export default CreateGithubConnector
