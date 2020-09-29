import React from 'react'
import { StepWizard } from '@wings-software/uikit'

import StepConfigure from './views/StepConfigure'
import StepDetails, { DetailsData } from './views/StepDetails'
import StepVerify from './views/StepVerify'
import type { VaultConfigFormData } from './views/VaultConfigForm'

import i18n from './CreateSecretManager.i18n'

interface CreateSecretManagerProps {
  hideLightModal: () => void
  onSuccess: () => void
}

export interface SecretManagerWizardData {
  detailsData?: DetailsData
  configureData?: VaultConfigFormData
}

const CreateSecretManager: React.FC<CreateSecretManagerProps> = ({ hideLightModal, onSuccess }) => {
  return (
    <StepWizard<SecretManagerWizardData>>
      <StepDetails name={i18n.nameStepDetails} />
      <StepConfigure name={i18n.nameStepConfigure} />
      <StepVerify name={i18n.nameStepVerify} hideLightModal={hideLightModal} onSuccess={onSuccess} />
    </StepWizard>
  )
}

export default CreateSecretManager
