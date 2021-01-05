import React from 'react'
import { StepWizard } from '@wings-software/uicore'

import { getConnectorIconByType, getConnectorTitleTextByType } from '@connectors/pages/connectors/utils/ConnectorHelper'
import { Connectors } from '@connectors/constants'
import { useStrings } from 'framework/exports'
import type { ConnectorInfoDTO } from 'services/cd-ng'

import VerifyOutOfClusterDelegate from '@connectors/common/VerifyOutOfClusterDelegate/VerifyOutOfClusterDelegate'
import i18n from './CreateHashiCorpVault.i18n'
import ConnectorDetailsStep from '../commonSteps/ConnectorDetailsStep'
import VaultConfigForm from './views/VaultConfigForm'

export interface CreateHashiCorpVaultProps {
  hideLightModal: () => void
  onSuccess: () => void
  isEditMode: boolean
  mock?: any
  connectorInfo?: ConnectorInfoDTO | void
}

export interface StepSecretManagerProps extends ConnectorInfoDTO {
  isEdit: boolean
}

const CreateHashiCorpVault: React.FC<CreateHashiCorpVaultProps> = props => {
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
        name={getString('overview')}
        isEditMode={props.isEditMode}
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

export default CreateHashiCorpVault
