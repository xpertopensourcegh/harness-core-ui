import React from 'react'
import { Dialog } from '@blueprintjs/core'
import { Button, useModalHook } from '@wings-software/uikit'

import CreateSSHCredWizard from './CreateSSHCredWizard'
import css from './useCreateSSHCredModal.module.scss'

export interface UseCreateSSHCredModalProps {
  onSuccess?: () => void
}

export interface UseCreateSSHCredModalReturn {
  openCreateSSHCredModal: () => void
  closeCreateSSHCredModal: () => void
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
        <CreateSSHCredWizard {...props} hideModal={hideModal} />
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
