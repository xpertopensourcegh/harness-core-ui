import React, { useState } from 'react'
import { useModalHook, Button } from '@wings-software/uicore'
import { Dialog, IDialogProps } from '@blueprintjs/core'
import { CreateDelegateWizard } from '@delegates/components/CreateDelegate/CreateDelegateWizard'
import css from './useCreateDelegateModal.module.scss'

export interface UseCreateDelegateModalProps {
  onClose?: () => void
}

export interface UseCreateDelegateModalReturn {
  openDelegateModal: (modalProps?: IDialogProps) => void
  closeDelegateModal: () => void
}

const useCreateDelegateModal = (
  useCreateDelegateModalProps?: UseCreateDelegateModalProps
): UseCreateDelegateModalReturn => {
  const [modalProps, setModalProps] = useState<IDialogProps>({
    isOpen: true,
    enforceFocus: false,
    style: {
      width: 1268,
      height: '100%',
      minHeight: 'auto',
      borderLeft: 0,
      paddingBottom: 0,
      position: 'relative',
      overflow: 'hidden'
    }
  })

  const [showModal, hideModal] = useModalHook(() => {
    const onClose: () => void = () => {
      useCreateDelegateModalProps?.onClose?.()
      hideModal()
    }
    return (
      <Dialog {...modalProps} onClose={onClose}>
        <CreateDelegateWizard onClose={onClose} />
        <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={onClose} className={css.crossIcon} />
      </Dialog>
    )
  }, [])
  return {
    openDelegateModal: (_modalProps?: IDialogProps | undefined) => {
      setModalProps(_modalProps || modalProps)
      showModal()
    },
    closeDelegateModal: hideModal
  }
}

export default useCreateDelegateModal
