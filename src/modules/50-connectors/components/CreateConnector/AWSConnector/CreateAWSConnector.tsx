import React from 'react'
import { StepWizard } from '@wings-software/uikit'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'
import type { ConnectorRequestBody, ConnectorInfoDTO, ResponseBoolean } from 'services/cd-ng'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { Connectors } from '@connectors/constants'
import StepAWSAuthentication from './StepAuth/StepAWSAuthentication'
import i18n from './CreateAWSConnector.i18n'

interface CreateAWSConnectorProps {
  hideLightModal: () => void
  onConnectorCreated?: (data?: ConnectorRequestBody) => void | Promise<void>
  mock?: ResponseBoolean
}
const CreateAWSConnector: React.FC<CreateAWSConnectorProps> = props => {
  return (
    <>
      <StepWizard<ConnectorInfoDTO>>
        <ConnectorDetailsStep type={Connectors.AWS} name={i18n.STEP.ONE.NAME} mock={props.mock} />
        <StepAWSAuthentication name={i18n.STEP.TWO.NAME} onConnectorCreated={props.onConnectorCreated} />
        <VerifyOutOfClusterDelegate
          name={i18n.STEP.THREE.NAME}
          renderInModal={true}
          isLastStep={true}
          type={Connectors.AWS}
          hideLightModal={props.hideLightModal}
        />
      </StepWizard>
    </>
  )
}

export default CreateAWSConnector
