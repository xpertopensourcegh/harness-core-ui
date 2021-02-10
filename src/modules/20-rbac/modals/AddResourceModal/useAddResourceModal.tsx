import React, { useState } from 'react'
import { useModalHook, Button, Text, Color } from '@wings-software/uicore'
import { Dialog } from '@blueprintjs/core'
import type { ResourceHandler } from '@rbac/factories/RbacFactory'

export interface UseAddResourceModalProps {
  onSuccess?: () => void
}

export interface UseAddResourceModalReturn {
  openAddResourceModal: (resourceHandler: ResourceHandler) => void
  closeAddResourceModal: () => void
}

const useAddResourceModal = (_props: UseAddResourceModalProps): UseAddResourceModalReturn => {
  const [resourceHandler, setResourceHandler] = useState<ResourceHandler>()

  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog
        isOpen={true}
        onClose={() => {
          hideModal()
        }}
      >
        <Text font={{ size: 'medium' }} color={Color.BLACK} margin={{ bottom: 'large' }}>
          Add {resourceHandler?.label}
        </Text>

        <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={hideModal} />
      </Dialog>
    ),
    [resourceHandler]
  )

  return {
    openAddResourceModal: (_resourceHandler: ResourceHandler) => {
      setResourceHandler(_resourceHandler)
      showModal()
    },
    closeAddResourceModal: hideModal
  }
}

export default useAddResourceModal
