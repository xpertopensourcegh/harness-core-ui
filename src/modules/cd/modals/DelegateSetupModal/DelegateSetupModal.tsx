import React from 'react'
import { ModalProvider, useModalHook, Button } from '@wings-software/uikit'
import { Dialog, IDialogProps } from '@blueprintjs/core'
import css from './DelegateSetupModal.module.scss'
import { DelegateStepWizard } from './DelegateStepWizard'

const DelegateModal: React.FC = () => {
  const modalPropsLight: IDialogProps = {
    isOpen: true,
    usePortal: true,
    autoFocus: true,
    canEscapeKeyClose: true,
    canOutsideClickClose: true,
    enforceFocus: true,
    style: { width: 1200, height: 600, borderLeft: 0, paddingBottom: 0, position: 'relative', overflow: 'hidden' }
  }

  const [openLightModal, hideLightModal] = useModalHook(() => (
    <Dialog {...modalPropsLight}>
      <DelegateStepWizard />
      <Button minimal icon="cross" iconProps={{ size: 18 }} onClick={hideLightModal} className={css.crossIcon} />
    </Dialog>
  ))

  return (
    <React.Fragment>
      <Button text="Delegate Setup" onClick={openLightModal} />
    </React.Fragment>
  )
}

export const DelegateSetupModal: React.FC = () => {
  return (
    <ModalProvider>
      <DelegateModal />
    </ModalProvider>
  )
}
