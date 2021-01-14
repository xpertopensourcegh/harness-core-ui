import React from 'react'
import { StepWizard } from '@wings-software/uicore'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { Connectors, CreateConnectorModalProps } from '@connectors/constants'
import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import StepAWSAuthentication from './StepAuth/StepAWSAuthentication'
import i18n from './CreateAWSConnector.i18n'

const CreateAWSConnector: React.FC<CreateConnectorModalProps> = props => {
  return (
    <>
      <StepWizard
        icon={getConnectorIconByType(Connectors.AWS)}
        iconProps={{ size: 37 }}
        title={getConnectorTitleTextByType(Connectors.AWS)}
      >
        <ConnectorDetailsStep type={Connectors.AWS} name={i18n.STEP.ONE.NAME} mock={props.mock} />
        <StepAWSAuthentication name={i18n.STEP.TWO.NAME} onConnectorCreated={props.onSuccess} />
        <VerifyOutOfClusterDelegate
          name={i18n.STEP.THREE.NAME}
          isStep={true}
          isLastStep={true}
          type={Connectors.AWS}
          onClose={props.onClose}
        />
      </StepWizard>
    </>
  )
}

export default CreateAWSConnector
