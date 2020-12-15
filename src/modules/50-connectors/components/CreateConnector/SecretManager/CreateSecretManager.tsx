import React from 'react'
import { StepWizard } from '@wings-software/uikit'

import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { Connectors } from '@connectors/constants'
import { useStrings } from 'framework/exports'
import type { ConnectorInfoDTO } from 'services/cd-ng'

import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import i18n from './CreateSecretManager.i18n'
import ConnectorDetailsStep from '../commonSteps/ConnectorDetailsStep'
import VaultConfigForm from './views/VaultConfigForm'

export interface CreateSecretManagerProps {
  hideLightModal: () => void
  onSuccess: () => void
  isCreate: boolean
  mock?: any
  connectorInfo?: ConnectorInfoDTO | void
}

export interface StepSecretManagerProps extends ConnectorInfoDTO {
  isEdit: boolean
}

const CreateSecretManager: React.FC<CreateSecretManagerProps> = props => {
  const { hideLightModal, onSuccess } = props
  const { getString } = useStrings()
  return (
    <StepWizard<StepSecretManagerProps>
      icon={getConnectorIconByType(Connectors.VAULT)}
      iconProps={{ size: 37 }}
      title={getConnectorTitleTextByType(Connectors.VAULT)}
    >
      <ConnectorDetailsStep
        type={Connectors.VAULT}
        name={getString('connectors.stepOneName')}
        isEditMode={!props.isCreate}
        connectorInfo={props.connectorInfo}
        mock={props.mock}
      />
      <VaultConfigForm name={i18n.nameStepConfigure} {...props} />
      <VerifyOutOfClusterDelegate
        name={i18n.nameStepVerify}
        renderInModal={true}
        hideLightModal={hideLightModal}
        onSuccess={onSuccess}
        isLastStep={true}
        type={Connectors.VAULT}
      />
    </StepWizard>
  )
}

export default CreateSecretManager
