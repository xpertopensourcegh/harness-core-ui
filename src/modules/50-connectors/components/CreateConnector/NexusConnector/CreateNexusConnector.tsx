import React from 'react'
import { StepWizard } from '@wings-software/uicore'
import ConnectorDetailsStep from '@connectors/components/CreateConnector/commonSteps/ConnectorDetailsStep'
import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import { Connectors, CreateConnectorModalProps } from '@connectors/constants'
import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { useStrings } from 'framework/exports'
import StepNexusAuthentication from './StepAuth/StepNexusAuthentication'
import i18n from './CreateNexusConnector.i18n'

const CreateNexusConnector: React.FC<CreateConnectorModalProps> = props => {
  const { getString } = useStrings()
  return (
    <>
      <StepWizard
        icon={getConnectorIconByType(Connectors.NEXUS)}
        iconProps={{ size: 40 }}
        title={getConnectorTitleTextByType(Connectors.NEXUS)}
      >
        <ConnectorDetailsStep type={Connectors.NEXUS} name={getString('overview')} mock={props.mock} />
        <StepNexusAuthentication name={i18n.STEP_TWO.NAME} onConnectorCreated={props.onSuccess} />
        <VerifyOutOfClusterDelegate
          name={getString('connectors.stepThreeName')}
          isStep
          isLastStep={true}
          type={Connectors.NEXUS}
          onClose={props.onClose}
        />
      </StepWizard>
    </>
  )
}

export default CreateNexusConnector
