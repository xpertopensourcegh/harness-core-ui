import React from 'react'
import { StepWizard } from '@wings-software/uikit'

import type { ResponsePageSecretResponseWrapper } from 'services/cd-ng'
import StepSSHDetails from './views/StepDetails'
import StepAuthentication from './views/StepAuthentication'
import StepVerify from './views/StepVerify'

import type { DetailsForm } from './views/StepDetails'
import type { SSHConfigFormData } from './views/StepAuthentication'

import i18n from './CreateSSHCredModal.i18n'

interface CreateSSHCredWizardProps {
  onSuccess?: () => void
  hideModal?: () => void
  mockSecretReference?: ResponsePageSecretResponseWrapper
}

export interface SSHCredSharedObj {
  detailsData?: DetailsForm
  authData?: SSHConfigFormData
}

const CreateSSHCredWizard: React.FC<CreateSSHCredWizardProps> = props => {
  return (
    <StepWizard<SSHCredSharedObj>>
      <StepSSHDetails name={i18n.titleDetails.toUpperCase()} />
      <StepAuthentication
        name={i18n.stepTitleAuth.toUpperCase()}
        onSuccess={props.onSuccess}
        mockSecretReference={props.mockSecretReference}
      />
      <StepVerify name={i18n.stepTitleVerify.toUpperCase()} closeModal={props.hideModal} />
    </StepWizard>
  )
}

export default CreateSSHCredWizard
