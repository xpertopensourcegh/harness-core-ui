import React from 'react'
import cx from 'classnames'
import { useModalHook } from '@wings-software/uicore'
import { Dialog, Classes } from '@blueprintjs/core'
import LockoutPolicyForm from '@common/modals/LockoutPolicy/views/LockoutPolicyForm'
import css from '@common/modals/LockoutPolicy/useLockoutPolicy.module.scss'

interface ModalReturn {
  openLockoutPolicyModal: () => void
  closeLockoutPolicyModal: () => void
}

export const useLockoutPolicy = (): ModalReturn => {
  const [showModal, hideModal] = useModalHook(() => (
    <Dialog isOpen title="" onClose={hideModal} className={cx(css.dialog, Classes.DIALOG)}>
      <LockoutPolicyForm hideModal={hideModal} />
    </Dialog>
  ))

  return {
    openLockoutPolicyModal: () => showModal(),
    closeLockoutPolicyModal: hideModal
  }
}
