import React from 'react'
import { StepWizard } from '@wings-software/uicore'

import { useStrings } from 'framework/strings'
import StepSSHDetails from './views/StepDetails'
import StepAuthentication from './views/StepAuthentication'
import StepVerify from './views/StepVerify'

import type { DetailsForm } from './views/StepDetails'
import type { SSHConfigFormData } from './views/StepAuthentication'

import i18n from './CreateSSHCredModal.i18n'

interface CreateSSHCredWizardProps {
  onSuccess?: () => void
  hideModal?: () => void
}

export interface SSHCredSharedObj {
  detailsData?: DetailsForm
  authData?: SSHConfigFormData
  isEdit?: boolean
}

const CreateSSHCredWizard: React.FC<CreateSSHCredWizardProps & SSHCredSharedObj> = props => {
  const { isEdit } = props
  const { getString } = useStrings()

  return (
    <StepWizard<SSHCredSharedObj> icon="secret-ssh" iconProps={{ size: 37 }} title={getString('ssh.sshCredential')}>
      <StepSSHDetails name={i18n.titleDetails} {...props} />
      <StepAuthentication name={i18n.stepTitleAuth} onSuccess={props.onSuccess} isEdit={isEdit} />
      <StepVerify name={i18n.stepTitleVerify} closeModal={props.hideModal} />
    </StepWizard>
  )
}

export default CreateSSHCredWizard
