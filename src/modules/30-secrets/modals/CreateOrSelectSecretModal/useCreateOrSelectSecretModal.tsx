import React from 'react'
import { useModalHook, Button } from '@wings-software/uikit'
import { Dialog } from '@blueprintjs/core'

import CreateOrSelectSecret from '@secrets/components/CreateOrSelectSecret/CreateOrSelectSecret'
import type { SecretReference } from '@secrets/components/CreateOrSelectSecret/CreateOrSelectSecret'
import type {
  SecretResponseWrapper,
  ResponsePageConnectorResponse,
  ResponsePageSecretResponseWrapper
} from 'services/cd-ng'
import type { UseGetMockData } from '@common/utils/testUtils'

import css from './useCreateOrSelectSecretModal.module.scss'

export interface UseCreateOrSelectSecretModalProps {
  type?: SecretResponseWrapper['secret']['type']
  onSuccess?: (secret: SecretReference) => void
  connectorsListMockData?: UseGetMockData<ResponsePageConnectorResponse>
  secretsListMockData?: ResponsePageSecretResponseWrapper
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
          {...props}
          onSuccess={secret => {
            /* istanbul ignore next */
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
