import React, { useCallback, useState } from 'react'
import { useModalHook, Button } from '@wings-software/uicore'
import { Dialog, Classes } from '@blueprintjs/core'
import cx from 'classnames'
import type { TwoFactorAuthSettingsInfo } from 'services/cd-ng'
import EnableTwoFactorAuthView from '@user-profile/modals/EnableTwoFactorAuth/views/EnableTwoFactorView'
import css from './useEnableTwoFactorAuthModal.module.scss'

export interface UseEnableTwoFactorAuthModalProps {
  onSuccess?: (authSettings: TwoFactorAuthSettingsInfo) => void
  onCancel?: () => void
}

export interface UseEnableTwoFactorAuthModalReturn {
  openEnableTwoFactorAuthModal: (authSettings?: TwoFactorAuthSettingsInfo) => void
  closeEnableTwoFactorAuthModal: () => void
}

export const useEnableTwoFactorAuthModal = ({
  onSuccess
}: UseEnableTwoFactorAuthModalProps): UseEnableTwoFactorAuthModalReturn => {
  const [authSettings, setAuthSettings] = useState<TwoFactorAuthSettingsInfo>()

  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog
        isOpen={true}
        onClose={() => {
          hideModal()
        }}
        className={cx(css.dialog, Classes.DIALOG)}
      >
        {authSettings && (
          <EnableTwoFactorAuthView
            authSettings={authSettings}
            onEnable={() => {
              onSuccess?.(authSettings)
              hideModal()
            }}
            onCancel={hideModal}
          />
        )}

        <Button
          minimal
          icon="cross"
          iconProps={{ size: 18 }}
          onClick={() => {
            hideModal()
          }}
          className={css.crossIcon}
        />
      </Dialog>
    ),
    [authSettings]
  )

  const open = useCallback(
    (_authSettings?: TwoFactorAuthSettingsInfo) => {
      setAuthSettings(_authSettings)
      showModal()
    },
    [showModal]
  )
  return {
    openEnableTwoFactorAuthModal: (_authSettings?: TwoFactorAuthSettingsInfo) => open(_authSettings),
    closeEnableTwoFactorAuthModal: hideModal
  }
}
