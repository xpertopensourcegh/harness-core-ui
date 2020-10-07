import React from 'react'
import { StepWizard } from '@wings-software/uikit'
import ConnectorDetailsStep from 'modules/dx/components/connectors/CreateConnector/commonSteps/ConnectorDetailsStep'
import type { ConnectorRequestBody, ConnectorInfoDTO } from 'services/cd-ng'
import VerifyOutOfClusterDelegate from 'modules/dx/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { Connectors } from 'modules/dx/constants'
import StepAWSAuthentication from './StepAuth/StepAWSAuthentication'
import i18n from './CreateAWSConnector.i18n'

interface CreateAWSConnectorProps {
  hideLightModal: () => void
  onConnectorCreated?: (data?: ConnectorRequestBody) => void | Promise<void>
}
const CreateAWSConnector: React.FC<CreateAWSConnectorProps> = props => {
  return (
    <>
      <StepWizard<ConnectorInfoDTO>>
        <ConnectorDetailsStep type={Connectors.AWS} name={i18n.STEP.ONE.NAME} />
        <StepAWSAuthentication name={i18n.STEP.TWO.NAME} onConnectorCreated={props.onConnectorCreated} />
        <VerifyOutOfClusterDelegate
          name={i18n.STEP.THREE.NAME}
          renderInModal={true}
          onSuccess={props.onConnectorCreated}
          isLastStep={true}
          type={Connectors.AWS}
          hideLightModal={props.hideLightModal}
        />
      </StepWizard>
    </>
  )
}

export default CreateAWSConnector
