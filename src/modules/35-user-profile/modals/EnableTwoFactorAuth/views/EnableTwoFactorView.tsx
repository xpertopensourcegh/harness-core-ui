import React from 'react'
import { Button, Color, Layout, Text } from '@wings-software/uicore'
import QRCode from 'react-qr-code'
import type { TwoFactorAuthSettingsInfo } from 'services/cd-ng'
import { useStrings } from 'framework/exports'

interface EnableTwoFactorAuthViewProps {
  authSettings: TwoFactorAuthSettingsInfo
  onEnable: () => void
  onCancel: () => void
}

const EnableTwoFactorAuthView: React.FC<EnableTwoFactorAuthViewProps> = ({ authSettings, onEnable, onCancel }) => {
  const { getString } = useStrings()
  return (
    <Layout.Vertical padding="huge">
      <Text color={Color.BLACK} font={{ size: 'medium', weight: 'bold' }}>
        {getString('userProfile.twofactorAuth')}
      </Text>
      <Layout.Vertical padding={{ top: 'large', bottom: 'large' }}>
        <Layout.Vertical spacing="medium" padding={{ bottom: 'large' }}>
          <Text>{getString('userProfile.qrCode')}</Text>
          <QRCode value={authSettings.totpqrurl || ''} />
        </Layout.Vertical>
        <Layout.Vertical spacing="medium">
          <Text>{getString('common.secretKey')}</Text>
          <Text>{authSettings.totpSecretKey}</Text>
        </Layout.Vertical>
      </Layout.Vertical>
      <Layout.Horizontal spacing="small">
        <Button intent="primary" text={getString('enable')} onClick={onEnable} />
        <Button text={getString('cancel')} onClick={onCancel} />
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export default EnableTwoFactorAuthView
