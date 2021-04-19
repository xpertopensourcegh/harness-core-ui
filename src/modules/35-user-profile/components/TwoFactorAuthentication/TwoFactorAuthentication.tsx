import React from 'react'
import { Color, Text } from '@wings-software/uicore'
import { Switch } from '@blueprintjs/core'
import { useAppStore, useStrings } from 'framework/exports'
import {
  TwoFactorAuthSettingsInfo,
  useDisableTwoFactorAuth,
  useEnableTwoFactorAuth,
  useGetTwoFactorAuthSettings
} from 'services/cd-ng'
import { useConfirmationDialog } from '@common/modals/ConfirmDialog/useConfirmationDialog'
import { useToaster } from '@common/exports'
import { useEnableTwoFactorAuthModal } from '@user-profile/modals/EnableTwoFactorAuth/useEnableTwoFactorAuthModal'

const TwoFactorAuthentication: React.FC = () => {
  const { getString } = useStrings()
  const { showSuccess, showError } = useToaster()
  const { currentUserInfo, updateAppStore } = useAppStore()
  const { data: authSettings } = useGetTwoFactorAuthSettings({ authMechanism: 'TOTP' })

  const { mutate: enableTwoFactorAuth } = useEnableTwoFactorAuth({})
  const { mutate: disableTwoFactorAuth } = useDisableTwoFactorAuth({})

  const handleEnableTwoFactorAuth = async (settings: TwoFactorAuthSettingsInfo): Promise<void> => {
    try {
      const enabled = await enableTwoFactorAuth({
        ...settings,
        twoFactorAuthenticationEnabled: true
      })
      if (enabled) {
        showSuccess(getString('userProfile.twoFactor.enableSuccess'))
        updateAppStore({ currentUserInfo: enabled.data })
      }
    } catch (e) {
      showError(e.data.message || e.message)
    }
  }

  const { openEnableTwoFactorAuthModal } = useEnableTwoFactorAuthModal({
    onSuccess: settings => handleEnableTwoFactorAuth(settings)
  })

  const { openDialog: disableTwoFactorAuthDialog } = useConfirmationDialog({
    titleText: getString('userProfile.twoFactor.disableTitle'),
    contentText: getString('userProfile.twoFactor.disableText'),
    confirmButtonText: getString('common.disable'),
    cancelButtonText: getString('cancel'),
    onCloseDialog: async (isConfirmed: boolean) => {
      if (isConfirmed) {
        try {
          const disabled = await disableTwoFactorAuth('' as any, { headers: { 'content-type': 'application/json' } })
          if (disabled) {
            showSuccess(getString('userProfile.twoFactor.disableSuccess'))
            updateAppStore({ currentUserInfo: disabled.data })
          }
        } catch (e) {
          showError(e.data.message || e.message)
        }
      }
    }
  })

  return (
    <>
      <Text color={Color.BLACK} font={{ weight: 'semi-bold' }}>
        {getString('userProfile.twofactorAuth')}
      </Text>

      <Switch
        data-testid={'TwoFactorAuthSwitch'}
        checked={currentUserInfo.twoFactorAuthenticationEnabled}
        onChange={event => {
          if (event.currentTarget.checked) {
            openEnableTwoFactorAuthModal(authSettings?.data)
          } else {
            disableTwoFactorAuthDialog()
          }
        }}
      />
    </>
  )
}

export default TwoFactorAuthentication
