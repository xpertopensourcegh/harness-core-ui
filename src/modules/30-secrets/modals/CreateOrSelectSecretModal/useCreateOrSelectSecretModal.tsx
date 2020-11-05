import React from 'react'
import { useModalHook, Button } from '@wings-software/uikit'
import { Dialog } from '@blueprintjs/core'

import CreateOrSelectSecret from '@secrets/components/CreateOrSelectSecret/CreateOrSelectSecret'
import type { SecretReference } from '@secrets/components/CreateOrSelectSecret/CreateOrSelectSecret'

import css from './useCreateOrSelectSecretModal.module.scss'

export interface UseCreateOrSelectSecretModalProps {
  onSuccess?: (secret: SecretReference) => void
}

export interface UseCreateOrSelectSecretModalReturn {
  openCreateOrSelectSecretModal: () => void
  closeCreateOrSelectSecretModal: () => void
}

const useCreateOrSelectSecretModal = (props: UseCreateOrSelectSecretModalProps): UseCreateOrSelectSecretModalReturn => {
  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog
        isOpen={true}
        onClose={() => {
          hideModal()
        }}
        className={css.dialog}
      >
        <CreateOrSelectSecret
          onSuccess={secret => {
            props.onSuccess?.(secret)
            hideModal()
          }}
        />
        <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={hideModal} className={css.crossIcon} />
      </Dialog>
    ),
    []
  )

  return {
    openCreateOrSelectSecretModal: () => {
      showModal()
    },
    closeCreateOrSelectSecretModal: hideModal
  }
}

export default useCreateOrSelectSecretModal
