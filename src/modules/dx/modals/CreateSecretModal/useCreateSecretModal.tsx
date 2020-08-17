import React, { useState } from 'react'
import { useModalHook, Button, Text, Color } from '@wings-software/uikit'
import { Dialog } from '@blueprintjs/core'

import type { EncryptedDataDTO } from 'services/cd-ng'

import CreateUpdateSecret from 'modules/dx/components/CreateUpdateSecret/CreateUpdateSecret'

import i18n from './CreateSecretModal.i18n'
import css from './useCreateSecretModal.module.scss'

type SecretType = EncryptedDataDTO['type']

export interface UseCreateSecretModalProps {
  onSuccess?: () => void
}

export interface UseCreateSecretModalReturn {
  openCreateSecretModal: (type: SecretType) => void
  closeCreateSecretModal: () => void
}

const useCreateSecretModal = (props: UseCreateSecretModalProps): UseCreateSecretModalReturn => {
  const [type, setType] = useState<SecretType>('SecretText')

  const handleSuccess = (): void => {
    hideModal()
    props.onSuccess?.()
  }

  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog
        isOpen={true}
        onClose={() => {
          hideModal()
        }}
        className={css.dialog}
      >
        <Text font={{ size: 'medium' }} color={Color.BLACK} margin={{ bottom: 'large' }}>
          {type === 'SecretText' ? i18n.titleCreateText : i18n.titleCreateFile}
        </Text>
        <CreateUpdateSecret type={type} onSuccess={handleSuccess} />
        <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={hideModal} className={css.crossIcon} />
      </Dialog>
    ),
    [type]
  )

  return {
    openCreateSecretModal: (_type: SecretType) => {
      setType(_type)
      showModal()
    },
    closeCreateSecretModal: hideModal
  }
}

export default useCreateSecretModal
