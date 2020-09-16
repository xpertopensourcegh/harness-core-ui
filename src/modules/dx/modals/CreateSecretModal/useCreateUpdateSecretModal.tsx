import React, { useState } from 'react'
import { useModalHook, Button, Text, Color } from '@wings-software/uikit'
import { Dialog } from '@blueprintjs/core'

import type { SecretDTOV2 } from 'services/cd-ng'

import CreateUpdateSecret from 'modules/dx/components/CreateUpdateSecret/CreateUpdateSecret'

import i18n from './CreateSecretModal.i18n'
import css from './useCreateSecretModal.module.scss'

type SecretType = SecretDTOV2['type']

export interface UseCreateSecretModalProps {
  onSuccess?: () => void
}

export interface UseCreateSecretModalReturn {
  openCreateSecretModal: (type: SecretType, secret?: SecretDTOV2) => void
  closeCreateSecretModal: () => void
}

const useCreateUpdateSecretModal = (props: UseCreateSecretModalProps): UseCreateSecretModalReturn => {
  const [type, setType] = useState<SecretType>('SecretText')
  const [secret, setSecret] = useState<SecretDTOV2>()
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
        <CreateUpdateSecret secret={secret} type={type} onSuccess={handleSuccess} />
        <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={hideModal} className={css.crossIcon} />
      </Dialog>
    ),
    [type]
  )

  return {
    openCreateSecretModal: (_type: SecretType, _secret: SecretDTOV2 | undefined) => {
      setType(_type)
      setSecret(_secret)
      showModal()
    },
    closeCreateSecretModal: hideModal
  }
}

export default useCreateUpdateSecretModal
