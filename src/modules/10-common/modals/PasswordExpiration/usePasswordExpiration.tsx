import React from 'react'
import cx from 'classnames'
import { useModalHook } from '@wings-software/uicore'
import { Dialog, Classes } from '@blueprintjs/core'
import PasswordExpirationForm from '@common/modals/PasswordExpiration/views/PasswordExpirationForm'
import css from '@common/modals/PasswordExpiration/usePasswordExpiration.module.scss'

interface ModalReturn {
  openPasswordExpirationModal: () => void
  closePasswordExpirationModal: () => void
}

export const usePasswordExpiration = (): ModalReturn => {
  const [showModal, hideModal] = useModalHook(() => (
    <Dialog isOpen title="" onClose={hideModal} className={cx(css.dialog, Classes.DIALOG)}>
      <PasswordExpirationForm hideModal={hideModal} />
    </Dialog>
  ))

  return {
    openPasswordExpirationModal: () => showModal(),
    closePasswordExpirationModal: hideModal
  }
}
