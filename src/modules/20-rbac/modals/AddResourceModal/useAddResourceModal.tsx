import React, { useState } from 'react'
import cx from 'classnames'
import { useModalHook, Button } from '@wings-software/uicore'
import { Classes, Dialog } from '@blueprintjs/core'
import type { ResourceType } from '@rbac/interfaces/ResourceType'
import AddResourceModal from './views/AddResourceModal'
import css from './useAddResourceModal.module.scss'

export interface UseAddResourceModalProps {
  onSuccess: (resources: string[]) => void
}

export interface UseAddResourceModalReturn {
  openAddResourceModal: (resource: ResourceType) => void
  closeAddResourceModal: () => void
}

const useAddResourceModal = (props: UseAddResourceModalProps): UseAddResourceModalReturn => {
  const [resource, setResource] = useState<ResourceType>()
  const { onSuccess } = props
  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog
        isOpen={true}
        onClose={() => {
          hideModal()
        }}
        className={cx(css.dialog, Classes.DIALOG)}
      >
        {resource && (
          <AddResourceModal
            resource={resource}
            onSuccess={resources => {
              onSuccess(resources)
              hideModal()
            }}
            onClose={hideModal}
          />
        )}
        <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={hideModal} className={css.crossIcon} />
      </Dialog>
    ),
    [resource]
  )

  return {
    openAddResourceModal: (_resource: ResourceType) => {
      setResource(_resource)
      showModal()
    },
    closeAddResourceModal: hideModal
  }
}

export default useAddResourceModal
