import React from 'react'
import cx from 'classnames'
import { useModalHook } from '@wings-software/uicore'
import { Dialog, Classes } from '@blueprintjs/core'
import PasswordStrengthForm from '@common/modals/PasswordStrength/views/PasswordStrengthForm'
import css from '@common/modals/PasswordStrength/usePasswordStrength.module.scss'

interface ModalReturn {
  openPasswordStrengthModal: () => void
  closePasswordStrengthModal: () => void
}

export const usePasswordStrength = (): ModalReturn => {
  const [showModal, hideModal] = useModalHook(() => (
    <Dialog isOpen title="" onClose={hideModal} className={cx(css.dialog, Classes.DIALOG)}>
      <PasswordStrengthForm hideModal={hideModal} />
    </Dialog>
  ))

  return {
    openPasswordStrengthModal: () => showModal(),
    closePasswordStrengthModal: hideModal
  }
}
