import React from 'react'
import { StepWizard } from '@wings-software/uicore'
import { pick } from 'lodash-es'
import { Connectors } from '@connectors/constants'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { useStrings } from 'framework/exports'
import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import type { ConnectorRequestBody, ConnectorInfoDTO, ResponseBoolean } from 'services/cd-ng'
import GitDetailsStep from '../commonSteps/GitDetailsStep'
import StepGitlabAuthentication from './StepAuth/StepGitlabAuthentication'

interface CreateGitlabConnectorProps {
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
const CreateGitlabConnector = (props: CreateGitlabConnectorProps): JSX.Element => {
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
      icon={getConnectorIconByType(Connectors.GITLAB)}
      iconProps={{ size: 37 }}
      title={getConnectorTitleTextByType(Connectors.GITLAB)}
    >
      <GitDetailsStep
        type={Connectors.GITLAB}
        name={getString('overview')}
        isEditMode={props.isEditMode}
        connectorInfo={props.connectorInfo}
        mock={props.mock}
      />
      <StepGitlabAuthentication
        name={getString('connectors.git.gitlabStepTwoName')}
        {...commonProps}
        onConnectorCreated={props.onSuccess}
      />
      <VerifyOutOfClusterDelegate
        name={getString('connectors.stepThreeName')}
        renderInModal={true}
        onSuccess={props.onSuccess}
        isLastStep={true}
        type={Connectors.GITLAB}
        hideLightModal={props.hideLightModal}
      />
    </StepWizard>
  )
}

export default CreateGitlabConnector
