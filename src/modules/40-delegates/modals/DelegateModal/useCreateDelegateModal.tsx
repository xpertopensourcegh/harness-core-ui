import React, { useState } from 'react'
import { useModalHook, Button } from '@wings-software/uikit'
import { Dialog, IDialogProps } from '@blueprintjs/core'
import css from './useCreateDelegateModal.module.scss'

export interface UseCreateDelegateModalProps {
  onSuccess?: () => void
  onClose?: () => void
}

export interface UseCreateDelegateModalReturn {
  openDelegateModal: () => void
  closeDelegateModal: () => void
}

const useCreateDelegateModal = (): UseCreateDelegateModalReturn => {
  const [modalProps, setModalProps] = useState<IDialogProps>({
    isOpen: true,
    style: {
      width: 1175,
      minHeight: 640,
      borderLeft: 0,
      paddingBottom: 0,
      position: 'relative',
      overflow: 'hidden'
    }
  })

  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog {...modalProps} onClose={() => hideModal()}>
        <h2>Hello World!</h2>
        <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={hideModal} className={css.crossIcon} />
      </Dialog>
    ),
    []
  )
  return {
    openDelegateModal: (_modalProps?: IDialogProps | undefined) => {
      setModalProps(_modalProps || modalProps)
      showModal()
    },
    closeDelegateModal: hideModal
  }
}

export default useCreateDelegateModal
