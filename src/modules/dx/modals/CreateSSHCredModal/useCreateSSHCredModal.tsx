import React from 'react'
import { Dialog } from '@blueprintjs/core'
import { Button, StepWizard, useModalHook } from '@wings-software/uikit'

import StepSSHDetails from './views/StepDetails'
import StepAuthentication from './views/StepAuthentication'
import StepVerify from './views/StepVerify'

import type { DetailsForm } from './views/StepDetails'
import type { SSHConfigFormData } from './views/StepAuthentication'

import i18n from './CreateSSHCredModal.i18n'
import css from './useCreateSSHCredModal.module.scss'

export interface UseCreateSSHCredModalProps {
  onSuccess?: () => void
}

export interface UseCreateSSHCredModalReturn {
  openCreateSSHCredModal: () => void
  closeCreateSSHCredModal: () => void
}

export interface SSHCredSharedObj {
  detailsData?: DetailsForm
  authData?: SSHConfigFormData
}

const useCreateSSHCredModal = (props: UseCreateSSHCredModalProps): UseCreateSSHCredModalReturn => {
  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog
        className={css.dialog}
        isOpen={true}
        onClose={() => {
          hideModal()
        }}
      >
        <StepWizard<SSHCredSharedObj>>
          <StepSSHDetails name={i18n.titleDetails.toUpperCase()} />
          <StepAuthentication name={i18n.stepTitleAuth.toUpperCase()} onSuccess={props.onSuccess} />
          <StepVerify name={i18n.stepTitleVerify.toUpperCase()} closeModal={hideModal} />
        </StepWizard>
        <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={hideModal} className={css.crossIcon} />
      </Dialog>
    ),
    []
  )

  return {
    openCreateSSHCredModal: () => {
      showModal()
    },
    closeCreateSSHCredModal: hideModal
  }
}

export default useCreateSSHCredModal
