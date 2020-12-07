import React, { useState } from 'react'
import { useModalHook, Button, Text, Color } from '@wings-software/uikit'
import { Dialog } from '@blueprintjs/core'

import type { SecretDTOV2, SecretResponseWrapper } from 'services/cd-ng'

import CreateUpdateSecret from '@secrets/components/CreateUpdateSecret/CreateUpdateSecret'

import { useStrings } from 'framework/exports'
import css from './useCreateSecretModal.module.scss'

type SecretType = SecretDTOV2['type']

export interface UseCreateSecretModalProps {
  onSuccess?: () => void
}

export interface UseCreateSecretModalReturn {
  openCreateSecretModal: (type: SecretType, secret?: SecretResponseWrapper) => void
  closeCreateSecretModal: () => void
}

const useCreateUpdateSecretModal = (props: UseCreateSecretModalProps): UseCreateSecretModalReturn => {
  const [type, setType] = useState<SecretType>('SecretText')
  const [secret, setSecret] = useState<SecretResponseWrapper>()
  const handleSuccess = (): void => {
    hideModal()
    props.onSuccess?.()
  }
  const { getString } = useStrings()
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
          {secret?.secret.identifier
            ? type === 'SecretText'
              ? getString('secret.titleEditText')
              : getString('secret.titleEditFile')
            : type === 'SecretText'
            ? getString('secret.titleCreateText')
            : getString('secret.titleCreateFile')}
        </Text>
        <CreateUpdateSecret secret={secret} type={type} onSuccess={handleSuccess} />
        <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={hideModal} className={css.crossIcon} />
      </Dialog>
    ),
    [type, secret]
  )

  return {
    openCreateSecretModal: (_type: SecretType, _secret: SecretResponseWrapper | undefined) => {
      setType(_type)
      setSecret(_secret)
      showModal()
    },
    closeCreateSecretModal: hideModal
  }
}

export default useCreateUpdateSecretModal
